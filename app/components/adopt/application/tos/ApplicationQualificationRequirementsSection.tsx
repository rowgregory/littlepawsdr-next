import React from 'react';
import Section from './Section';

const ApplicationQualificationRequirementsSection = () => {
  return (
    <Section
      title="Adoption Qualification Requirements"
      text="The following are the standards that our rescue adheres to. Please note, each dog is different and may have additional requirements, however, the list below applies to every adoption."
      text2="We require all individuals to read the dog’s bio/requirements completely to ensure the dog of interest is the best match for your family and that the needs of the dog can be met. This will help us to ensure that you as the adopter are fully prepared to welcome a new dog into your home."
    >
      <ul className="my-3.5">
        <li className="mb-2.5 pl-3 ">
          Current and previous pets must be spayed or neutered, with some
          exceptions for health reasons. To be considered for a medical
          exception for spay/neuter, vet documentation is required.
        </li>
        <li className="mb-2.5 pl-3 ">
          Your pets must be current on vaccines, heartworm testing, and
          heartworm and flea/tick prevention.
        </li>
        <li className="mb-2.5 pl-3 ">
          Veterinary records will be checked, and we utilize the AVMA guidelines
          for preventative care to confirm annual checkups (2x annually for
          seniors), dentals, bloodwork, and treatment provided when necessary.
        </li>
        <li className="mb-3.5 pl-3 ">
          You must be at least 21 years old to be considered to adopt one of our
          dogs.
        </li>
      </ul>
    </Section>
  );
};

export default ApplicationQualificationRequirementsSection;
