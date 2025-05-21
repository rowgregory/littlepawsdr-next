"use client";

import { usePathname } from "next/navigation";

const useCustomPathname = (): string => {
  const pathname = usePathname();

  return pathname;
};

export default useCustomPathname;
