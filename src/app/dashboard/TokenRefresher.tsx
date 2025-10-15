"use client";

import { useEffect } from "react";

/**
 * Component that automatically refreshes the access token
 * before it expires to keep the user logged in
 */
export default function TokenRefresher() {
  useEffect(() => {
    // Refresh token 5 minutes before it expires (55 minutes)
    const REFRESH_INTERVAL = 55 * 60 * 1000; // 55 minutes in milliseconds

    const refreshToken = async () => {
      try {
        console.log("Proactively refreshing access token...");
        const response = await fetch("/api/auth/token", {
          credentials: "include",
        });

        if (response.ok) {
          console.log("Token refreshed successfully");
        } else {
          console.error("Token refresh failed:", response.status);
          // If refresh fails, redirect to login
          if (response.status === 401) {
            window.location.href = "/?error=session_expired";
          }
        }
      } catch (err) {
        console.error("Error refreshing token:", err);
      }
    };

    // Set up interval to refresh token periodically
    const interval = setInterval(refreshToken, REFRESH_INTERVAL);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // This component doesn't render anything
  return null;
}
