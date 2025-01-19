# AI Fitness Trainer Chatbot

A NestJS-based AI chatbot that acts as a personal fitness trainer, providing personalized workout routines, dietary advice, and fitness guidance using OpenAI's GPT-3.5 model.

## Features

- 🤖 AI-powered fitness and nutrition advice
- 🔐 JWT-based authentication
- 👥 Role-based access control (Admin/User)
- 📊 Response quality evaluation system
- 📈 Usage statistics and analytics
- 🛡️ Rate limiting protection

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- SQLite3

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
```

## Installation

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start the application
npm run start
```

For development:
```bash
# Start in development mode
npm run start:dev

# Start in debug mode
npm run start:debug
```

## API Endpoints

### AI Endpoints
- `POST /ai/chat` - Get personalized fitness advice
- `GET /ai/prompts/most-used` - Get most used prompts (Admin only)
- `GET /ai/stats/quality` - Get response quality statistics (Admin only)

## Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Tech Stack

- NestJS - Progressive Node.js framework
- TypeORM - ORM for database management
- SQLite - Database
- LangChain - AI/LLM framework
- OpenAI - GPT-3.5 model
- JWT - Authentication
- Class Validator - DTO validation
- AWS EC2 - Cloud hosting
- AWS CloudWatch - Monitoring and logging

## Deployment

The application is hosted on an AWS EC2 instance with CloudWatch monitoring enabled. You can access the live API at:

```
http://3.110.156.167:80
```

## Project Structure

```
src/
├── ai/                    # AI module
│   ├── dto/              # Data transfer objects
│   ├── types/            # Type definitions
│   ├── ai.controller.ts  # API endpoints
│   ├── ai.service.ts     # Business logic
│   └── evaluation.service.ts # Response evaluation
├── auth/                 # Authentication module
│   ├── guards/          # Auth guards
│   ├── strategies/      # JWT strategy
│   └── entities/        # Auth entities
├── database/            # Database module
└── app.module.ts        # Main application module
```
