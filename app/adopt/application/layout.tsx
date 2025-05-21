import ProgressTracker from 'app/components/adopt/application/ProgressTracker';
import { ChildrenProps } from 'app/types/general-types';
import React, { FC } from 'react';

const AdoptionApplicationLayout: FC<ChildrenProps> = ({ children }) => {
  return (
    <div className="my-28">
      <ProgressTracker />
      {children}
    </div>
  );
};

export default AdoptionApplicationLayout;
