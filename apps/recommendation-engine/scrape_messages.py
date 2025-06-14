import os
from imessage_reader import fetch_data
import sqlite3
from faker import Faker

cwd = os.getcwd()
chat_db_path = os.path.join(cwd, 'fake_chat_complete_v2.db')
print('Exists?', os.path.exists(chat_db_path))

con = sqlite3.connect(chat_db_path)
cur = con.cursor()
tables = cur.execute(
    "SELECT name FROM sqlite_master WHERE type='table';"
).fetchall()
print("Tables in DB:", [t[0] for t in tables])

cur.execute("""
CREATE TABLE if not exists message()
""")

# fd = fetch_data.FetchData(chat_db_path)
# messages = fd.get_messages()
# print(messages)