import { useState, useEffect } from "react";

export function useHooktheoryAuth() {
  const [authToken, setAuthToken] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  const authenticate = async () => {
    setIsAuthenticating(true);
    try {
      const response = await fetch("https://api.hooktheory.com/v1/users/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "beakace",
          password: "nUJ5!4PZRd",
        }),
      });

      const data = await response.json();
      setAuthToken(data.activkey);
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    authenticate();
  }, []);

  return { authToken, isAuthenticating };
}
