# InboxIQ Server

This is the backend server for InboxIQ, an AI-powered email management system. It's built with Node.js, Express, and TypeScript.

## Prerequisites

- Node.js (v14 or later)
- Yarn (v1.22 or later)
- PostgreSQL (v12 or later)

## Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   yarn
   ```

3. Create a `.env` file in the root of the backend directory and add the following variables:
   ```
   cp .env.example .env
   ```

4. Set up the database:
   ```
   npx prisma migrate dev
   ```

## Available Scripts

In the project directory, you can run:

- `yarn dev`: Starts the server in development mode with hot-reloading.
- `yarn start`: Starts the server in production mode.
- `yarn test`: Runs the test suite.
- `yarn build`: Compiles TypeScript to JavaScript.
- `yarn lint`: Runs the linter to check for code style issues.

## Key Features

- OAuth 2.0 integration with Gmail and Outlook
- Real-time email synchronization using webhooks
- AI-powered email categorization and response generation using OpenAI
- RESTful API design
- PostgreSQL database with Prisma ORM

## Learn More

To learn more about the technologies used in this project:

- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [OpenAI API Documentation](https://beta.openai.com/docs/)
