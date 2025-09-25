# TaskyFlow

A modern, collaborative task management platform built with Next.js 15, TypeScript, Convex, and Tailwind CSS. TaskyFlow provides real-time collaboration features, comprehensive task management, direct messaging, and advanced analytics for teams and individuals.

## ✨ Features

### 🚀 Core Functionality
- **Real-time Collaboration** - Live updates for todos, comments, and messages across all devices
- **Smart Task Management** - Create, organize, and track tasks with priority levels, due dates, and custom tags
- **Threaded Comments System** - Collaborate through nested comments with real-time updates
- **Emoji Reactions** - Express feedback with emoji reactions on tasks, comments, and messages
- **Direct Messaging** - Built-in chat system with typing indicators, read receipts, and message reactions
- **Advanced Notifications** - Comprehensive notification system with customizable preferences
- **User Presence** - Online/offline status indicators and last seen timestamps

### 🎨 User Experience
- **Modern UI** - Beautiful, responsive interface built with shadcn/ui components
- **Dark/Light Mode** - Full theme support with system preference detection
- **Mobile Responsive** - Optimized for all devices with mobile-first design
- **Real-time Updates** - Instant synchronization using Convex subscriptions
- **Intuitive Navigation** - Clean, organized interface with easy-to-use controls

### 🔐 Authentication & Security
- **Multiple Auth Providers** - Sign in with GitHub, Google, or email/password
- **Secure Sessions** - Protected routes and secure authentication
- **User Management** - Profile management and notification preferences
- **Admin Dashboard** - Password-protected admin panel with comprehensive analytics

### 📊 Analytics & Admin Features
- **Comprehensive Analytics** - User activity, task completion rates, and engagement metrics
- **Real-time Dashboard** - Live data updates and performance monitoring
- **Admin Controls** - User management, system monitoring, and data insights
- **Export Capabilities** - Data export and reporting features

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui, Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **State Management**: Zustand, React Query (TanStack Query)
- **Icons**: Lucide React
- **Theming**: next-themes
- **Date Handling**: date-fns, react-day-picker

### Backend
- **Database**: Convex (real-time database and backend)
- **Authentication**: Convex Auth with multiple providers
- **Real-time**: Convex subscriptions for live updates
- **File Storage**: Convex file storage

