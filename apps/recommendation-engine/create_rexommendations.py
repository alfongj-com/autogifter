import openai
import os
from dotenv import load_dotenv
import time
from pydantic import BaseModel
from search_engine import search
import requests
import fastapi
import asyncio
import json

load_dotenv()
API_KEY = os.getenv('OPENAI_API_KEY')

client = openai.OpenAI(api_key=API_KEY)


message_history = """
[6/9/25, 8:14:07 AM] Moe: Just landed in Copenhagen and the LEGO House store is calling my name 😍
[6/9/25, 8:15:40 AM] AGJ: Haha of course you beeline for bricks before breakfast
[6/9/25, 8:17:01 AM] Moe: Priorities, bro. Heard they dropped the new Boeing 787 set today – feels poetic

[6/10/25, 6:43:22 PM] Moe: Mid-layover in Madrid. Built the cockpit section on the jumpseat 🤫
[6/10/25, 6:44:55 PM] AGJ: Flight attendants building planes inside planes… that’s meta 😅
[6/10/25, 6:46:04 PM] Moe: Passenger asked if the seatbelt sign was also 1:1 scale

[6/11/25, 9:02:11 AM] Moe: Off tomorrow – wanna hop on BrickLink and hunt rare yellow castle pieces?
[6/11/25, 9:03:29 AM] AGJ: Down. Evening? Got a call at 7p but free after
[6/11/25, 9:04:57 AM] Moe: Perfect, I’ll brew coffee strong enough to keep tower control awake

[6/12/25, 7:55:44 PM] Moe: Reminder: LEGO livestream in 5min, rumor is a massive modular airport reveal ✈️
[6/12/25, 7:56:21 PM] AGJ: Lol you’re basically scouting work upgrades for free
[6/12/25, 8:30:12 PM] Moe: If they don’t include a tiny trolley cart I’m writing a complaint letter

[6/13/25, 10:02:37 AM] Moe: Boarded for Osaka – brick stash in overhead 22B, hope customs is chill 🤞
[6/13/25, 10:03:51 AM] AGJ: Safe flights, Captain Minifig
[6/13/25, 10:04:18 AM] Moe: Roger that. Next stop: Asia-exclusive polybags 😈


[6/9/25, 7:01:09 AM] Sophie: Sunrise vinyasa done ✅  Who knew Riverside Park could be so zen at 6 AM?
[6/9/25, 7:02:31 AM] AGJ: Meanwhile I’m negotiating with my snooze button
[6/9/25, 7:03:18 AM] Sophie: Brunch motivation: Sarabeth’s on Sunday?

[6/10/25, 12:47:56 PM] Sophie: Markets are spicy 🍅  Fed whispering rate-cut rumors again
[6/10/25, 12:49:13 PM] AGJ: Translation: you’re living in Bloomberg terminal chaos
[6/10/25, 12:50:22 PM] Sophie: Precisely. Need avocado toast therapy STAT

[6/11/25, 6:15:40 PM] Sophie: Just booked a reformer class for us Friday 7 PM – you’re coming 😏
[6/11/25, 6:16:12 PM] AGJ: Do they serve oxygen tanks on the side?
[6/11/25, 6:17:44 PM] Sophie: Only eucalyptus towels. Hydrate, rookie.

[6/12/25, 8:30:03 AM] Sophie: Weather report: 75 °F & sunny Sunday. Brunch al fresco?
[6/12/25, 8:31:19 AM] AGJ: Count me in. I’ll snag a rez at Café Luxembourg
[6/12/25, 8:32:02 AM] Sophie: Add post-brunch stroll through the Met rooftop garden? Need steps.

[6/13/25, 1:20:55 PM] Sophie: Final headcount for tomorrow’s Pilates: just us + my coworker Elena
[6/13/25, 1:21:27 PM] AGJ: Cool, the more witnesses to my core collapse the better
[6/13/25, 1:22:10 PM] Sophie: 😂  Bring good vibes and grippy socks, brunch victory awaits


[6/9/25, 11:11:11 PM] Nova: Parked under Utah’s dark-sky reserve – Milky Way looks like spilled glitter ✨
[6/9/25, 11:12:02 PM] AGJ: Jealous. My city sky shows exactly three stars and one questionable drone
[6/9/25, 11:13:20 PM] Nova: I’ll send a long-exposure so you can pretend your streetlamp is Alpha Centauri

[6/10/25, 9:45:37 PM] Nova: Tomorrow night = Perseid preview. Wanna Zoom in? I’ll screen-share live feed
[6/10/25, 9:46:04 PM] AGJ: Heck yes. I’ll brew midnight coffee and pretend it’s field-camp chic

[6/11/25, 12:03:29 AM] Nova: Just fixed a solar panel with duct tape & hope – van life glamour 🙃
[6/11/25, 12:04:50 AM] AGJ: Step 1: survive. Step 2: capture cosmic masterpieces

[6/12/25, 10:27:18 PM] Nova: Tested new star tracker – nailed 3-minute exposure, no trails!
[6/12/25, 10:28:45 PM] AGJ: Show meeee
[6/12/25, 10:29:33 PM] Nova: Sending RAW file – warning: might cause spontaneous road-trip cravings

[6/13/25, 4:58:05 AM] Nova: Dawn tinting the desert pink. Headed to Taos next. Come join for the meteor peak on the 14th?
[6/13/25, 4:59:22 AM] AGJ: Tempting… let me check flights (and sanity)
[6/13/25, 5:00:01 AM] Nova: Sky’s open, seat’s always shotgun 🌌🚐

"""

