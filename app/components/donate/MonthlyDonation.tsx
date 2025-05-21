import React, { Fragment } from 'react';
import MonthlyDonationProgressTracker from './MonthlyDonationProgressTracker';
import MonthlyDonationForm from 'app/forms/MonthlyDonationForm';

const MonthlyDonation = ({ type }: { type: string }) => {
  return (
    <Fragment>
      <MonthlyDonationProgressTracker type={type} />
      <MonthlyDonationForm type={type} />
    </Fragment>
  );
};

export default MonthlyDonation;
