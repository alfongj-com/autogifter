# Project overview
AI agent that takes a chat history for a friend, and their birthday, and automatically selects and buys a gift for them 7d ahead.

## Components

### Gift recommendation engine
1. iMessage ingest
2. LLM processes and picks gifts
3. Invoke search API to select item
4. Put it all on DB
   
### Gift purchasing engine
1. Wakes up 7d ahead of birthday
2. Checks recommended item
3. Buys and ships to user

### Frontend
1. Create user account
2. Top up agent balance
3. Upload friend data
