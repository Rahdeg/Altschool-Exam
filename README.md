# TaskyFlow

A modern, collaborative task management platform built with Next.js, TypeScript, Convex, and Tailwind CSS.

## Features

- 🚀 **Real-time Collaboration** - Live updates for todos, comments, and messages
- 📝 **Smart Task Management** - Create, organize, and track tasks with priority levels, due dates, and custom tags
- 💬 **Comments & Reactions** - Collaborate through threaded comments and emoji reactions
- 💬 **Direct Messaging** - Built-in chat system for seamless communication
- 🔐 **Multiple Auth Providers** - Sign in with GitHub, Google, or email/password
- 🎨 **Modern UI** - Beautiful, responsive interface built with shadcn/ui
- 📱 **Mobile Responsive** - Works perfectly on all devices

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Convex (real-time database and backend)
- **Authentication**: Convex Auth with multiple providers
- **UI Components**: shadcn/ui, Radix UI
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Convex account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd taskyflow
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Configure your `.env.local` file with:
   - Convex deployment URL
   - GitHub OAuth credentials (optional)
   - Google OAuth credentials (optional)
   - Resend API key for email auth (optional)

5. Start Convex development server:
```bash
bun run convex:dev
```

6. In a new terminal, start the Next.js development server:
```bash
bun run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
taskyflow/
├── convex/                 # Convex backend functions
│   ├── auth.ts            # Authentication configuration
│   ├── schema.ts          # Database schema
│   ├── todos.ts           # Todo CRUD operations
│   ├── comments.ts        # Comments system
│   ├── reactions.ts       # Reactions system
│   ├── chats.ts           # DM chat functionality
│   └── users.ts           # User management
├── src/
│   ├── app/               # Next.js app router pages
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Dashboard page
│   │   └── page.tsx       # Landing page
│   ├── components/        # React components
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── forms/         # Form components
│   │   ├── landing/       # Landing page components
│   │   └── ui/            # shadcn/ui components
│   └── lib/               # Utility functions
└── public/                # Static assets
```

## Key Features

### Task Management
- Create, edit, and delete tasks
- Set priority levels (Low, Medium, High)
- Add due dates and custom tags
- Mark tasks as public or private
- Filter by status and priority

### Comments System
- Threaded comments on tasks
- Real-time updates
- Comment moderation by task owners

### Reactions
- Emoji reactions on tasks and comments
- Real-time reaction updates
- View who reacted with what

### Direct Messaging
- One-on-one conversations
- Real-time message delivery
- Online/offline status indicators
- Typing indicators
- Message read receipts

### Authentication
- GitHub OAuth integration
- Google OAuth integration
- Email/password authentication
- Protected routes

## Development

### Available Scripts

- `bun run dev` - Start Next.js development server
- `bun run convex:dev` - Start Convex development server
- `bun run build` - Build for production
- `bun run lint` - Run ESLint

### Adding New Features

1. **Database Schema**: Update `convex/schema.ts`
2. **Backend Functions**: Add new files in `convex/` directory
3. **Frontend Components**: Add components in `src/components/`
4. **Pages**: Add new pages in `src/app/` directory

## Deployment

1. Deploy Convex backend:
```bash
bun run convex:deploy
```

2. Deploy Next.js frontend to Vercel, Netlify, or your preferred platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.