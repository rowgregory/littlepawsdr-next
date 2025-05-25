'use client'

import React, { FC, useState } from 'react'
import { STATES } from '@public/static-data/states'
import Spinner from 'app/components/common/Spinner'
import { ApplicantInfoFormProps } from 'app/types/adopt-types'
import AwesomeIcon from 'app/components/common/AwesomeIcon'
import { chevronDownIcon, chevronLeftIcon, chevronRightIcon, chevronUpIcon } from 'app/icons'
import AdoptFeeInput from './elements/AdoptFeeInput'
import Link from 'next/link'
import AdoptFeeSelect from './elements/AdoptFeeSelect'

const styles = {
  input: 'user-input border-1 w-full border-zinc-200 py-1.5 px-4 focus:outline-none text-sm'
}

const AdoptFeeApplicantInfoForm: FC<ApplicantInfoFormProps> = ({ handleSubmit, handleInput, inputs, errors, isLoading }) => {
  const [showBypassCodeInput, setShowBypassCodeInput] = useState(false)

  return (
    <form onSubmit={handleSubmit} className="w-full h-full flex flex-col justify-between">
      <section>
        <div className="flex flex-col lg:flex-row gap-4">
          <AdoptFeeInput
            label="First name"
            name="firstName"
            value={inputs?.firstName || ''}
            onChange={handleInput}
            error={errors?.firstName}
            required
            inputClassName={styles.input}
          />
          <AdoptFeeInput
            label="Last name"
            name="lastName"
            value={inputs?.lastName || ''}
            onChange={handleInput}
            error={errors?.lastName}
            required
            inputClassName={styles.input}
          />
        </div>
        <AdoptFeeInput
          label="Email"
          name="email"
          value={inputs?.email || ''}
          onChange={handleInput}
          error={errors?.email}
          required
          inputClassName={styles.input}
        />
        <AdoptFeeSelect
          label="State"
          name="state"
          value={inputs?.state || ''}
          onChange={handleInput}
          error={errors?.state}
          required
          selectClassName={styles.input}
          options={STATES}
        />
        <div className="flex flex-col mb-4">
          <label
            onClick={() => setShowBypassCodeInput(!showBypassCodeInput)}
            className={`text-sm mb-1 cursor-pointer flex items-center gap-x-2`}
            htmlFor="bypassCode"
          >
            {showBypassCodeInput ? 'Bypass code' : 'Enter bypass code'}{' '}
            <AwesomeIcon icon={showBypassCodeInput ? chevronUpIcon : chevronDownIcon} className="w-2.5 h-2.5 duration-300" />
          </label>
          {showBypassCodeInput && (
            <AdoptFeeInput
              label=""
              name="bypassCode"
              value={inputs?.bypassCode || ''}
              onChange={handleInput}
              error={errors?.bypassCode}
              required={false}
              inputClassName={styles.input}
            />
          )}
        </div>
      </section>
      <section className="mt-12 flex gap-x-4">
        <Link
          href="/adopt/application/step1"
          onClick={() => localStorage.setItem('adoptFeeForm', JSON.stringify(inputs))}
          className="text-center py-1.5 px-4 duration-200 text-black shadow-lg rounded-full active:shadow-sm group hover:tracking-wider w-[100px] active:translate-y-1"
        >
          <AwesomeIcon icon={chevronLeftIcon} className="text-black w-4 h-4 group-hover:-translate-x-1 duration-300" /> Back
        </Link>
        <button
          type="submit"
          className="text-center py-1.5 px-4 duration-200 bg-black text-white shadow-xl rounded-full active:shadow-sm group hover:tracking-wider w-[100px] active:translate-y-1"
        >
          Next
          {isLoading ? (
            <Spinner fill="fill-white" track="text-black" wAndH="w-4 h-4" />
          ) : (
            <AwesomeIcon icon={chevronRightIcon} className="text-white w-4 h-4 group-hover:translate-x-1 duration-300" />
          )}
        </button>
      </section>
    </form>
  )
}

export default AdoptFeeApplicantInfoForm
