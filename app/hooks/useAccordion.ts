import { useState } from "react";

interface UseAccordionProps {
  initiallyOpen?: boolean;
}

const useAccordion = ({ initiallyOpen = false }: UseAccordionProps) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  const toggleAccordion = () => {
    setIsOpen((prev) => !prev);
  };

  return {
    isOpen,
    toggleAccordion,
  };
};

export default useAccordion;
