import { useCallback, useEffect, useState } from "react";

const useScrollAnimation = (threshold = 0.25) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const triggerPosition = window.innerHeight * threshold;

    if (scrollPosition > triggerPosition) {
      setIsVisible(true);
      window.removeEventListener("scroll", handleScroll);
    }
  }, [threshold]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return isVisible;
};

export default useScrollAnimation;
