'use client'

import React from 'react'
import {
  MissionSection,
  AdoptionApplicationProcessSection,
  ApplicationFeeSection,
  ApplicationQualificationRequirementsSection,
  GoalSection,
  VirtualHomeVisitSection
} from 'app/components/adopt/application/TermSections'
import AwesomeIcon from 'app/components/common/AwesomeIcon'
import { chevronRightIcon } from 'app/icons'
import { useRouter } from 'next/navigation'

const Step1 = () => {
  const { push } = useRouter()

  const handleStep1 = () => {
    document.cookie = 'adoptStep1Complete=true; path=/'
    push('/adopt/application/step2')
  }

  return (
    <div className="max-w-lg h-full">
      <h1 className="font-lg font-semibold mb-4">Terms & Conditions</h1>
      <div className="w-full h-full flex flex-col justify-between">
        <div className="h-[500px] overflow-y-auto p-6 flex flex-col items-center rounded-lg border-1 border-zinc-200">
          <MissionSection />
          <GoalSection />
          <ApplicationFeeSection />
          <ApplicationQualificationRequirementsSection />
          <AdoptionApplicationProcessSection />
          <VirtualHomeVisitSection />
        </div>
        <div>
          <h2 className="text-13 mb-2">By proceeding, you acknowledge and accept the Terms and Conditions.</h2>
          <button
            type="button"
            onClick={handleStep1}
            className="text-center py-1.5 px-4 duration-200 bg-black text-white shadow-xl rounded-full active:shadow-sm group hover:tracking-wider w-[100px] active:translate-y-1 actve:bg-teal-400"
          >
            Next <AwesomeIcon icon={chevronRightIcon} className="text-white w-4 h-4 group-hover:translate-x-1 duration-300" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Step1
