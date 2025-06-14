# Recommendation Engine

Python application that ingests user messages and outputs product recommendations for automated gift purchasing.

## Features

- iMessage chat history ingestion
- LLM processing for preference analysis
- Gift recommendation generation
- Database storage integration

## Setup

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the application:
   ```bash
   python main.py
   ```

## Development

- **Start development**: `pnpm dev` or `python main.py`
- **Run tests**: `pnpm test`
- **Lint code**: `pnpm lint`

## Architecture

This service processes chat history data using Large Language Models to understand user preferences and generate appropriate gift recommendations that are stored in the database for the purchase engine to execute.
