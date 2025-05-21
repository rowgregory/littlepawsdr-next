import { ChangeEvent, useState } from 'react';
import Icon from 'app/components/common/Icon';
import { fileAltIcon, listIcon } from 'app/icons';

const usePaginationControls = (pageAmounts: number) => {
  const [pageLimit, setPageLimit] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageLimitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageLimit(parseInt(e.target.value, 10));
  };

  const handlePageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(parseInt(e.target.value, 10));
  };

  const PageLimitSelect = () => (
    <div className="flex items-center gap-2 px-4 py-2 border-[1px] border-gray-200 rounded-2xl">
      <Icon icon={listIcon} className="text-teal-400" />
      <select
        value={pageLimit}
        onChange={handlePageLimitChange}
        className="focus:outline-none cursor-pointer"
      >
        {[50, 100, 150, 250].map((limit) => (
          <option key={limit} value={limit}>
            {limit}
          </option>
        ))}
      </select>
    </div>
  );

  const PageSelect = () => (
    <div className="flex items-center gap-2 px-4 py-2 border-[1px] border-gray-200 rounded-2xl">
      <Icon icon={fileAltIcon} className="text-teal-400" />
      <select
        value={currentPage}
        onChange={handlePageChange}
        className="focus:outline-none cursor-pointer"
      >
        {Array.from({ length: pageAmounts }, (_, index) => index + 1).map(
          (page) => (
            <option key={page} value={page}>
              {page}
            </option>
          )
        )}
      </select>
    </div>
  );

  return { PageLimitSelect, PageSelect, pageLimit, currentPage };
};

export default usePaginationControls;
