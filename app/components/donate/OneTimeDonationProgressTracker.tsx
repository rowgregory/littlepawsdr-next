import React, { FC } from 'react';
import { OneTimeDonationProgressTrackerProps } from 'app/types/donate-types';

const OneTimeDonationProgressTracker: FC<
  OneTimeDonationProgressTrackerProps
> = ({ step, setStep, type }) => (
  <div className={`${type === 'one-time' ? 'block' : 'hidden'}`}>
    <div className="hidden md:flex justify-evenly mt-4 mb-8 gap-4">
      <div
        onClick={() =>
          step.step2 || step.step3
            ? setStep({ step1: true, step2: false, step3: false })
            : {}
        }
        className={`${
          step.step1 ? 'border-teal-500' : 'border-gray-300 text-gray-400'
        } ${
          step.step2 || step.step3 ? 'cursor-pointer' : ''
        } border-b-4 text-xl tracking-wider px-8 w-full text-center pb-1 whitespace-nowrap`}
      >
        1. Gift Amount
      </div>
      <div
        onClick={() =>
          step.step3
            ? setStep((prev: any) => ({ ...prev, step2: true, step3: false }))
            : {}
        }
        className={`${
          step.step2 ? 'border-teal-500' : 'border-gray-300 text-gray-400'
        } ${
          step.step3 ? 'cursor-pointer' : ''
        } border-b-4 text-xl tracking-wider px-8 w-full text-center pb-1`}
      >
        2. Identity
      </div>
      <div
        className={`${
          step.step3 ? 'border-teal-500' : 'border-gray-300 text-gray-400'
        }  border-b-4 text-xl tracking-wider px-8 w-full text-center pb-1`}
      >
        3. Payment
      </div>
    </div>
    <div className="flex justify-between w-72 mx-auto md:hidden mt-4 mb-8">
      <div className="relative">
        <p className="text-gray-300 text-center absolute -top-6 -left-4 whitespace-nowrap">
          Gift Amount
        </p>
        <div
          className={`${
            step.step1 ? 'bg-teal-500' : 'bg-gray-300'
          } text-2xl font-Museo-Slab-700 w-12 h-12 rounded-full flex items-center justify-center text-white pb-1 aspect-square pt-2 relative after:content-[''] after:w-12 after:absolute after:top-6 after:left-[58px] after:border-2 after:border-gray-300`}
        >
          1
        </div>
      </div>
      <div className="relative">
        <p className="text-gray-300 text-center absolute -top-6 -left-1 whitespace-nowrap">
          Identity
        </p>
        <div
          className={`${
            step.step2 ? 'bg-teal-500' : 'bg-gray-300'
          } text-2xl font-Museo-Slab-700 w-12 h-12 rounded-full flex items-center justify-center text-white pb-1 aspect-square pt-2 relative after:content-[''] after:w-12 after:absolute after:top-6 after:left-[58px] after:border-2 after:border-gray-300`}
        >
          2
        </div>
      </div>
      <div className="relative">
        <p className="text-gray-300 text-center absolute -top-6 -left-2 whitespace-nowrap">
          Payment
        </p>
        <div
          className={`${
            step.step3 ? 'bg-teal-500' : 'bg-gray-300'
          } text-2xl font-Museo-Slab-700 w-12 h-12 rounded-full flex items-center justify-center text-white pb-1 aspect-square pt-2`}
        >
          3
        </div>
      </div>
    </div>
  </div>
);

export default OneTimeDonationProgressTracker;
