# GitHub OAuth Integration Setup

## Overview
This task manager application now supports both traditional email/password authentication and GitHub OAuth login/registration.

## Changes Made

### 1. **Dependencies Added**
   - `passport` - Authentication middleware
   - `passport-github2` - GitHub OAuth strategy
   - `express-session` - Session management

### 2. **New Files Created**
   - `src/config/passport.ts` - GitHub OAuth strategy configuration
   - `src/controllers/github-controller.ts` - GitHub OAuth handlers
   - `.env.example` - Environment variables template

### 3. **Updated Files**
   - `src/index.ts` - Added session and passport middleware
   - `src/model/user-model.ts` - Added GitHub-related fields (githubId, githubUsername, profilePicture, authProvider)
   - `src/routes/user-route.ts` - Added GitHub OAuth routes
   - `src/controllers/user-controller.ts` - Fixed password handling for GitHub users
   - `src/views/login.ejs` - Added "Login with GitHub" button
   - `src/views/register.ejs` - Added "Sign up with GitHub" button

## Setup Instructions

### Step 1: Create GitHub OAuth Application
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: Your App Name
   - **Homepage URL**: `http://localhost:5500` (for development)
   - **Authorization callback URL**: `http://localhost:5500/user/auth/github/callback`
4. Copy your **Client ID** and **Client Secret**

### Step 2: Update Environment Variables
1. Copy `.env.example` to `.env`
2. Add your GitHub OAuth credentials:
   ```
   GITHUB_CLIENT_ID=your_client_id_here
   GITHUB_CLIENT_SECRET=your_client_secret_here
   GITHUB_CALLBACK_URL=http://localhost:5500/user/auth/github/callback
   ```
3. Make sure other variables are set:
   ```
   DB_URL=your_mongodb_url
   SECRET=your_jwt_secret
   SESSION_SECRET=your_session_secret
   PORT=5500
   ```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Build and Run
```bash
npm run build
npm start
# Or for development
npm run dev
```

## Features

### User Registration/Login Flow
- **Traditional**: Email + Password authentication
- **GitHub OAuth**: One-click registration and login
- Users can have accounts with either or both methods (if using same email)

### User Profile Data
When a user registers with GitHub, the following information is automatically captured:
- Name (from GitHub profile)
- Email (from GitHub email)
- Profile Picture (GitHub avatar)
- GitHub Username
- Default skill level: Junior

Users can later update their skill level and family name in their profile.

## Routes

### Authentication Routes
- `GET /user/auth/github` - Initiate GitHub OAuth login
- `GET /user/auth/github/callback` - GitHub OAuth callback (handled by Passport)
- `GET /logout` - Logout and clear session

### Existing Routes
- `POST /user/login` - Traditional email/password login
- `POST /user/register` - Traditional email/password registration

## API Notes

- Sessions are stored in memory (suitable for development)
- For production, implement a session store (MongoDB, Redis, etc.)
- JWT tokens are still used for cookie-based auth
- GitHub users don't have passwords; they authenticate via OAuth

## Troubleshooting

### "Invalid client id" error
- Verify your GitHub Client ID and Secret are correct
- Check that your callback URL matches in both GitHub settings and `.env`

### Users not being created on GitHub login
- Ensure MongoDB is running and connection string is correct
- Check that `authProvider` field is set to 'github' in the model

### Session not persisting
- Make sure `SESSION_SECRET` is set in `.env`
- For production, implement a persistent session store

## Production Deployment

Before deploying to production:
1. Set `GITHUB_CALLBACK_URL` to your production domain
2. Change `cookie.secure` to `true` in session middleware (requires HTTPS)
3. Implement a persistent session store (MongoDB or Redis)
4. Update GitHub OAuth app settings with production URLs
5. Set all environment variables securely

## Database Schema Updates

The User model now includes:
```typescript
{
  githubId: String (unique, sparse),
  githubUsername: String,
  profilePicture: String,
  authProvider: 'local' | 'github'
}
```

Passwords are optional for GitHub-authenticated users.
