import { useState, useMemo } from "react";

const useFilteredDachshunds = (dachshunds: any) => {
  const [text, setText] = useState("");

  const filteredDachshunds = useMemo(() => {
    if (!text) return dachshunds;

    return dachshunds.filter((dachshund: any) =>
      dachshund?.attributes?.name?.toLowerCase().includes(text.toLowerCase())
    );
  }, [dachshunds, text]);

  return { filteredDachshunds, text, setText };
};

export default useFilteredDachshunds;
