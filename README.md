
# Socratic Learning Platform

A personalized learning platform built with Next.js, TypeScript, Prisma, and PostgreSQL. The platform uses AI-powered conversations to create engaging, Socratic-method learning experiences.

## Features

- **User Authentication**: Secure sign-up/sign-in with NextAuth.js
- **Personalized Curriculum**: AI-generated learning paths based on user interests
- **Interactive Learning**: Socratic method questioning with AI tutors
- **Progress Tracking**: Monitor learning progress across different topics
- **Journal System**: Reflect on learning experiences and track insights
- **Responsive Design**: Modern, accessible interface across all devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **AI Integration**: Google Gemini API
- **Authentication**: NextAuth.js with credentials provider

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kurtdev314/socratic.git
cd socratic
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your environment variables:
```
DATABASE_URL="postgresql://username:password@localhost:5432/socratic"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your-gemini-api-key"
```

4. Set up the database:
```bash
npx prisma migrate deploy
npx prisma generate
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Schema

The application uses the following main models:

- **User**: User accounts and authentication
- **Curriculum**: Personalized learning curricula
- **Progress**: User progress tracking per lesson
- **JournalEntry**: Learning reflections and insights

## API Endpoints

- `/api/auth/*` - Authentication endpoints
- `/api/curriculum/*` - Curriculum management
- `/api/teach/*` - AI tutoring sessions
- `/api/progress` - Progress tracking
- `/api/journal` - Journal entries

## Deployment

The application is optimized for deployment on various platforms including Vercel, Railway, and Replit.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the Socratic method of learning
- Built with modern web technologies for optimal performance
- Designed with accessibility and user experience in mind
