# Purchase Engine

Next.js application that takes recommendations and executes automated purchases via external APIs.

## Features

- Scheduled job management (7-day advance timing)
- Recommendation retrieval from database
- External commerce API integration for purchasing
- Payment processing and shipment coordination
- Automated purchase execution on schedule

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

This Next.js application serves as the automated purchasing engine for the Autogifter system. It wakes up 7 days ahead of birthdays, retrieves gift recommendations from the database, and executes purchases through external commerce APIs. The service handles payment processing and coordinates shipment directly to gift recipients.   