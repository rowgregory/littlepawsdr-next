import React from 'react';
import Section from './Section';

const AdoptionApplicationProcessSection = () => {
  return (
    <Section
      title="The Adoption Application Process"
      text="Once your application is received it will be reviewed by our application coordinator to determine if you meet the dog’s
  requirements.  If your application shows you would a good match, the following will take place:"
    >
      <ul className="mb-3.5">
        <li className="mb-2.5 pl-3 ">
          Your past and current veterinarians will be contacted.
        </li>
        <li className="mb-2.5 pl-3 ">
          Your personal references will be contacted.
        </li>
        <li className="mb-2.5 pl-3 ">
          Your landlord will be contacted, if applicable.
        </li>
        <li className="mb-2.5 pl-3 ">
          We will review the information received with the dog’s foster team to
          determine if a home visit will be scheduled.
        </li>
      </ul>
    </Section>
  );
};

export default AdoptionApplicationProcessSection;
