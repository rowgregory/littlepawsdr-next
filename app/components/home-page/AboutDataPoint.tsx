import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { checkIcon } from 'app/icons';
import React from 'react';

const AboutDataPoint = ({ text }: { text: string }) => {
  return (
    <div className="flex items-center col-span-6">
      <div className="w-3.5 h-3.5 mr-3.5 p-1 rounded-full flex items-center justify-center bg-teal-400">
        <FontAwesomeIcon icon={checkIcon} className="text-white w-2.5 h-2.5" />
      </div>
      <p className="text-[#787878] font-quicksand font-extralight">{text}</p>
    </div>
  );
};

export default AboutDataPoint;
