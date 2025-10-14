import { NextRequest, NextResponse } from "next/server";
import { refreshAccessToken } from "@/lib/spotify";

/**
 * Get current access token or refresh if needed
 * GET /api/auth/token
 */
export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("spotify_access_token")?.value;
  const refreshToken = request.cookies.get("spotify_refresh_token")?.value;

  console.log("Token endpoint - cookies present:", {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    allCookies: request.cookies.getAll().map((c) => c.name),
  });

  // If we have a valid access token, return it
  if (accessToken) {
    return NextResponse.json({ access_token: accessToken });
  }

  // If we have a refresh token, try to refresh
  if (refreshToken) {
    try {
      const tokenData = await refreshAccessToken(refreshToken);

      const response = NextResponse.json({
        access_token: tokenData.access_token,
      });

      // Update the access token cookie
      response.cookies.set("spotify_access_token", tokenData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: tokenData.expires_in,
        path: "/",
      });

      // Update refresh token if provided
      if (tokenData.refresh_token) {
        response.cookies.set("spotify_refresh_token", tokenData.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: "/",
        });
      }

      return response;
    } catch (err) {
      console.error("Error refreshing token:", err);
      return NextResponse.json(
        { error: "Failed to refresh token" },
        { status: 401 }
      );
    }
  }

  return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
}
