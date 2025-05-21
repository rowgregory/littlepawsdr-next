import { shopToHelpData } from '@public/static-data/donate-data';
import ShopToHelpCard from 'app/components/donate/ShopToHelpCard';
import React from 'react';

const ShopToHelp = () => {
  return (
    <div>
      <div className="max-w-[900px] mx-auto w-full my-40 px-3 lg:px-0">
        <h1 className="text-3xl sm:text-4xl text-teal-400 font-QBold text-center mb-4">
          Shop To Help
        </h1>
        <p className="max-w-screen-sm mx-auto w-full text-center mb-10">
          Support Little Paws Dachshund Rescue by shopping with our partners!
          Each purchase helps provide the supplies and resources needed to care
          for our dachshunds. Shop today and make a difference in a pup’s life!
        </p>
        <div className="grid grid-cols-12 gap-3 sm:gap-6">
          {shopToHelpData.map((obj, i) => (
            <ShopToHelpCard key={i} obj={obj} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopToHelp;
