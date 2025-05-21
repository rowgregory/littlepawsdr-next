import React from 'react';
import Logo from '../Logo';
import { topNavData } from '@public/static-data/navbar-data';
import TopHeaderInfoBox from './TopHeaderInfoBox';

const TopHeader = () => {
  return (
    <div className="max-w-[1150px] mx-auto w-full flex items-center justify-center sm:justify-between">
      <Logo className="w-32 sm:-ml-3" />
      <div className="hidden sm:flex items-center gap-12">
        {topNavData.map((obj, i) => (
          <TopHeaderInfoBox key={i} obj={obj} />
        ))}
      </div>
    </div>
  );
};

export default TopHeader;
