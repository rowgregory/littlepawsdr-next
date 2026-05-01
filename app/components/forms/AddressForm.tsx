'use client'

import { updateAddress } from 'app/lib/actions/updateAddress'
import { setInputs } from 'app/lib/store/slices/formSlice'
import { store, useFormSelector } from 'app/lib/store/store'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface AddressFormProps {
  formName: string
}

export function AddressForm({ formName }: AddressFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const form = useFormSelector()
  const inputs = form[formName]?.inputs
  const errors = form[formName]?.errors

  const setForm = (data: Record<string, any>) => store.dispatch(setInputs({ formName, data }))

  const hasAddress = !!inputs?.addressLine1 && !!inputs?.city && !!inputs?.state && !!inputs?.zipPostalCode && !inputs?.editingAddress

  async function handleSaveAddress() {
    if (!inputs?.addressLine1?.trim() || !inputs?.city?.trim() || !inputs?.state?.trim() || !inputs?.zipPostalCode?.trim()) return

    setSaving(true)

    const result = await updateAddress({
      addressLine1: inputs.addressLine1.trim(),
      addressLine2: inputs.addressLine2?.trim() || null,
      city: inputs.city.trim(),
      state: inputs.state.trim(),
      zipPostalCode: inputs.zipPostalCode.trim(),
      country: 'US'
    })

    if (!result.success) {
      setForm({ errors: { ...errors, addressLine1: result.error } })
      setSaving(false)
      return
    }

    setForm({ editingAddress: false })
    setSaving(false)
    router.refresh()
  }

  if (hasAddress)
    return (
      <section aria-label="Shipping address" className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
        <div className="px-4 py-3 border-b border-border-light dark:border-border-dark flex items-center justify-between">
          <p className="font-changa text-f10 uppercase tracking-[0.25em] text-muted-light dark:text-muted-dark">Shipping Address</p>
          <button
            type="button"
            onClick={() => setForm({ editingAddress: true })}
            className="font-changa text-f10 uppercase tracking-[0.2em] text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors focus-visible:outline-none"
          >
            Edit
          </button>
        </div>
        <div className="px-4 py-3 flex items-start gap-4">
          <div className="space-y-0.5">
            <p className="font-lato text-sm text-text-light dark:text-text-dark">{inputs.addressLine1}</p>
            {inputs.addressLine2 && <p className="font-lato text-sm text-text-light dark:text-text-dark">{inputs.addressLine2}</p>}
            <p className="font-lato text-sm text-text-light dark:text-text-dark">
              {inputs.city}, {inputs.state} {inputs.zipPostalCode}
            </p>
          </div>
        </div>
      </section>
    )

  return (
    <section aria-label="Enter shipping address" className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
      <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
        <h2 className="font-changa text-f10 uppercase tracking-[0.25em] text-muted-light dark:text-muted-dark">Shipping Address</h2>
        <p className="font-lato text-xs text-muted-light dark:text-muted-dark mt-0.5">Required for shipping your item.</p>
      </div>
      <div className="px-4 py-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label
              htmlFor={`${formName}-addressLine1`}
              className="block font-changa text-f10 uppercase tracking-[0.2em] text-muted-light dark:text-muted-dark mb-1.5"
            >
              Address
            </label>
            <input
              id={`${formName}-addressLine1`}
              type="text"
              value={inputs?.addressLine1 ?? ''}
              onChange={(e) => setForm({ addressLine1: e.target.value })}
              autoComplete="address-line1"
              placeholder="123 Main St"
              aria-describedby={errors?.addressLine1 ? `${formName}-addressLine1-error` : undefined}
              aria-invalid={!!errors?.addressLine1}
              className={`w-full px-3.5 py-2.5 border bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark font-lato text-sm focus:outline-none transition-colors ${
                errors?.addressLine1
                  ? 'border-red-400 dark:border-red-500'
                  : 'border-border-light dark:border-border-dark focus-visible:border-primary-light dark:focus-visible:border-primary-dark'
              }`}
            />
            {errors?.addressLine1 && (
              <p id={`${formName}-addressLine1-error`} role="alert" className="font-lato text-xs text-red-500 mt-1">
                {errors.addressLine1}
              </p>
            )}
          </div>

          <div className="col-span-2">
            <label
              htmlFor={`${formName}-addressLine2`}
              className="block font-changa text-f10 uppercase tracking-[0.2em] text-muted-light dark:text-muted-dark mb-1.5"
            >
              Apt / Suite <span className="normal-case tracking-normal">(optional)</span>
            </label>
            <input
              id={`${formName}-addressLine2`}
              type="text"
              value={inputs?.addressLine2 ?? ''}
              onChange={(e) => setForm({ addressLine2: e.target.value })}
              autoComplete="address-line2"
              placeholder="Apt 4B"
              className="w-full px-3.5 py-2.5 border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark font-lato text-sm focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark transition-colors"
            />
          </div>

          <div className="col-span-2">
            <label
              htmlFor={`${formName}-city`}
              className="block font-changa text-f10 uppercase tracking-[0.2em] text-muted-light dark:text-muted-dark mb-1.5"
            >
              City
            </label>
            <input
              id={`${formName}-city`}
              type="text"
              value={inputs?.city ?? ''}
              onChange={(e) => setForm({ city: e.target.value })}
              autoComplete="address-level2"
              placeholder="Boston"
              aria-describedby={errors?.city ? `${formName}-city-error` : undefined}
              aria-invalid={!!errors?.city}
              className={`w-full px-3.5 py-2.5 border bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark font-lato text-sm focus:outline-none transition-colors ${
                errors?.city
                  ? 'border-red-400 dark:border-red-500'
                  : 'border-border-light dark:border-border-dark focus-visible:border-primary-light dark:focus-visible:border-primary-dark'
              }`}
            />
            {errors?.city && (
              <p id={`${formName}-city-error`} role="alert" className="font-lato text-xs text-red-500 mt-1">
                {errors.city}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor={`${formName}-state`}
              className="block font-changa text-f10 uppercase tracking-[0.2em] text-muted-light dark:text-muted-dark mb-1.5"
            >
              State
            </label>
            <input
              id={`${formName}-state`}
              type="text"
              value={inputs?.state ?? ''}
              onChange={(e) => setForm({ state: e.target.value })}
              autoComplete="address-level1"
              placeholder="MA"
              maxLength={2}
              aria-describedby={errors?.state ? `${formName}-state-error` : undefined}
              aria-invalid={!!errors?.state}
              className={`w-full px-3.5 py-2.5 border bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark font-lato text-sm focus:outline-none transition-colors uppercase ${
                errors?.state
                  ? 'border-red-400 dark:border-red-500'
                  : 'border-border-light dark:border-border-dark focus-visible:border-primary-light dark:focus-visible:border-primary-dark'
              }`}
            />
            {errors?.state && (
              <p id={`${formName}-state-error`} role="alert" className="font-lato text-xs text-red-500 mt-1">
                {errors.state}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor={`${formName}-zipPostalCode`}
              className="block font-changa text-f10 uppercase tracking-[0.2em] text-muted-light dark:text-muted-dark mb-1.5"
            >
              ZIP
            </label>
            <input
              id={`${formName}-zipPostalCode`}
              type="text"
              value={inputs?.zipPostalCode ?? ''}
              onChange={(e) => setForm({ zipPostalCode: e.target.value })}
              autoComplete="postal-code"
              placeholder="02101"
              maxLength={5}
              aria-describedby={errors?.zipPostalCode ? `${formName}-zipPostalCode-error` : undefined}
              aria-invalid={!!errors?.zipPostalCode}
              className={`w-full px-3.5 py-2.5 border bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark font-lato text-sm focus:outline-none transition-colors ${
                errors?.zipPostalCode
                  ? 'border-red-400 dark:border-red-500'
                  : 'border-border-light dark:border-border-dark focus-visible:border-primary-light dark:focus-visible:border-primary-dark'
              }`}
            />
            {errors?.zipPostalCode && (
              <p id={`${formName}-zipPostalCode-error`} role="alert" className="font-lato text-xs text-red-500 mt-1">
                {errors.zipPostalCode}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setForm({ editingAddress: false })}
            className="flex-1 py-2.5 px-4 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark font-changa text-f10 uppercase tracking-[0.25em] hover:text-text-light dark:hover:text-text-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAddress}
            disabled={!inputs?.addressLine1?.trim() || !inputs?.city?.trim() || !inputs?.state?.trim() || !inputs?.zipPostalCode?.trim() || saving}
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
              'Save Address'
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
