import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;
  const userCookie = cookieStore.get("spotify_user")?.value;

  console.log("Dashboard - cookies found:", {
    hasAccessToken: !!accessToken,
    hasUserCookie: !!userCookie,
  });

  // If not authenticated, redirect to home
  if (!accessToken || !userCookie) {
    const headersList = await headers();
    const host = headersList.get("host") || "127.0.0.1:3000";
    const protocol = "http";
    redirect(`${protocol}://${host}/?error=not_authenticated`);
  }

  let user;
  try {
    user = JSON.parse(userCookie);
  } catch (err) {
    const headersList = await headers();
    const host = headersList.get("host") || "127.0.0.1:3000";
    const protocol = "http";
    redirect(`${protocol}://${host}/?error=invalid_user_data`);
  }

  return <DashboardClient user={user} accessToken={accessToken} />;
}
