import React from 'react';
import FooterAboutSection from './footer/FooterAboutSection';
import FooterNewsletterSection from './footer/FooterNewsletterSection';
import FooterCredits from './footer/FooterCredits';
import FooterLinksSection from './footer/FooterLinksSection';

const Footer = () => {
  return (
    <footer className="w-full bg-[#1C1E29] relative">
      <div className="footer-bg"></div>
      <div className="max-w-[1150px] py-20 w-full mx-auto grid grid-cols-12 gap-y-8 px-3 sm:px-0 sm:gap-8 relative z-10">
        <FooterAboutSection />
        <div className="col-span-12 lg:col-span-9 text-white">
          <div className="grid grid-cols-9 gap-y-8 sm:gap-8">
            <FooterLinksSection />
            <FooterNewsletterSection />
          </div>
        </div>
      </div>
      <FooterCredits />
    </footer>
  );
};

export default Footer;
