import { useEffect } from "react";
import { RootState, useAppSelector } from "@redux/store";
import { useGetDachshundsByStatusMutation } from "@redux/services/rescueGroupsApi";

const useGetDachshundsByStatus = (
  status: string,
  pageLimit?: number,
  currentPage?: number
) => {
  const dachshund = useAppSelector((state: RootState) => state.dachshund);
  const [getDachshunds, { isLoading }] = useGetDachshundsByStatusMutation({
    selectFromResult: () => ({}),
  });

  useEffect(() => {
    getDachshunds({ status, pageLimit, currentPage });
  }, [getDachshunds, status, pageLimit, currentPage]);

  return { dachshund, isLoading };
};

export default useGetDachshundsByStatus;
