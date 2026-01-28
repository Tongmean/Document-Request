// import React, { useState, useEffect, useCallback } from "react";
// import {jwtDecode} from "jwt-decode";
// import { useLogout } from "../hook/useLogout";

// const TokenTimer = ({ token }) => {
//   const [timeLeft, setTimeLeft] = useState(null);
//   const { logout } = useLogout();
//   const stableLogout = useCallback(logout, []);
//   useEffect(() => {
//     if (!token) {
//       stableLogout(); // Logs out the user
//       return;
//     }

//     let interval;
//     try {
//       const decodedToken = jwtDecode(token);
//       const expirationTime = decodedToken.exp * 1000; // Convert seconds to milliseconds

//       const calculateTimeLeft = () => Math.max(0, expirationTime - Date.now());

//       setTimeLeft(calculateTimeLeft());

//       interval = setInterval(() => {
//         const newTimeLeft = calculateTimeLeft();
//         setTimeLeft(newTimeLeft);
//         if (newTimeLeft <= 0) {
//           clearInterval(interval);
//           logout(); // Logs out and redirects the user
//         }
//       }, 1000);
//     } catch (error) {
//       console.error("Failed to decode token:", error);
//       logout(); // Logs out the user in case of invalid token
//     }

//     return () => clearInterval(interval);
//   }, [token, logout]);

//   const formatTime = (milliseconds) => {
//     const totalSeconds = Math.floor(milliseconds / 1000);
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = totalSeconds % 60;
//     return `${hours}h ${minutes}m ${seconds}s`;
//   };

//   if (timeLeft === null) return <div>Loading...</div>;
//   if (timeLeft <= 0) return <div>Session expired. Redirecting...</div>;

//   return <div>Time left: {formatTime(timeLeft)}</div>;
// };

// export default TokenTimer;
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useLogout } from "../hook/useLogout";

const TokenTimer = ({ token }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const { logout } = useLogout();

  useEffect(() => {
    // 1. Handle missing token immediately
    if (!token) {
      logout();
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000;

      const updateTimer = () => {
        const remaining = Math.max(0, expirationTime - Date.now());
        setTimeLeft(remaining);

        if (remaining <= 0) {
          logout();
        }
      };

      // Initial call to set time immediately
      updateTimer();

      // 2. Set interval to run every second (1000ms)
      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    } catch (error) {
      console.error("Invalid token:", error);
      logout();
    }
    
    // We remove 'logout' from dependencies to prevent infinite loops.
    // If your linter complains, ensure logout is memoized in useLogout hook.
  }, [token]); 

  // 3. Formatter: Removed seconds as requested
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    return `${hours}h ${minutes}m`;
  };

  if (timeLeft === null) return <div>Loading...</div>;
  if (timeLeft <= 0) return <div>Session expired. Redirecting...</div>;

  return <div>Time left: {formatTime(timeLeft)}</div>;
};

export default TokenTimer;