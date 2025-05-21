'use client';

import {
  saveFormData,
  setStep,
} from '@redux/features/adoptionApplicationFeeSlice';
import { useAppDispatch } from '@redux/store';
import AdoptionApplicationProcessSection from 'app/components/adopt/application/tos/AdoptionApplicationProcessSection';
import ApplicationFeeSection from 'app/components/adopt/application/tos/ApplicationFeeSection';
import ApplicationQualificationRequirementsSection from 'app/components/adopt/application/tos/ApplicationQualificationRequirementsSection';
import GoalSection from 'app/components/adopt/application/tos/GoalSection';
import MissionSection from 'app/components/adopt/application/tos/MissionSection';
import VirtualHomeVisitSection from 'app/components/adopt/application/tos/VirtualHomeVisitSection';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const TermsOfService = () => {
  const dispatch = useAppDispatch();
  const { push } = useRouter();

  useEffect(() => {
    dispatch(
      setStep({ step1: true, step2: false, step3: false, step4: false })
    );
  }, [dispatch]);

  const handleAcceptToS = () => {
    dispatch(saveFormData({ inputs: { acceptedTermsOfService: true } }));
    push('/adopt/application/applicant-info');
  };

  return (
    <div className="mt-12 w-full max-w-screen-sm mx-auto">
      <div className="h-[500px] overflow-y-scroll py-8 lg:px-6 border-[1px] border-gray-200 lg:rounded-2xl">
        <MissionSection />
        <GoalSection />
        <ApplicationFeeSection />
        <ApplicationQualificationRequirementsSection />
        <AdoptionApplicationProcessSection />
        <VirtualHomeVisitSection />
      </div>
      <button
        onClick={handleAcceptToS}
        className="mt-12 w-full py-2 font-QBold lg:rounded-2xl duration-200 bg-teal-400 text-white hover:shadow-lg"
      >
        I accept the conditions
      </button>
    </div>
  );
};

export default TermsOfService;
