import React, { FC } from 'react';
import { handleStepTwo } from 'app/utils/donationHelpers';
import { OneTimeStepTwoProps } from 'app/types/donate-types';

const inputStyles =
  'auth-input bg-white border-[1px] w-full border-gray-300 rounded-md py-2.5 px-4 focus:outline-none';

const OneTimeStepTwo: FC<OneTimeStepTwoProps> = ({
  inputs,
  handleInput,
  errors,
  setErrors,
  setStep,
}) => {
  return (
    <form className="flex flex-col gap-4">
      <p className="col-span-12 text-sm">
        Donation Amount:
        <span className="text-sm ml-1">
          ${inputs.donationAmount || +inputs.otherAmount}
        </span>
      </p>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex flex-col w-full">
          <label className="text-sm mb-1" htmlFor="firstName">
            First name
          </label>
          <input
            name="firstName"
            id="firstName"
            onChange={handleInput}
            className={`${inputStyles}`}
            value={inputs?.firstName || ''}
          />
          {errors?.firstName && (
            <p className="text-sm text-red-500">{errors?.firstName}</p>
          )}
        </div>
        <div className="flex flex-col w-full">
          <label className=" text-sm mb-1" htmlFor="lastName">
            Last name
          </label>
          <input
            name="lastName"
            id="lastName"
            onChange={handleInput}
            className={`${inputStyles}`}
            value={inputs.lastName || ''}
          />
          {errors?.lastName && (
            <p className="text-sm text-red-500">{errors?.lastName}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col w-full">
        <label className=" text-sm mb-1" htmlFor="firstName">
          Email
        </label>
        <input
          name="email"
          id="email"
          onChange={handleInput}
          className={`${inputStyles}`}
          value={inputs.email || ''}
        />
        {errors?.email && (
          <p className="text-sm text-red-500">{errors?.email}</p>
        )}
      </div>
      <button
        onClick={(e: any) => handleStepTwo(e, inputs, setErrors, setStep)}
        className="bg-teal-400 text-white px-16 h-24 flex items-center justify-center font-QBold text-3xl mx-auto my-16 rounded-2xl hover:bg-teal-500 duration-200 focus:outline-none"
      >
        CONTINUE
      </button>
    </form>
  );
};

export default OneTimeStepTwo;
