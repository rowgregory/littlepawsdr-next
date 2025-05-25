"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@redux/store";
import { setExp } from "@redux/features/feeExpSlice";
import { usePathname } from "next/navigation";

const InitExpFromCookie = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  useEffect(() => {
    const feeExp = document.cookie
      .split("; ")
      .find((row) => row.startsWith("feeExp="))
      ?.split("=")[1];

    if (feeExp) {
      dispatch(setExp(parseInt(feeExp)));
    }
  }, [dispatch, pathname]);

  return null;
};

export default InitExpFromCookie;
