import { useEffect, useState } from "react";

const useStagger = (items: any[], delay: number = 0.0375) => {
  const [animatedStates, setAnimatedStates] = useState<boolean[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const states = items.map(() => {
        return true; // All items will be animated
      });
      setAnimatedStates(states);
    }, 100); // Start animation after 100ms

    return () => clearTimeout(timer);
  }, [items]);

  return animatedStates.map((_, index) => ({
    isVisible: animatedStates[index],
    delay: animatedStates[index] ? `${index * delay}s` : "0s",
  }));
};

export default useStagger;