### Development Tools
- **Package Manager**: Bun
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript
- **Build Tool**: Next.js with Turbopack

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** or **Bun** (recommended)
- **Convex account** - Sign up at [convex.dev](https://convex.dev)
- **Git** for version control

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd taskyflow
```

2. **Install dependencies:**
```bash
bun install
# or
npm install
```

3. **Set up environment variables:**
```bash
cp env.example .env.local
```

4. **Configure your `.env.local` file:**
```env
# Convex Configuration
CONVEX_DEPLOYMENT=your-deployment-url

# OAuth Providers (optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Authentication (optional)
RESEND_API_KEY=your-resend-api-key
```

5. **Start Convex development server:**
```bash
bun run convex:dev
```

6. **In a new terminal, start the Next.js development server:**
```bash
bun run dev
```

7. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

### Admin Setup

To access the admin dashboard:

1. **Set up admin password:**
```bash
bun run setup-admin your-secure-password
```

2. **Access admin dashboard:**
Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)

## 📁 Project Structure

```
taskyflow/
├── convex/                    # Convex backend functions
│   ├── auth.ts               # Authentication configuration
│   ├── schema.ts             # Database schema definitions
│   ├── todos.ts              # Todo CRUD operations
│   ├── comments.ts           # Comments system with threading
│   ├── reactions.ts          # Emoji reactions system
│   ├── chats.ts              # Direct messaging functionality
│   ├── users.ts              # User management and presence
│   ├── notifications.ts      # Notification system
│   └── admin.ts              # Admin analytics and management
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── auth/             # Authentication pages
│   │   ├── dashboard/        # Main dashboard
│   │   ├── chat/             # Chat conversation pages
│   │   ├── settings/         # User settings
│   │   ├── admin/            # Admin dashboard pages
│   │   └── page.tsx          # Landing page
│   ├── components/           # React components
│   │   ├── auth/             # Authentication components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── chat/             # Chat components
│   │   ├── admin/            # Admin dashboard components
│   │   ├── forms/            # Form components
│   │   ├── landing/          # Landing page components
│   │   ├── settings/         # Settings components
│   │   └── ui/               # shadcn/ui components
│   ├── hooks/                # Custom React hooks
│   └── lib/                  # Utility functions
├── scripts/                  # Setup and utility scripts
├── public/                   # Static assets
└── convex/                   # Convex configuration
```

## 🎯 Key Features

### 📝 Task Management
- **Create & Edit Tasks** - Rich task creation with title, description, and metadata
- **Priority Levels** - Low, Medium, High priority with visual indicators
- **Due Dates** - Date picker with validation and reminders
- **Custom Tags** - Predefined and custom tags for organization
- **Status Tracking** - TODO, In Progress, Done, Cancelled states
- **Public/Private** - Control task visibility and collaboration
- **Advanced Filtering** - Filter by status, priority, and ownership
- **Real-time Updates** - Live synchronization across all devices

### 💬 Comments System
- **Threaded Comments** - Nested comment structure for organized discussions
- **Real-time Updates** - Instant comment synchronization
- **Comment Moderation** - Task owners can edit/delete comments
- **User Attribution** - Clear user identification and timestamps
- **Optimized Queries** - Efficient database queries to prevent N+1 problems

### 😀 Reactions System
- **Emoji Reactions** - Express feedback with emoji reactions
- **Multi-target Support** - React to tasks, comments, and messages
- **Real-time Updates** - Live reaction synchronization
- **User Tracking** - See who reacted with what emoji
- **Toggle Functionality** - Add/remove reactions with single click

### 💬 Direct Messaging
- **One-on-one Conversations** - Private messaging between users
- **Real-time Delivery** - Instant message synchronization
- **Online Presence** - Online/offline status indicators
- **Typing Indicators** - See when others are typing
- **Read Receipts** - Track message read status
- **Message Reactions** - React to individual messages
- **Message Threading** - Reply to specific messages
- **Conversation Management** - Clear conversations and message history

### 🔐 Authentication & Security
- **Multiple Providers** - GitHub, Google, and email/password authentication
- **Secure Sessions** - Protected routes and session management
- **User Profiles** - Profile management and customization
- **Notification Preferences** - Granular control over notification types
- **Admin Access** - Password-protected admin dashboard

### 🔔 Notification System
- **Comprehensive Notifications** - Task comments, status changes, reactions, messages
- **Real-time Delivery** - Instant notification updates
- **Customizable Preferences** - Control what notifications you receive
- **Notification History** - View and manage past notifications
- **Mark as Read** - Individual and bulk read status management

### 📊 Admin Dashboard
- **Analytics Overview** - User activity, task completion rates, engagement metrics
- **User Management** - View user statistics and activity
- **Task Analytics** - Task creation, completion, and interaction data
- **Comment Analytics** - Comment activity and user engagement
- **Reaction Analytics** - Emoji usage patterns and popularity
- **Chat Analytics** - Message statistics and conversation activity
- **Real-time Updates** - Live data synchronization
- **Export Capabilities** - Data export and reporting features

## 🛠 Development

### Available Scripts

```bash
# Development
bun run dev              # Start Next.js development server with Turbopack
bun run convex:dev       # Start Convex development server
bun run setup-admin      # Set up admin password

# Production
bun run build            # Build for production
bun run start            # Start production server
bun run convex:deploy    # Deploy Convex backend

# Code Quality
bun run lint             # Run ESLint
```

### Development Workflow

1. **Database Schema**: Update `convex/schema.ts` for new data structures
2. **Backend Functions**: Add new files in `convex/` directory
3. **Frontend Components**: Add components in `src/components/`
4. **Pages**: Add new pages in `src/app/` directory
5. **Types**: Update TypeScript types as needed

### Code Architecture

- **Server Components**: Most UI components are server-rendered for better performance
- **Client Components**: Only components using React hooks, React Query, or theming use "use client"
- **Real-time Updates**: Convex subscriptions provide live data synchronization
- **Form Validation**: Zod schemas ensure data integrity
- **Error Handling**: Comprehensive error boundaries and user feedback

## 🚀 Deployment

### Backend Deployment

1. **Deploy Convex backend:**
```bash
bun run convex:deploy
```

2. **Update environment variables** with your Convex deployment URL

### Frontend Deployment

Deploy to your preferred platform:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**

### Environment Variables

Ensure these are set in your production environment:

```env
CONVEX_DEPLOYMENT=your-production-deployment-url
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
RESEND_API_KEY=your-resend-api-key
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following the existing code patterns
4. **Test thoroughly** - ensure all features work as expected
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- Follow the existing code patterns and architecture
- Use TypeScript for all new code
- Add proper error handling and user feedback
- Test your changes thoroughly
- Update documentation as needed
- Follow the commit message conventions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Convex** for the amazing real-time backend platform
- **shadcn/ui** for the beautiful component library
- **Next.js** team for the excellent React framework
- **Vercel** for the deployment platform
- **Tailwind CSS** for the utility-first CSS framework

## 📞 Support

If you have any questions or need help:

1. Check the [Issues](https://github.com/your-repo/taskyflow/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Made with ❤️ by the TaskyFlow team**