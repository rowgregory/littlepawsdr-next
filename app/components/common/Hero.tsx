'use client';

import React from 'react';
import { chevronRightIcon } from 'app/icons';
import Icon from './Icon';

const Hero = ({ bgImg, title, breadcrumb, className }: any) => {
  return (
    <div className="relative">
      <div
        style={{
          backgroundImage: `url(${bgImg})`,
        }}
        className={`${className} bg-cover bg-no-repeat h-[350px] w-full`}
      ></div>
      <div className="absolute bg-black/50 inset-0 flex flex-col items-start justify-center z-0">
        <div className="max-w-[1150px] mx-auto w-full flex items-center justify-between pt-12 text-white">
          <h1 className="text-4xl sm:text-5xl font-QBold">{title}</h1>
          <h4 className="pt-4 sm:pt-7 pb-4 sm:pb-7 sm:text-lg tracking-wider font-QLight">
            Home{' '}
            <Icon icon={chevronRightIcon} className="text-teal-400 w-4 h-4" />{' '}
            {breadcrumb}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Hero;
