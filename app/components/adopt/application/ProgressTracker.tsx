'use client';

import React from 'react';
import { RootState, useAppSelector } from '@redux/store';
import Icon from 'app/components/common/Icon';
import { checkIcon } from 'app/icons';

const styles = {
  wrapper: 'col-span-12 sm:col-span-3 flex sm:items-center sm:flex-col',
  step: 'h-5 w-5 sm:h-10 sm:w-10 rounded-full text-[11px] sm:text-sm text-white mb-1.5 mr-3 sm:mr-0 flex items-center justify-center z-10 font-QBold after:absolute after:content-[""] after:border-4 after:rounded-full after:w-8 after:h-8 sm:after:w-[52px] sm:after:h-[52px]',
  text: 'text-sm font-QBold',
  icon: 'text-white w-2.5 h-2.5',
};

const ProgressTracker = () => {
  const adoptionApplicationFee = useAppSelector(
    (state: RootState) => state.adoptionApplicationFee
  );
  const step = adoptionApplicationFee.step;

  return (
    <div className="max-w-md w-full px-4 sm:px-0 sm:gap-8 mx-auto mt-6 mb-10">
      <div className="grid grid-cols-12 gap-y-10 relative">
        <div className={styles.wrapper}>
          <div
            className={`${styles.step} ${
              step.step1
                ? 'bg-teal-400 after:border-teal-400'
                : 'bg-gray-200 after:border-gray-200'
            }`}
          >
            {step.step2 ? (
              <Icon icon={checkIcon} className={styles.icon}></Icon>
            ) : (
              '1'
            )}
          </div>
          <p className={`${styles.text} left-[13px]`}>Terms</p>
        </div>
        <div
          className={`h-[3px] absolute top-[40px] sm:top-5 -left-4 sm:left-12 rotate-90 sm:rotate-0 w-[52px] sm:w-[100px] ${
            step.step2 ? 'bg-teal-400' : 'bg-gray-200'
          }`}
        ></div>
        <div className={styles.wrapper}>
          <div
            className={`${styles.step}  ${
              step.step2
                ? 'bg-teal-400 after:border-teal-400'
                : 'bg-gray-200 after:border-gray-200'
            }`}
          >
            {step.step3 ? (
              <Icon icon={checkIcon} className={styles.icon}></Icon>
            ) : (
              '2'
            )}
          </div>
          <p className={`${styles.text}`}>Info</p>
        </div>
        <div
          className={`h-[3px] absolute top-[105px] sm:top-5 -left-4 sm:left-44 rotate-90 sm:rotate-0 w-[52px] sm:w-[100px]  ${
            step.step3 ? 'bg-teal-400' : 'bg-gray-200'
          }`}
        ></div>
        <div className={styles.wrapper}>
          <div
            className={`${styles.step}  ${
              step.step3
                ? 'bg-teal-400 after:border-teal-400'
                : 'bg-gray-200 after:border-gray-200'
            }`}
          >
            {step.step4 ? (
              <Icon icon={checkIcon} className={styles.icon}></Icon>
            ) : (
              '3'
            )}
          </div>
          <p className={`${styles.text}`}>Payment</p>
        </div>
        <div
          className={`h-[3px] absolute top-[170px] sm:top-5 -left-4 sm:left-72 rotate-90 sm:rotate-0 w-[52px] sm:w-[100px] ${
            step.step4 ? 'bg-teal-400' : 'bg-gray-200'
          }`}
        ></div>
        <div className={styles.wrapper}>
          <div
            className={`${styles.step}  ${
              step.step4
                ? 'bg-teal-400 after:border-teal-400'
                : 'bg-gray-200 after:border-gray-200'
            }`}
          >
            {step.step4 ? (
              <Icon icon={checkIcon} className={styles.icon}></Icon>
            ) : (
              '4'
            )}
          </div>
          <p className={`${styles.text} right-[11px]`}>Application</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
