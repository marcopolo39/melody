import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, getSpotifyProfile } from "@/lib/spotify";

/**
 * Handle Spotify OAuth callback
 * GET /api/auth/callback?code=...&state=...
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // Get state from cookie
  const storedState = request.cookies.get("spotify_auth_state")?.value;

  // Handle errors from Spotify
  if (error) {
    return NextResponse.redirect(
      new URL(`http://127.0.0.1:3000/?error=${encodeURIComponent(error)}`)
    );
  }

  // Verify state to prevent CSRF attacks
  if (!state || state !== storedState) {
    return NextResponse.redirect(
      new URL("http://127.0.0.1:3000/?error=state_mismatch")
    );
  }

  // Exchange code for access token
  if (!code) {
    return NextResponse.redirect(
      new URL("http://127.0.0.1:3000/?error=missing_code")
    );
  }

  try {
    // Get access token
    const tokenData = await getAccessToken(code);
    console.log("Got tokens from Spotify:", {
      hasAccessToken: !!tokenData.access_token,
      hasRefreshToken: !!tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
    });

    // Optionally, get user profile
    const profile = await getSpotifyProfile(tokenData.access_token);

    // Create redirect response - force 127.0.0.1 to avoid localhost
    const dashboardUrl = new URL("http://127.0.0.1:3000/dashboard");
    const response = NextResponse.redirect(dashboardUrl);

    // Store tokens in cookies (httpOnly: false so both server and client can read)
    response.cookies.set("spotify_access_token", tokenData.access_token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenData.expires_in,
      path: "/",
    });

    if (tokenData.refresh_token) {
      response.cookies.set("spotify_refresh_token", tokenData.refresh_token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
    }

    // Store user info
    response.cookies.set("spotify_user", JSON.stringify(profile), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // Clear the state cookie
    response.cookies.delete("spotify_auth_state");

    console.log("Cookies set, redirecting to dashboard");

    return response;
  } catch (err) {
    console.error("Error exchanging code for token:", err);
    return NextResponse.redirect(
      new URL(
        `http://127.0.0.1:3000/?error=${encodeURIComponent(
          "authentication_failed"
        )}`
      )
    );
  }
}
