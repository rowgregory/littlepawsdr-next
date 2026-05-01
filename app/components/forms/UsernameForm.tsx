'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { store, useFormSelector } from 'app/lib/store/store'
import { updateUserName } from 'app/lib/actions/user/updateUserName'
import { setInputs } from 'app/lib/store/slices/formSlice'

interface UsernameFormProps {
  formName: string
}

export function UsernameForm({ formName }: UsernameFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const form = useFormSelector()
  const inputs = form[formName]?.inputs
  const errors = form[formName]?.errors

  const setForm = (data: Record<string, any>) => store.dispatch(setInputs({ formName, data }))

  const hasName = !!inputs?.firstName && !!inputs?.lastName && !inputs?.editingName

  async function handleSaveName() {
    if (!inputs?.firstName?.trim() || !inputs?.lastName?.trim()) return

    setSaving(true)

    const result = await updateUserName({ firstName: inputs.firstName.trim(), lastName: inputs.lastName.trim() })

    if (!result.success) {
      setForm({ errors: { ...errors, firstName: result.error } })
      setSaving(false)
      return
    }

    setForm({ editingName: false })
    setSaving(false)
    router.refresh()
  }

  if (hasName)
    return (
      <section aria-label="Your name" className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
        <div className="px-4 py-3 border-b border-border-light dark:border-border-dark flex items-center justify-between">
          <p className="font-changa text-f10 uppercase tracking-[0.25em] text-muted-light dark:text-muted-dark">Name</p>
          <button
            type="button"
            onClick={() => setForm({ editingName: true })}
            className="font-changa text-f10 uppercase tracking-[0.2em] text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors focus-visible:outline-none"
          >
            Edit
          </button>
        </div>
        <div className="px-4 py-3">
          <p className="font-lato text-sm text-text-light dark:text-text-dark">
            {inputs.firstName} {inputs.lastName}
          </p>
        </div>
      </section>
    )

  return (
    <section aria-label="Enter your name" className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
      <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
        <h2 className="font-changa text-f10 uppercase tracking-[0.25em] text-muted-light dark:text-muted-dark">Your Name</h2>
        <p className="font-lato text-xs text-muted-light dark:text-muted-dark mt-0.5">Required to complete your purchase.</p>
      </div>
      <div className="px-4 py-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor={`${formName}-firstName`}
              className="block font-changa text-f10 uppercase tracking-[0.2em] text-muted-light dark:text-muted-dark mb-1.5"
            >
              First Name
            </label>
            <input
              id={`${formName}-firstName`}
              type="text"
              value={inputs?.firstName ?? ''}
              onChange={(e) => setForm({ firstName: e.target.value })}
              autoComplete="given-name"
              placeholder="Jane"
              aria-describedby={errors?.firstName ? `${formName}-firstName-error` : undefined}
              aria-invalid={!!errors?.firstName}
              className={`w-full px-3.5 py-2.5 border bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark font-lato text-sm focus:outline-none transition-colors ${
                errors?.firstName
                  ? 'border-red-400 dark:border-red-500 focus-visible:border-red-400'
                  : 'border-border-light dark:border-border-dark focus-visible:border-primary-light dark:focus-visible:border-primary-dark'
              }`}
            />
            {errors?.firstName && (
              <p id={`${formName}-firstName-error`} role="alert" className="font-lato text-xs text-red-500 mt-1">
                {errors.firstName}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor={`${formName}-lastName`}
              className="block font-changa text-f10 uppercase tracking-[0.2em] text-muted-light dark:text-muted-dark mb-1.5"
            >
              Last Name
            </label>
            <input
              id={`${formName}-lastName`}
              type="text"
              value={inputs?.lastName ?? ''}
              onChange={(e) => setForm({ lastName: e.target.value })}
              autoComplete="family-name"
              placeholder="Doe"
              aria-describedby={errors?.lastName ? `${formName}-lastName-error` : undefined}
              aria-invalid={!!errors?.lastName}
              className={`w-full px-3.5 py-2.5 border bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark font-lato text-sm focus:outline-none transition-colors ${
                errors?.lastName
                  ? 'border-red-400 dark:border-red-500 focus-visible:border-red-400'
                  : 'border-border-light dark:border-border-dark focus-visible:border-primary-light dark:focus-visible:border-primary-dark'
              }`}
            />
            {errors?.lastName && (
              <p id={`${formName}-lastName-error`} role="alert" className="font-lato text-xs text-red-500 mt-1">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setForm({ editingName: false })}
            className="flex-1 py-2.5 px-4 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark font-changa text-f10 uppercase tracking-[0.25em] hover:text-text-light dark:hover:text-text-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveName}
            disabled={!inputs?.firstName?.trim() || !inputs?.lastName?.trim() || saving}
            className="flex-1 py-2.5 px-4 bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-changa text-f10 uppercase tracking-[0.25em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving...
              </span>
            ) : (
              'Save Name'
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
