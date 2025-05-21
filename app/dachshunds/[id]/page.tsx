'use client';

import { useParams } from 'next/navigation';
import { useGetDachshundByIdQuery } from '@redux/services/rescueGroupsApi';
import { RootState, useAppSelector } from '@redux/store';
import Carousel from 'app/components/common/Carousel';
import AdoptionInfoCards from 'app/components/adopt/AdoptionInfoCards';
import DachshundInfoSection from 'app/components/dachshunds/DachshundInfoSection';
import DachshundActionSection from 'app/components/dachshunds/DachshundActionSection';

const DachshundDetails = () => {
  const { id } = useParams() as any;
  const dachshundState = useAppSelector((state: RootState) => state.dachshund);
  const dachshund = dachshundState.dachshund;
  const dogStatusId: string = dachshund?.relationships?.statuses?.data[0]?.id;

  useGetDachshundByIdQuery(id);

  return (
    <div className="max-w-[1150px] mx-auto w-full py-20">
      <Carousel images={dachshund?.attributes?.photos} />
      <div className="grid grid-cols-12 gap-10 mt-16">
        <DachshundInfoSection dachshund={dachshund} />
        <DachshundActionSection
          dachshund={dachshund}
          dogStatusId={dogStatusId}
        />
        <AdoptionInfoCards />
      </div>
    </div>
  );
};

export default DachshundDetails;
