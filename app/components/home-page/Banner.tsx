'use client';

import useVideo from '@hooks/useVideo';
import Link from 'next/link';

const Banner = () => {
  const { videoRef } = useVideo();
  return (
    <div className="w-full relative">
      <video
        ref={videoRef}
        className="w-full h-[850px] fade-in block object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/videos/landing.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute z-0 top-0 left-0 flex-col w-full h-[850px] flex justify-center bg-[#1c1c1c]/30">
        <div className="max-w-[1150px] w-full mx-auto px-3 xl:px-0 flex flex-col gap-5">
          <p className="slide-down text-white text-[55px] font-quicksand tracking-wider">
            Help Abandoned Animals <br /> Find a Loving Home
          </p>
          <h1 className="mb-5 scale-in text-white font-extralight">
            Your compassion can turn their world around. By supporting us,{' '}
            <br />
            you help abandoned animals find the love and care they deserve.
          </h1>
          <Link
            href="/adoption-application"
            className="bg-teal-400 text-white py-4 px-9 rounded-lg font-quicksand w-fit"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
