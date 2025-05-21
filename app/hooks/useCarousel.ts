import { useState, useEffect } from "react";

const useCarousel = (items: string[], delay: number = 3000) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items?.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items?.length);
    }, delay);

    return () => clearInterval(interval);
  }, [items?.length, delay]);

  return {
    currentItem: items?.length > 0 ? items[currentIndex] : null,
    currentIndex,
    setCurrentIndex,
  };
};

export default useCarousel;
