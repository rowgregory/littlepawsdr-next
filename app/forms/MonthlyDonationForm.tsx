import React, { useState } from 'react';

const MonthlyDonationForm = ({ type }: any) => {
  const [amount, setAmount] = useState(25);

  return (
    <div className={`${type === 'monthly' ? 'flex flex-col' : 'hidden'}`}>
      <div className="flex flex-wrap gap-4">
        <form className="d-flex flex-column justify-content-between align-items-center"></form>
        <p className="font-Matter-Light text-xs mt-5 italic">
          These buttons redirect you from this site to PayPal for processing
        </p>
      </div>
    </div>
  );
};

export default MonthlyDonationForm;
