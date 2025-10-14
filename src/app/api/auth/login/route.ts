import { NextResponse } from "next/server";
import { generateRandomString, getSpotifyAuthUrl } from "@/lib/spotify";

/**
 * Initiate Spotify OAuth login
 * GET /api/auth/login
 */
export async function GET() {
  // Generate a random state for CSRF protection
  const state = generateRandomString(16);

  // Store state in a cookie (in production, consider using a session store)
  const authUrl = getSpotifyAuthUrl(state);

  const response = NextResponse.redirect(authUrl);

  // Set state cookie with secure options
  response.cookies.set("spotify_auth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  });

  return response;
}
