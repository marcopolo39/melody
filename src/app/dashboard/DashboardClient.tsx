"use client";

import { useRouter } from "next/navigation";
import TokenRefresher from "./TokenRefresher";

interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: { url: string }[];
}

interface Props {
  user: SpotifyUser;
  accessToken: string;
}

export default function DashboardClient({ user, accessToken }: Props) {
  const router = useRouter();

  const handleLogout = () => {
    // Clear cookies
    document.cookie = "spotify_access_token=; Max-Age=0; path=/;";
    document.cookie = "spotify_refresh_token=; Max-Age=0; path=/;";
    document.cookie = "spotify_user=; Max-Age=0; path=/;";
    router.push("/");
  };

  return (
    <>
      <TokenRefresher />
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-6 mb-8">
              {user.images?.[0] && (
                <img
                  src={user.images[0].url}
                  alt="Profile"
                  className="w-24 h-24 rounded-full"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome, {user.display_name}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Your Access Token</h2>
              <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm break-all">{accessToken}</code>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Use this token to make requests to the Spotify API
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Example: Fetch Your Top Tracks
              </h2>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                {`fetch('https://api.spotify.com/v1/me/top/tracks', {
  headers: {
    'Authorization': \`Bearer \${accessToken}\`
  }
})
  .then(res => res.json())
  .then(data => console.log(data));`}
              </pre>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
