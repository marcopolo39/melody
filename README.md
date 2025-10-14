# Melody 🎵

A Next.js application integrated with the Spotify Web API to access your music data.

## Features

- 🎵 Spotify OAuth authentication
- 🔐 Secure token management with httpOnly cookies
- 👤 Access user profile information
- 🎧 View top tracks, artists, and recently played songs
- 📱 Modern, responsive UI with Tailwind CSS
- 🔒 HTTPS support for local development

## Prerequisites

- Node.js 18+ installed
- A Spotify account
- Spotify Developer account (free)

## Setup Instructions

### 1. Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create app"
4. Fill in the app details:
   - **App name**: Melody (or your preferred name)
   - **App description**: Your description
   - **Redirect URI**: `https://localhost:3000/api/auth/callback`
   - **Which API/SDKs are you planning to use?**: Check "Web API"
5. Click "Save"
6. On your app page, click "Settings"
7. Copy your **Client ID** and **Client Secret**

### 2. Configure Environment Variables

1. Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and replace the placeholders with your actual credentials:
   ```env
   SPOTIFY_CLIENT_ID=your_actual_client_id
   SPOTIFY_CLIENT_SECRET=your_actual_client_secret
   SPOTIFY_REDIRECT_URI=https://localhost:3000/api/auth/callback
   SPOTIFY_SCOPES=user-read-private user-read-email user-top-read user-read-recently-played playlist-read-private
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

The app is configured to run with HTTPS:

```bash
npm run dev
```

Open [https://localhost:3000](https://localhost:3000) in your browser.

**Note**: You may see a security warning about the self-signed certificate. This is normal for local development. Click "Advanced" and "Proceed to localhost" to continue.

### 5. Test the Integration

1. Click "Login with Spotify" on the home page
2. You'll be redirected to Spotify's authorization page
3. Approve the permissions
4. You'll be redirected back to `/dashboard` where you can see:
   - Your Spotify profile
   - Your access token
   - Example code for making API requests

## Project Structure

```
melody/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       ├── login/route.ts       # Initiate OAuth flow
│   │   │       ├── callback/route.ts    # Handle OAuth callback
│   │   │       └── token/route.ts       # Get/refresh access token
│   │   ├── dashboard/
│   │   │   └── page.tsx                 # Protected dashboard page
│   │   ├── layout.tsx                   # Root layout
│   │   ├── page.tsx                     # Home page
│   │   └── globals.css                  # Global styles
│   └── lib/
│       └── spotify.ts                   # Spotify API utilities
├── .env.local                           # Your environment variables (not in git)
├── .env.example                         # Example environment variables
└── package.json
```

## API Routes

- **GET `/api/auth/login`**: Initiates Spotify OAuth flow
- **GET `/api/auth/callback`**: Handles OAuth callback and exchanges code for tokens
- **GET `/api/auth/token`**: Returns current access token or refreshes if expired

## Using the Access Token

Once authenticated, you can make requests to the Spotify API:

```typescript
const response = await fetch("https://api.spotify.com/v1/me/top/tracks", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
const data = await response.json();
```

## Available Spotify API Endpoints

With the default scopes, you can access:

- `GET /v1/me` - Get current user's profile
- `GET /v1/me/top/tracks` - Get user's top tracks
- `GET /v1/me/top/artists` - Get user's top artists
- `GET /v1/me/player/recently-played` - Get recently played tracks
- `GET /v1/me/playlists` - Get user's playlists

See [Spotify Web API Reference](https://developer.spotify.com/documentation/web-api/reference) for more endpoints.

## Security Notes

- Tokens are stored in httpOnly cookies to prevent XSS attacks
- State parameter is used to prevent CSRF attacks
- Refresh tokens are stored securely and used to get new access tokens
- Never commit `.env.local` to version control

## Customizing Scopes

To request different permissions, modify the `SPOTIFY_SCOPES` in `.env.local`. Available scopes are listed in the [Spotify Authorization Scopes documentation](https://developer.spotify.com/documentation/web-api/concepts/scopes).

## Troubleshooting

### "Invalid redirect URI" error

Make sure the redirect URI in your `.env.local` exactly matches the one in your Spotify app settings (including `https://`).

### "state_mismatch" error

Clear your cookies and try logging in again.

### "Failed to refresh token" error

Your refresh token may have expired. Log out and log in again.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [Spotify Authorization Guide](https://developer.spotify.com/documentation/web-api/concepts/authorization)

## License

MIT
