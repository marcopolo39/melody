"use client";

import { useState } from "react";
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
  const [copied, setCopied] = useState(false);

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(accessToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

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
      <div className="min-h-screen p-8 relative bg-gradient-to-br from-black via-black to-gray-900">
        {/* Spotlight effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(168, 85, 247, 0.5) 0%, rgba(236, 72, 153, 0.4) 40%, rgba(59, 130, 246, 0.3) 100%)",
            }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-2xl"
            style={{
              background:
                "radial-gradient(circle, rgba(217, 70, 239, 0.4) 0%, rgba(139, 92, 246, 0.3) 60%, transparent 100%)",
            }}
          ></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
            {/* Glass shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-8">
                {user.images?.[0] && (
                  <img
                    src={user.images[0].url}
                    alt="Profile"
                    className="w-24 h-24 rounded-full"
                  />
                )}
                <div>
                  <h1 className="text-3xl font-bold mb-2 text-white">
                    Welcome, {user.display_name}!
                  </h1>
                  <p className="text-gray-300">{user.email}</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    Your Access Token
                  </h2>
                  <button
                    onClick={handleCopyToken}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors text-sm text-white"
                  >
                    {copied ? (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-black/30 border border-white/10 p-4 rounded-lg overflow-x-auto backdrop-blur-sm">
                  <code className="text-sm break-all text-green-400">
                    {accessToken}
                  </code>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Use this token to make requests to the Spotify API
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-white">
                  Example: Fetch Your Top Tracks
                </h2>
                <pre className="bg-black/30 border border-white/10 p-4 rounded-lg overflow-x-auto text-sm backdrop-blur-sm text-gray-300">
                  <code>{`fetch('https://api.spotify.com/v1/me/top/tracks', {
  headers: {
    'Authorization': \`Bearer \${accessToken}\`
  }
})
  .then(res => res.json())
  .then(data => console.log(data));`}</code>
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
      </div>
    </>
  );
}
