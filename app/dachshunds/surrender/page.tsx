import React from 'react';
import { surrenderStatesData } from '@public/static-data/dachshund-data';
import Hero from 'app/components/common/Hero';

const Surrender = () => {
  return (
    <div className="mb-40">
      <Hero
        bgImg="/images/surrender.jpg"
        title="Surrender an Animal"
        breadcrumb="Surrender"
      />
      <div className="max-w-3xl mx-auto px-4 pt-16">
        <h1 className="text-3xl font-QBold mb-6">Rehoming Your Dachshund</h1>
        <p className="mb-4 font-QLight">
          LPDR understands that rehoming may sometimes be necessary. People
          become ill, die, divorce, move overseas, develop allergies, lose their
          jobs, lose their homes, etc. Any of these situations can lead to a dog
          coming into rescue. We currently help rescue in the following states:
        </p>
        <ul className="list-disc list-inside mb-4">
          {surrenderStatesData.map((state) => (
            <li key={state} className="font-QBook">
              {state}
            </li>
          ))}
        </ul>
        <h2 className="text-2xl font-QBold mb-4">Behavior Problems</h2>
        <p className="mb-4 font-QLight">
          If you are considering re-homing your dachshund because of behavior
          problems, there may be other options you can consider first. Talk to
          your vet about the issue to ensure the behavior is not a result of a
          medical problem or perhaps because the dog has not been spayed or
          neutered. You may also want to consider consulting a behaviorist who
          may be able to help resolve the problem with training (for you and
          your dog).
        </p>
        <h2 className="text-2xl font-QBold mb-4">Financial Assistance</h2>
        <p className="mb-4 font-QLight">
          If you are considering re-homing your dachshund because of financial
          issues or high vet costs, know that there are foundations and other
          organizations that may be able to offer financial assistance. A search
          of resources serving your geographic area may yield good results.
          Additionally, local governments offer lower-cost veterinary services.
        </p>
        <h2 className="text-2xl font-QBold mb-4">Personal Networks</h2>
        <p className="mb-4 font-QLight">
          Consider exploring your own personal networks of trusted friends,
          family, and co-workers who may be able to provide a good home for your
          dog.
        </p>
        <h2 className="text-2xl font-QBold mb-4">Surrendering Your Dog</h2>
        <p className="mb-4 font-QLight">
          When all options have been considered and you believe that
          surrendering your dog is the best option for you and your dachshund,
          Little Paws Dachshund Rescue may be able to help. All dachshunds that
          come into our rescue live in the home of an approved foster.
          Generally, the dog stays with the foster for two weeks before being
          posted on our website for adoption so we can better understand the
          needs and personality of the dog. All potential adopters go through a
          rigorous application process and are carefully screened.
        </p>

        <h2 className="text-2xl font-QBold mb-4">Surrender Questionnaire</h2>
        <p className="font-QLight">
          To be considered for surrender, please complete and submit the
          following Surrender Questionnaire:
        </p>
        <iframe
          className="h-[600px] border-2 border-gray-200 rounded-2xl p-4 mt-20"
          title="Surrender Application"
          width="100%"
          src="https://toolkit.rescuegroups.org/of/f?c=QCVXZJTH"
        ></iframe>
      </div>
    </div>
  );
};

export default Surrender;
