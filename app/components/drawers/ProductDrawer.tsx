'use client'

import { createProduct } from 'app/lib/actions/createProduct'
import { updateProduct } from 'app/lib/actions/updateProduct'
import { resetForm, setIsLoading, setIsNotLoading } from 'app/lib/store/slices/formSlice'
import { showToast } from 'app/lib/store/slices/toastSlice'
import { setCloseProductDrawer } from 'app/lib/store/slices/uiSlice'
import { store, useFormSelector, useUiSelector } from 'app/lib/store/store'
import { createFormActions } from 'app/utils/formActions'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ProductForm } from '../forms/ProductForm'
import { handleActionResult } from 'app/utils/handleActionResult'
import { validateProductForm } from 'app/lib/validations/product.validation'

export const ProductDrawer = () => {
  const router = useRouter()
  const { productDrawer } = useUiSelector()
  const { productForm, isLoading } = useFormSelector()
  const { handleInput, setErrors } = createFormActions('productForm', store.dispatch)

  const inputs = productForm?.inputs
  const errors = productForm?.errors
  const isUpdating = inputs?.isUpdating

  const onClose = () => {
    store.dispatch(resetForm('productForm'))
    store.dispatch(setCloseProductDrawer())
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateProductForm(inputs, setErrors)) return

    try {
      store.dispatch(setIsLoading())

      const payload = {
        ...(isUpdating && { id: inputs?.id }),
        name: inputs?.name,
        images: inputs?.images ?? [],
        description: inputs?.description,
        price: inputs?.price,
        shippingPrice: inputs?.shippingPrice,
        countInStock: inputs?.countInStock,
        isLive: inputs?.isLive
      }

      if (isUpdating) {
        const result = await updateProduct(payload)
        handleActionResult(result, 'Update failed')
        store.dispatch(showToast({ message: `${inputs?.name} updated`, description: 'The product has been saved.', type: 'success' }))
      } else {
        const result = await createProduct(payload)
        handleActionResult(result, 'Create failed')
        store.dispatch(showToast({ message: `${inputs?.name} added`, description: 'The product is ready to go live.', type: 'success' }))
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
      {productDrawer && (
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
            aria-label={isUpdating ? 'Edit Product' : 'Add Product'}
          >
            <ProductForm
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
