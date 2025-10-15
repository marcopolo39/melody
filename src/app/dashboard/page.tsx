import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { refreshAccessToken } from "@/lib/spotify";

export default async function Dashboard() {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("spotify_access_token")?.value;
  const refreshToken = cookieStore.get("spotify_refresh_token")?.value;
  const userCookie = cookieStore.get("spotify_user")?.value;

  console.log("Dashboard - cookies found:", {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    hasUserCookie: !!userCookie,
  });

  // If no access token but have refresh token, try to refresh
  if (!accessToken && refreshToken) {
    console.log("Access token missing, attempting refresh...");
    try {
      const tokenData = await refreshAccessToken(refreshToken);
      accessToken = tokenData.access_token;

      // Update cookies with new tokens
      const newCookies = await cookies();
      newCookies.set("spotify_access_token", tokenData.access_token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: tokenData.expires_in,
        path: "/",
      });

      if (tokenData.refresh_token) {
        newCookies.set("spotify_refresh_token", tokenData.refresh_token, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
        });
      }

      console.log("Token refreshed successfully");
    } catch (err) {
      console.error("Failed to refresh token:", err);
      redirect(`${process.env.BASE_URL}/?error=session_expired`);
    }
  }

  // If still no access token or user data, redirect to login
  if (!accessToken || !userCookie) {
    redirect(`${process.env.BASE_URL}/?error=not_authenticated`);
  }

  let user;
  try {
    user = JSON.parse(userCookie);
  } catch (err) {
    redirect(`${process.env.BASE_URL}/?error=invalid_user_data`);
  }

  return <DashboardClient user={user} accessToken={accessToken} />;
}
