import { FC } from 'react';
import { OneTimeDonationOptionBtnProps } from 'app/types/donate-types';

const OneTimeDonationOptionBtn: FC<OneTimeDonationOptionBtnProps> = ({
  setInputs,
  num = 35,
  inputs,
}) => {
  return (
    <button
      onClick={(e: any) => {
        e.preventDefault();
        setInputs((prev: any) => ({
          ...prev,
          donationAmount: num,
          otherAmount: '',
        }));
      }}
      className={`py-4 px-[22px] rounded-2xl flex items-center justify-center text-white font-QBold cursor-pointer ${
        num === inputs.donationAmount ? 'bg-teal-400' : 'bg-gray-300'
      }`}
    >
      ${num}
    </button>
  );
};

export default OneTimeDonationOptionBtn;
