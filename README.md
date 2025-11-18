<div align="center">
  <a href="https://mistral-thing.xyz">
    <img src="public/icon-white.svg" alt="Logo" width="30%">
  </a>
  
  <h3 align="center">Mistral Thing</h3>

  <p align="center">
    An AI chat app with models from Mistral AI.
    <br />
    <a href="https://github.com/RodrigoRafaelSantos7/mistral-thing/issues">Report Bug</a>
    ·
    <a href="https://github.com/RodrigoRafaelSantos7/mistral-thing/issues">Request Feature</a>
  </p>
</div>

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/RodrigoRafaelSantos7/mistral-thing/blob/main/LICENSE)

---

## About The Project

Mistral Thing is a sleek and modern AI chat application that allows you to interact with large language models from Mistral AI. Built with a focus on user experience, it provides a clean interface for conversing with various Mistral AI models, managing conversation threads, and customizing your chat experience.

<div align="center">
  <img src="https://github.com/RodrigoRafaelSantos7/mistral-thing/blob/main/public/screenshot" alt="Screenshot" width="100%">
</div>

## Tech Stack

This project is built with modern technologies:

### Frontend

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Shadcn/UI](https://ui.shadcn.com/)** - UI component library
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[React Markdown](https://github.com/remarkjs/react-markdown)** - Markdown rendering
- **[Shiki](https://shiki.matsu.io/)** - Code syntax highlighting

### Backend

- **[Convex](https://convex.dev/)** - Backend-as-a-Service with real-time database
- **[Better Auth](https://www.better-auth.com/)** - Authentication system
- **[Mistral AI SDK](https://docs.mistral.ai/)** - AI model integration
- **[Resend](https://resend.com/)** - Email delivery service

### Development Tools

- **[Bun](https://bun.sh/)** - Package manager and runtime
- **[Biome](https://biomejs.dev/)** - Linter and formatter
- **[Ultracite](https://github.com/ultracite/ultracite)** - Code formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[mprocs](https://github.com/pvolok/mprocs)** - Process manager for development

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** - Version 22.x or higher
- **Bun** - Version 1.3.1 or higher ([Installation Guide](https://bun.sh/docs/installation))
- **Convex Account** - Sign up at [convex.dev](https://convex.dev)
- **Mistral AI API Key** - Get one from [console.mistral.ai](https://console.mistral.ai)
- **OAuth Credentials** (Optional, for social login):
  - GitHub OAuth App ([GitHub Developer Settings](https://github.com/settings/developers))
  - Google OAuth Client ([Google Cloud Console](https://console.cloud.google.com))
- **Resend API Key** (Optional, for magic link emails) - Get one from [resend.com](https://resend.com)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/RodrigoRafaelSantos7/mistral-thing.git
cd mistral-thing
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Set Up Convex

1. Install Convex CLI globally (if not already installed):

   ```bash
   bun add -g convex
   ```

2. Login to Convex:

   ```bash
   bunx convex login
   ```

3. Initialize Convex in your project:

   ```bash
   bunx convex dev
   ```

   This will:
   - Create a new Convex project (or link to an existing one)
   - Generate deployment URL
   - Start the Convex development server

4. Copy the `NEXT_PUBLIC_CONVEX_URL` from the Convex dashboard or terminal output.

### 4. Configure Environment Variables

#### Client-Side Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
```

#### Server-Side Environment Variables (Convex)

Set these in your Convex dashboard under **Settings > Environment Variables**:

**Required:**

- `MISTRAL_API_KEY` - Your Mistral AI API key
- `SITE_URL` - Your application URL (e.g., `http://localhost:3000` for development, `https://mistral-thing.xyz` for production)
- `CONVEX_SITE_URL` - Your Convex site URL (usually the same as `SITE_URL`)

**Optional (for OAuth):**

- `GITHUB_CLIENT_ID` - GitHub OAuth App Client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth App Client Secret
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret

**Optional (for Email Magic Links):**

- Configure Resend API key through the Convex dashboard (Settings > Integrations > Resend)

### 5. Set Up OAuth Providers (Optional)

#### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL to: `https://your-domain.com/api/auth/callback/github`
4. Copy the Client ID and Client Secret to Convex environment variables

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://your-domain.com/api/auth/callback/google`
6. Copy the Client ID and Client Secret to Convex environment variables

### 6. Initialize Models

After setting up Convex and environment variables, you need to populate the models in your database. The models are automatically fetched from Mistral AI and filtered to only include supported models.

The models will be automatically created when you first run the application, or you can trigger the model sync manually through the Convex dashboard.

## Getting Started

### Development Mode

Start the development servers (both Next.js and Convex):

```bash
bun run dev
```

This uses `mprocs` to run both:

- Convex development server (`bun x convex dev`)
- Next.js development server (`bun run next dev`)

The application will be available at:

- Frontend: `http://localhost:3000`
- Convex Dashboard: Check your terminal for the dashboard URL

### Production Build

1. Build the Next.js application:

   ```bash
   bun run build
   ```

2. Start the production server:
   ```bash
   bun run start
   ```

## Usage

### First Time Setup

1. **Sign In**: Navigate to the login page and choose your preferred authentication method:
   - Enter your email for a magic link
   - Sign in with Google
   - Sign in with GitHub

2. **Configure Settings**: After logging in, go to Account settings to:
   - Select your preferred AI model
   - Pin frequently used models
   - Set your nickname and biography
   - Add custom system instructions
   - Choose your theme and color mode

### Using the Chat Interface

1. **Start a New Conversation**: Click the "New Chat" button or start typing
2. **Select a Model**: Use the model selector to choose which Mistral AI model to use
3. **Send Messages**: Type your message and press Enter or click Send
4. **View Threads**: Access your conversation history from the sidebar
5. **Manage Threads**: Threads are automatically titled based on the first message

### Features

- **Streaming Responses**: Watch AI responses stream in real-time
- **Code Highlighting**: Code blocks are automatically syntax-highlighted
- **Markdown Support**: Full markdown rendering for formatted responses
- **Thread Organization**: Conversations are organized into threads with automatic titles
- **Session Management**: View and revoke active sessions from account settings

## Development

### Available Scripts

- `bun run dev` - Start development servers (Convex + Next.js)
- `bun run build` - Build the Next.js application for production
- `bun run start` - Start the production server
- `bun run check` - Run linting and type checking
- `bun run check:fix` - Fix linting issues automatically
- `bun run clean` - Remove `.next` and `node_modules` directories

### Code Quality

The project uses:

- **Biome** - Fast linter and formatter
- **TypeScript** - Type checking with strict mode
- **Ultracite** - Code formatting (via lint-staged)
- **Husky** - Git hooks for pre-commit checks

Code is automatically formatted on commit using lint-staged.

### Project Structure

```
mistral-thing/
├── convex/              # Convex backend functions
│   ├── auth.ts         # Authentication configuration
│   ├── chat.ts         # Chat and AI response generation
│   ├── models.ts       # Model management
│   ├── messages.ts     # Message handling
│   ├── threads.ts      # Thread management
│   ├── settings.ts     # User settings
│   ├── schema.ts       # Database schema
│   └── _generated/     # Auto-generated Convex files
├── src/
│   ├── app/            # Next.js App Router pages
│   │   ├── (auth)/     # Authentication pages
│   │   ├── (protected)/ # Protected routes
│   │   └── api/        # API routes
│   ├── components/     # React components
│   │   ├── ui/         # Shadcn/UI components
│   │   └── icons/      # Custom icons
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and stores
│   └── styles/         # Global styles and themes
├── public/             # Static assets
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

### Key Directories

- **`convex/`** - Backend logic, database schema, and Convex functions
- **`src/app/`** - Next.js pages and routes
- **`src/components/`** - Reusable React components
- **`src/lib/`** - Shared utilities, stores, and configuration
- **`public/`** - Static files (images, icons, etc.)

## Deployment

### Deploying to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Configure environment variables:
   - `NEXT_PUBLIC_CONVEX_URL` - Your Convex deployment URL
4. Update Convex environment variables with production URLs:
   - `SITE_URL` - Your Vercel deployment URL
   - `CONVEX_SITE_URL` - Your Vercel deployment URL
5. Deploy!

### Convex Deployment

Convex automatically deploys when you push to your main branch. For production:

1. Create a production deployment in Convex dashboard
2. Update environment variables for the production deployment
3. Use the production deployment URL in your frontend

## Troubleshooting

### Common Issues

**Convex connection errors:**

- Verify `NEXT_PUBLIC_CONVEX_URL` is set correctly
- Ensure Convex dev server is running
- Check Convex dashboard for deployment status

**Authentication not working:**

- Verify OAuth credentials are set in Convex environment variables
- Check callback URLs match your application URL
- Ensure `SITE_URL` and `CONVEX_SITE_URL` are set correctly

**AI responses not generating:**

- Verify `MISTRAL_API_KEY` is set in Convex environment variables
- Check API key is valid and has sufficient credits
- Review Convex logs for error messages

**Email magic links not sending:**

- Configure Resend integration in Convex dashboard
- Verify email domain is verified in Resend
- Check Convex logs for email sending errors

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Links

- **Live Demo**: [mistral-thing.xyz](https://mistral-thing.xyz)
- **Report Bug**: [GitHub Issues](https://github.com/RodrigoRafaelSantos7/mistral-thing/issues)
- **Request Feature**: [GitHub Issues](https://github.com/RodrigoRafaelSantos7/mistral-thing/issues)
