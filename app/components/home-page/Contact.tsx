import Link from 'next/link';
import React from 'react';

const Contact = () => {
  return (
    <div className="h-[420px] lg:h-[530px] bg-[#f2f2ee] relative mb-40 flex flex-col items-center justify-center">
      <div className="contact-bg"></div>
      <h4 className="text-teal-400 text-xl mb-5">Let’s Support One Another.</h4>
      <h1 className="text-5xl text-[#414141] mb-5">
        Report Abandoned Animals.
      </h1>
      <p className="text-[#414141] text-center mb-6 font-thin">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusm{' '}
        <br />
        tempor incididunt ut labore et dolore magna aliqua.{' '}
      </p>
      <Link
        href="/contact-us"
        className="bg-teal-400 text-white py-4 px-9 rounded-lg font-quicksand w-fit"
      >
        Contact Us
      </Link>
    </div>
  );
};

export default Contact;
