import React, { FC, FormEvent } from 'react';
import { STATES } from '@public/static-data/states';
import Spinner from 'app/components/common/Spinner';
import { ApplicantInfoFormProps } from 'app/types/adopt-types';

const styles = {
  input:
    'user-input bg-white border-[1px] w-full border-gray-200 rounded-md py-2.5 px-4 focus:outline-none',
};

const AdoptionApplicationApplicantInfoForm: FC<ApplicantInfoFormProps> = ({
  onSubmit,
  handleInput,
  handleSelect,
  inputs,
  errors,
  isLoading,
}) => {
  return (
    <form onSubmit={(e: FormEvent) => onSubmit(e, inputs)}>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex flex-col mb-4 w-full">
          <label className="text-sm mb-1" htmlFor="firstName">
            First name*
          </label>
          <input
            className={styles.input}
            name="firstName"
            onChange={handleInput}
            type="text"
            alt="First name"
            value={inputs.firstName || ''}
          />
          {errors?.firstName && (
            <p className="text-sm text-red-500">{errors?.firstName}</p>
          )}
        </div>
        <div className="flex flex-col mb-4 w-full">
          <label className="text-sm mb-1" htmlFor="lastName">
            Last name*
          </label>
          <input
            className={styles.input}
            name="lastName"
            onChange={handleInput}
            type="text"
            alt="Last name"
            value={inputs.lastName || ''}
          />
          {errors?.lastName && (
            <p className="text-sm text-red-500">{errors?.lastName}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-sm mb-1" htmlFor="email">
          Email*
        </label>
        <input
          className={styles.input}
          name="email"
          onChange={handleInput}
          type="email"
          alt="Email"
          value={inputs.email || ''}
        />
        {errors?.email && (
          <p className="text-sm text-red-500">{errors?.email}</p>
        )}
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-sm mb-1" htmlFor="state">
          State*
        </label>
        <select
          className="user-input bg-white border-[1px] h-[46px] border-gray-200 rounded-md  py-2.5 px-4 focus:outline-none"
          id="state"
          name="state"
          value={inputs.state || ''}
          onChange={handleSelect}
          aria-label="Select state"
        >
          {STATES.map((state: any, i: number) => (
            <option className="text-zinc-300" key={i} value={state.value}>
              {state.text}
            </option>
          ))}
        </select>
        {errors?.state && (
          <p className="text-sm text-red-500">{errors?.state}</p>
        )}
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-sm mb-1" htmlFor="bypassCode">
          Bypass code
        </label>
        <input
          className={styles.input}
          name="bypassCode"
          onChange={handleInput}
          type="text"
          alt="Bypass code"
          value={inputs.bypassCode || ''}
        />
        {errors?.bypassCode && (
          <p className="text-sm text-red-500">{errors?.bypassCode}</p>
        )}
      </div>
      <button
        type="submit"
        className="mt-12 w-full justify-center gap-2 items-center flex py-2 font-QBold lg:rounded-2xl duration-200 bg-teal-400 text-white hover:shadow-lg"
      >
        {isLoading && <Spinner fill="fill-white" />} Continue
      </button>
    </form>
  );
};

export default AdoptionApplicationApplicantInfoForm;
