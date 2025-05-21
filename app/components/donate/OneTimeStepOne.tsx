import React, { FC } from 'react';
import OneTimeDonationOptionBtn from './OneTimeDonationOptionBtn';
import { handleStepOne } from 'app/utils/donationHelpers';
import { oneTimeDonationOptions } from '@public/static-data/donate-data';
import { OneTimeStepOneProps } from 'app/types/donate-types';

const OneTimeStepOne: FC<OneTimeStepOneProps> = ({
  setInputs,
  inputs,
  handleInput,
  errors,
  setErrors,
  setStep,
}) => {
  return (
    <form className="flex flex-col">
      <div className="flex flex-wrap gap-4">
        {oneTimeDonationOptions.map((num, i) => (
          <OneTimeDonationOptionBtn
            key={i}
            setInputs={setInputs}
            num={num}
            inputs={inputs}
          />
        ))}
        <input
          name="otherAmount"
          type="number"
          onChange={handleInput}
          placeholder="Other"
          className="border-2 border-gray-300 py-4 px-[22px] w-[100px] rounded-2xl focus:outline-none font-QBold"
          value={inputs.otherAmount || ''}
          onClick={() =>
            setInputs((prev: any) => ({ ...prev, donationAmount: 0 }))
          }
        />
      </div>
      {errors?.donationAmount && (
        <p className="text-sm text-red-500 mt-0.5">{errors?.donationAmount}</p>
      )}
      <button
        onClick={(e: any) => handleStepOne(e, inputs, setErrors, setStep)}
        className="bg-teal-400 text-white px-16 h-24 flex items-center justify-center font-QBold text-3xl mx-auto my-16 rounded-2xl hover:bg-teal-500 duration-200 shadow-lg"
      >
        CONTINUE
      </button>
    </form>
  );
};

export default OneTimeStepOne;
