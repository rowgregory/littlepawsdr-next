import React from 'react';
import Icon from './Icon';
import { manifyingGlassIcon } from 'app/icons';

const SearchBar = ({ setText }: { setText: (text: string) => void }) => {
  return (
    <div className="w-full max-w-md flex items-center border-[1px] border-gray-200 rounded-2xl bg-white h-[34px] px-2">
      <Icon icon={manifyingGlassIcon} className="text-teal-400" />
      <input
        onChange={(e: any) => setText(e.target.value)}
        className="w-full h-full focus:outline-0 rounded-lg ml-2"
        placeholder="Search"
      />
    </div>
  );
};

export default SearchBar;
