'use client';

import useGetDachshundsByStatus from '@hooks/useGetDachshundsByStatus';
import useStagger from '@hooks/useStagger';
import { RootState, useAppSelector } from '@redux/store';
import Hero from 'app/components/common/Hero';
import DachshundCard from 'app/components/dachshunds/DachshundCard';
import DogsOnHoldIntro from 'app/components/dachshunds/DogsOnHoldIntro';
import React from 'react';

const DogsOnHold = () => {
  const dachshund = useAppSelector((state: RootState) => state.dachshund);
  const dachshunds = dachshund.dachshunds;
  useGetDachshundsByStatus('Hold');
  const staggeredStates = useStagger(dachshunds || []);

  return (
    <div className="mb-40">
      <Hero
        bgImg="/images/hold.jpg"
        title="Not Available For Adoption Yet"
        breadcrumb="Dogs on Hold"
        className="bg-[0_45%]"
      />
      <div className="max-w-[1150px] mx-auto pt-32">
        <DogsOnHoldIntro />
        <div className="mb-32">
          <h1 className="text-3xl font-QBold mb-6">Dogs in Foster Homes</h1>
          <div className="mb-4 max-w-prose">
            <p className="mb-4">
              In addition to our Dogs Available for Adoption page, we’re also
              sharing our dogs in foster homes being evaluated for future
              adoptions.
            </p>
            <p className="mb-4">
              These dogs are at different stages of the evaluation process. They
              are all safe, happy, and well cared for in their foster homes.
            </p>
            <p className="mb-4">
              We’re providing you with some basic information about each dog. We
              hope these dogs will be up for adoption soon, and we will share
              additional details as they become available.
            </p>
            <p className="mb-4">
              Please continue to watch our Available Dogs page to see when a dog
              you may be interested in is ready for his or her forever home.
              That’s when we’ll be happy to accept an application from you.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-10">
          {dachshunds?.map((obj: any, i) => (
            <DachshundCard
              key={i}
              obj={obj}
              animate={staggeredStates[i]?.isVisible}
              delay={staggeredStates[i]?.delay}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DogsOnHold;
