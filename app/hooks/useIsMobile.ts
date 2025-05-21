import { useState, useEffect } from "react";

// Custom Hook to detect if the device is mobile based on screen width
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust for your breakpoint, here 768px is mobile
    };

    // Check on mount
    checkIfMobile();

    // Add event listener for window resizing
    window.addEventListener("resize", checkIfMobile);

    // Cleanup on unmount
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return isMobile;
};

export default useIsMobile;
