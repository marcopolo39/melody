# Quick Setup Guide for Spotify Integration

Follow these steps to get your Spotify API tokens working:

## Step 1: Create a Spotify Developer App

1. Visit https://developer.spotify.com/dashboard
2. Click "Create app"
3. Fill in:
   - App name: `Melody`
   - App description: `Local development app`
   - Redirect URI: `https://localhost:3000/api/auth/callback` ⚠️ **Must be exactly this!**
4. Save and copy your Client ID and Client Secret

## Step 2: Create `.env.local` file

Create a new file called `.env.local` in the `melody` directory with this content:

```env
SPOTIFY_CLIENT_ID=paste_your_client_id_here
SPOTIFY_CLIENT_SECRET=paste_your_client_secret_here
SPOTIFY_REDIRECT_URI=https://localhost:3000/api/auth/callback
SPOTIFY_SCOPES=user-read-private user-read-email user-top-read user-read-recently-played playlist-read-private
```

## Step 3: Run the App

```bash
npm run dev
```

Visit https://localhost:3000 and click "Login with Spotify"!

## Getting Your Access Token

After logging in, you'll be redirected to `/dashboard` where you can:

- See your Spotify profile
- Copy your access token
- Use the token to make API requests

## Making API Requests

```javascript
const response = await fetch("https://api.spotify.com/v1/me/top/tracks", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
const data = await response.json();
console.log(data);
```

## Common Scopes

Add to `SPOTIFY_SCOPES` (space-separated):

- `user-read-private` - Read user profile
- `user-read-email` - Read user email
- `user-top-read` - Read top artists/tracks
- `user-read-recently-played` - Read recently played
- `playlist-read-private` - Read private playlists
- `playlist-modify-public` - Modify public playlists
- `user-library-read` - Read saved tracks
- `user-read-playback-state` - Read playback state
- `user-modify-playback-state` - Control playback

Full list: https://developer.spotify.com/documentation/web-api/concepts/scopes
