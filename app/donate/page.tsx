'use client'

import React, { useState } from 'react'
import Hero from 'app/components/common/Hero'
// import Picture from 'app/components/common/Picture';
import DonationOptions from 'app/components/donate/DonationOptions'
import MonthlyDonation from 'app/components/donate/MonthlyDonation'
import OneTimeDonation from 'app/components/donate/OneTimeDonation'

const DonatePage = () => {
  const [type, setType] = useState<string>('one-time')

  return (
    <div>
      <Hero bgImg="/images/donate.jpg" title="Donate" breadcrumb="Donate" className="bg-[0_60%] md:bg-[0_70%] lg:bg-[0_78%]" />
      <div className="max-w-screen-sm w-full mx-auto z-10 relative">
        <DonationOptions type={type} setType={setType} />
        <div className="w-full pt-3 pb-12 bg-white">
          {type === 'one-time' && <OneTimeDonation type={type} />}
          {type === 'monthly' && <MonthlyDonation type={type} />}
        </div>
        {/* <div className="hidden lg:block mt-8 bg-white w-full p-[16px] md:p-6">
          <p className="text-lg font-Matter-Regular mb-4">
            Scan our Venmo QR code
          </p>
          <div className="border-4 border-teal-500 p-2.5 w-fit">
            <Picture
              src="/images/venmo-qr-code.png"
              className="max-w-40 w-full"
              priority={false}
            />
          </div>
        </div> */}
      </div>
      {/* <div className="col-span-12 lg:col-span-4 flex flex-col sm:flex-row lg:flex-col w-full">
            <img
              src="/images/no-img.jpg"
              alt="Donate to LPDR"
              className="max-w-none sm:max-w-80 lg:max-w-none aspect-square object-cover"
            />
            <p className="bg-white px-6 p-8 font-Matter-Light text-xl">
              Little Paws Dachshund Rescue is a dedicated organization committed
              to rescuing, rehabilitating, and rehoming dachshunds in need. As a
              passionate advocate for these beloved dogs, our mission is to
              provide them with the care and support they require for a second
              chance at a happy life. Through our efforts, we strive to prevent
              cruelty and neglect, offering a safe haven for dachshunds who have
              been abandoned, abused, or surrendered. Your generous
              contributions enable us to continue our vital work, making a
              significant impact on the lives of dachshunds in need. Thank you
              for choosing to support Little Paws Dachshund Rescue and for
              helping us make a difference in the lives of these wonderful
              animals
            </p>
          </div> */}
    </div>
  )
}

export default DonatePage
