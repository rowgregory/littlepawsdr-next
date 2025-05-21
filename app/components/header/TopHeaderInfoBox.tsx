import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const TopHeaderInfoBox = ({ obj }: { obj: any }) => {
  return (
    <div className="flex gap-3">
      <FontAwesomeIcon icon={obj.icon} className="text-teal-400 fa-xl" />
      <div className="flex flex-col">
        <p className="font-quicksand text-sm text-[#9a9ca1]">{obj.titleKey}</p>
        <p className="font-quicksand text-15 text-[#feffff]">{obj.textKey}</p>
      </div>
    </div>
  );
};

export default TopHeaderInfoBox;
