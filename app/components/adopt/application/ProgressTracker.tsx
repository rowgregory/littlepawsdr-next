'use client'

import React, { useEffect, useState } from 'react'
import Icon from 'app/components/common/Icon'
import { checkIcon } from 'app/icons'
import useCustomPathname from '@hooks/useCustomPathname'

const ProgressTracker = () => {
  const path = useCustomPathname()
  const [usedBypassCode, setUsedBypassCode] = useState(false)

  useEffect(() => {
    const cookies = document.cookie.split('; ').reduce((acc: Record<string, string>, cookie) => {
      const [key, value] = cookie.split('=')
      acc[key] = value
      return acc
    }, {})

    if (cookies.usedBypassCode === 'true') {
      setUsedBypassCode(true)
    }
  }, [])

  // Parse steps from URL, default false if missing
  const step1 = path === '/adopt/application/step1'
  const step2 = path === '/adopt/application/step2'
  const step3 = path === '/adopt/application/step3'
  const step4 = path === '/adopt/application/step4'

  const steps = [
    {
      label: 'Terms & Conditions',
      isActive: step1,
      isCompleted: step2 || step3 || step4
    },
    {
      label: 'Applicant Info',
      isActive: step2,
      isCompleted: step3 || step4
    },
    {
      label: 'Payment',
      isActive: step3,
      isCompleted: step4,
      isBypassed: usedBypassCode
    },
    {
      label: 'Application',
      isActive: step4,
      isCompleted: false
    }
  ]

  return (
    <div className="hidden 1200:block w-full max-w-xs mt-10">
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center relative">
            {/* Connecting line */}
            {index < steps.length - 1 && <div className="absolute left-[9px] top-6 w-0.5 h-8 bg-gray-200"></div>}

            {/* Circle */}
            <div
              className={`
              w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold z-10
              ${step.isCompleted ? 'bg-black text-white' : step.isActive ? 'bg-black text-white' : 'bg-gray-200 text-gray-400'}
            `}
            >
              {step.isCompleted ? (
                <Icon icon={checkIcon} className="w-3 h-3 text-white" />
              ) : (
                <div className={`w-2 h-2 rounded-full ${step.isActive ? 'bg-white' : 'bg-gray-400'}`}></div>
              )}
            </div>

            <span
              className={`
              ml-4 text-sm
              ${step.isActive || step.isCompleted ? 'text-black font-medium' : 'text-gray-400'}
              ${step.label === 'Payment' && step.isBypassed ? 'line-through' : ''}
            `}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgressTracker
