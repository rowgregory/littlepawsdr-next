import { feedAFosterData } from '@public/static-data/donate-data';
import FeedAFosterCard from 'app/components/donate/FeedAFosterCard';
import React from 'react';

const FeedAFoster = () => {
  return (
    <div className="max-w-[1150px] mx-auto w-full my-40 flex flex-col items-center justify-center">
      <h2 className="text-teal-400 text-xl font-QBold mb-5">
        Please join us and help Feed A Foster!
      </h2>
      <h1 className="text-5xl text-color mb-5 font-QBold">
        July is Foster Appreciation Month at LPDR!
      </h1>
      <p className="mb-4 text-center text-[#9d9d9d]">
        We are hosting our annual Feed a Foster fundraiser,
        <br /> right here, online!
      </p>
      <div className="grid grid-cols-12 gap-5">
        {feedAFosterData.map((obj, i) => (
          <FeedAFosterCard key={i} obj={obj} />
        ))}
      </div>
    </div>
  );
};

export default FeedAFoster;
