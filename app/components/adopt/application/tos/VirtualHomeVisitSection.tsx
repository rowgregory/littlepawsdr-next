import React from 'react';
import Section from './Section';

const VirtualHomeVisitSection = () => {
  return (
    <Section
      title="Virtual Home Visit"
      text="A virtual home visit will be scheduled at a time that is convenient
    for you. We require that everyone living in the home be present during
    the visit, including all animals. The home visit volunteer will
    inspect the locations where the dachshund will eat, sleep, and play,
    etc."
      text2="  We will keep your application and fee on file, and you are welcome to
    contact us at applications@littlepawsdr.org within 6 months of your
    original adoption application submission with the name of another dog
    that interests you if the following occurs:"
    >
      <ul>
        <li className="mb-2.5 pl-3 ">
          The dog you applied for is adopted by another applicant.
        </li>
        <li className="mb-2.5 pl-3 ">
          The dog you applied for is no longer available by the time your
          application is received.
        </li>
        <li className="mb-2.5 pl-3 ">
          You do not meet the dog’s requirements.
        </li>
        <li className="mb-2.5 pl-3 ">
          The dog you applied for has been removed from availability  If your
          application does not meet the requirements for the dog you selected,
          we will contact you with more detailed information about why we’re not
          moving forward with your application.
        </li>
      </ul>
      <p className="mb-3.5">
        Little Paws reserves the right to deny an application for any reason. We
        look forward to working with you. To get help prior to completing an
        application, please contact us at{' '}
        <a href="mailto:applications@littlepawsdr.org">
          applications@littlepawsdr.org
        </a>
        . Our application can take{' '}
        <span className="font-QBold">15-30 minutes to complete.</span>
      </p>
    </Section>
  );
};

export default VirtualHomeVisitSection;
