import { DonationOptionsProps } from 'app/types/donate-types';
import React, { FC } from 'react';

const btnStyles =
  'w-full h-20 text-xl font-QBold tracking-wide flex items-center justify-center whitespace-nowrap cursor-pointer rounded-2xl shadow-md hover:shadow-lg duration-200';

const DonationOptions: FC<DonationOptionsProps> = ({ type, setType }) => {
  return (
    <div className="flex items-center gap-3.5 -mt-10 z-10">
      <div
        onClick={() => setType('one-time')}
        className={`${
          type === 'one-time'
            ? 'text-white bg-teal-400'
            : 'text-teal-400 bg-white'
        } ${btnStyles}`}
      >
        ONE TIME
        <span
          className={`hidden sm:block text-xl ${
            type === 'one-time' ? 'text-white' : 'text-teal-400'
          }`}
        >
          &nbsp;DONATION
        </span>
      </div>
      <div
        onClick={() => setType('monthly')}
        className={`${
          type === 'monthly'
            ? 'text-white bg-teal-400'
            : 'text-teal-400 bg-white'
        } ${btnStyles}`}
      >
        MONTHLY
        <span
          className={`hidden sm:block text-xl ${
            type === 'monthly' ? 'text-white' : 'text-teal-400'
          }`}
        >
          &nbsp;DONATION
        </span>
      </div>
    </div>
  );
};

export default DonationOptions;
