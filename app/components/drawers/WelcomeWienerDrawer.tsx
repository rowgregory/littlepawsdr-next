'use client'

import { createWelcomeWiener } from 'app/lib/actions/createWelcomeWiener'
import { updateWelcomeWiener } from 'app/lib/actions/updateWelcomeWiener'
import { resetForm, setIsLoading, setIsNotLoading } from 'app/lib/store/slices/formSlice'
import { showToast } from 'app/lib/store/slices/toastSlice'
import { setCloseWelcomeWienerDrawer } from 'app/lib/store/slices/uiSlice'
import { store, useFormSelector, useUiSelector } from 'app/lib/store/store'
import { createFormActions } from 'app/utils/formActions'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { WelcomeWienerForm } from '../forms/WelcomeWienerForm'

const validateWelcomeWienerForm = (inputs: any, setErrors: (errors: any) => void): boolean => {
  const errors: Record<string, string> = {}

  if (!inputs?.name?.trim()) {
    errors.name = 'Name is required'
  }

  if (!inputs?.bio?.trim()) {
    errors.bio = 'Bio is required'
  }

  if (!inputs?.age?.trim()) {
    errors.age = 'Age is required'
  }

  if (inputs?.displayUrl && !/^https?:\/\/.+/.test(inputs.displayUrl.trim())) {
    errors.displayUrl = 'Display URL must be a valid URL'
  }

  if (!inputs?.associatedProducts || inputs.associatedProducts.length === 0) {
    errors.associatedProducts = 'At least one product must be selected'
  }

  setErrors(errors)
  return Object.keys(errors).length === 0
}

export const WelcomeWienerDrawer = () => {
  const router = useRouter()
  const { welcomeWienerDrawer } = useUiSelector()
  const { welcomeWienerForm, isLoading } = useFormSelector()
  const { handleInput, setErrors } = createFormActions('welcomeWienerForm', store.dispatch)

  const inputs = welcomeWienerForm?.inputs
  const errors = welcomeWienerForm?.errors
  const isUpdating = inputs?.isUpdating

  const onClose = () => {
    store.dispatch(resetForm('welcomeWienerForm'))
    store.dispatch(setCloseWelcomeWienerDrawer())
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateWelcomeWienerForm(inputs, setErrors)) return

    try {
      store.dispatch(setIsLoading())

      const payload = {
        name: inputs?.name,
        bio: inputs?.bio,
        age: inputs?.age,
        displayUrl: inputs?.displayUrl,
        images: inputs?.images ?? [],
        isLive: inputs?.isLive ?? false,
        isPhysicalProduct: false,
        associatedProducts: inputs?.associatedProducts ?? []
      }

      if (isUpdating) {
        const result = await updateWelcomeWiener(inputs?.id, payload)
        if (result && 'success' in result && !result.success) throw new Error(result.error ?? 'Update failed')
        store.dispatch(showToast({ message: `${inputs?.name} updated`, description: 'The welcome wiener profile has been saved.', type: 'success' }))
      } else {
        const result = await createWelcomeWiener(payload)
        if (result && 'success' in result && !result.success) throw new Error(result.error ?? 'Create failed')
        store.dispatch(showToast({ message: `${inputs?.name} added`, description: 'The welcome wiener is ready to go live.', type: 'success' }))
      }

      router.refresh()
      onClose()
    } catch (error) {
      store.dispatch(
        showToast({
          message: error instanceof Error ? error.message : 'Something went wrong',
          type: 'error'
        })
      )
    } finally {
      store.dispatch(setIsNotLoading())
    }
  }

  return (
    <AnimatePresence>
      {welcomeWienerDrawer && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 w-full md:w-170 h-screen z-50"
            role="dialog"
            aria-modal="true"
            aria-label={isUpdating ? 'Edit Welcome Wiener' : 'Add Welcome Wiener'}
          >
            <WelcomeWienerForm
              inputs={inputs}
              errors={errors}
              handleInput={handleInput}
              handleSubmit={handleSubmit}
              onClose={onClose}
              isUpdating={isUpdating}
              isLoading={isLoading}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
