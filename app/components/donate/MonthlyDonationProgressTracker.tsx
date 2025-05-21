import React from 'react';

const MonthlyDonationProgressTracker = ({ type }: { type: string }) => (
  <div className={`${type === 'monthly' ? 'block' : 'hidden'}`}>
    <div className="flex mt-4 mb-8 gap-4">
      <div
        className={`border-teal-500 border-b-4 text-xl font-Matter-Medium tracking wider px-8 text-center pb-1 whitespace-nowrap w-1/3`}
      >
        1. Gift Amount
      </div>
    </div>
  </div>
);

export default MonthlyDonationProgressTracker;
