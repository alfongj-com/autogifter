# Frontend

Next.js application that collects user input for the Autogifter system.

## Features

- User account creation and authentication
- Agent balance management (funding for purchases)
- Friend data upload (chat history and birthdays)
- User input collection and validation

## Getting Started

First, run the development server:

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Development

- **Start development**: `pnpm dev`
- **Build for production**: `pnpm build`
- **Run tests**: `pnpm test`
- **Lint code**: `pnpm lint`

## Architecture

This Next.js application serves as the user interface for the Autogifter system, allowing users to manage their accounts, upload friend data, and configure automated gift purchasing preferences. It communicates with the recommendation engine and purchase engine to provide a complete gift automation experience.
