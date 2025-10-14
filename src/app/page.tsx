import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans flex items-center justify-center min-h-screen p-8">
      <main className="flex flex-col gap-8 items-center text-center max-w-2xl">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
          Melody
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-400">
          Connect your Spotify account to get started
        </p>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          <a
            href="/api/auth/login"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
          >
            Login with Spotify
          </a>

          <p className="text-sm text-gray-500 dark:text-gray-500">
            By logging in, you agree to let this app access your Spotify data
          </p>
        </div>

        <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg w-full">
          <h2 className="text-lg font-semibold mb-3">What you can do:</h2>
          <ul className="text-left space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>✓ Access your Spotify profile</li>
            <li>✓ View your top tracks and artists</li>
            <li>✓ Get your recently played songs</li>
            <li>✓ Browse your playlists</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