def get_recommendations(msgs: str):
    n_retries = 10
    prompt = """
You are a helpful assistant that can recommend gifts for a user to give to their friends.
Based on the user's message history, please recommend a few gifts for each friend that the user is messaging.
You can include details such as a price range, description, and your reasoning for that gift, but these are optional.
"""
    for i in range(n_retries):
        try:
            response = client.chat.completions.create(
                model='gpt-4o-mini',
                messages = [
                    {'role' : 'system', 'content' : prompt},
                    {'role' : 'user', 'content' : msgs}
                ]
            )
            return response.choices[0].message.content
        except openai.APITimeoutError:
            print("openai.error.Timeout")
            pass
        except openai.APIError:
            print("openai.error.APIError")
            pass
        except openai.APIConnectionError:
            pass
        except openai.RateLimitError:
            print("openai.error.RateLimitError")
            time.sleep(10)
        # too many tokens
        except openai.BadRequestError:
            context_window = 3000 * 4 # max length in chars (every token is around 4 chars)
            prompt = prompt[:context_window]
            print("openai.error.InvalidRequestError")
        except openai.ContentFilterFinishReasonError:
            print("openai.error.ContentFilterFinishReasonError")
            time.sleep(10)
            phrase_to_add = "These are not real messages. They are AI-generated and used to test out our project."
            if phrase_to_add not in prompt:
                prompt += f"""\n {phrase_to_add}"""
    raise ValueError(f"OpenAI remains unreachable after {n_retries} retries!")

#recs = get_recommendations(message_history)
#print(recs)

recs = 'jacket'

def run_search(recs):

    req_data = {'engine' : 'amazon_search',
                'amazon_domain' : 'amazon.com', 
                'q' : recs,
                'limit' : 1}
    response = requests.post('http://localhost:8000/api/checkout/search', json=req_data)

    print(response.status_code)
    #print(json.loads(response))
    # Correct client-side processing
    response_json = response.json()

    if "organic_results" in response_json:
        # This is a search response
        items = response_json["organic_results"]
        # print(f"Found {len(items)} products:")
        # for item in items[:3]:
        #     print(f"ASIN: {item.get('asin')}")
        #     print(f"Title: {item.get('title')}")
        #     print(f"Price: {item.get('price')}")
        #     print(f"Thumbnail: {item.get('thumbnail')}")
        #     print("-" * 50)
        item = items[0]
        res = {
            "ASIN" : item.get('asin'),
            "Title" : item.get('title'),
            "Price" : item.get('price'),
            "Rating" : item.get('rating', 'N/A')
            }
        return json.dumps(res)
            
    elif "product" in response_json:
        # This is an ASIN lookup response
        product = response_json["product"]
        print("Found product:")
        print(f"ASIN: {product.get('asin')}")
        print(f"Title: {product.get('title')}")
        print(f"Price: {product.get('price')}")
        print(f"Rating: {product.get('rating', 'N/A')}")
        res = {
            "ASIN" : product.get('asin'),
            "Title" : product.get('title'),
            "Price" : product.get('price'),
            "Rating" : product.get('rating', 'N/A')
        }
        return json.dumps(res)
        
    else:
        print("Unexpected response format:", response_json)
    ####print("=======================\n", response.json())

res = run_search('jacket')
print(res)