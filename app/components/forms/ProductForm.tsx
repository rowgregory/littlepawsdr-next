import { Upload, X } from 'lucide-react'
import { useState } from 'react'
import { FormProps } from 'types/common'
import Picture from '../common/Picture'
import { store } from 'app/lib/store/store'
import { setInputs } from 'app/lib/store/slices/formSlice'
import { motion } from 'framer-motion'
import { uploadFileToFirebase } from 'app/utils/uploadFileToFirebase'
import { showToast } from 'app/lib/store/slices/toastSlice'
import { cancelButtonClass, errorClass, fieldClass, labelClass, submitButtonClass } from 'app/lib/constants/styles'
import { Toggle } from '../ui/Toggle'

export const ProductForm = ({ inputs, errors, handleInput, handleSubmit, onClose, isUpdating, isLoading }: FormProps) => {
  const [imagesUploading, setImagesUploading] = useState(false)
  const [imagesUploadProgress, setImagesUploadProgress] = useState(0)

  return (
    <div className="flex flex-col h-full bg-bg-light dark:bg-bg-dark overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="block w-5 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
              {isUpdating ? 'Edit' : 'New'} Product
            </p>
          </div>
          <p className="text-xs font-mono text-muted-light dark:text-muted-dark pl-8">
            {isUpdating ? `Editing ${inputs?.name ?? 'product'}` : 'Add a new product'}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close drawer"
          className="text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark p-1"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto">
        <form
          id="product-form"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Product form"
          className="divide-y divide-border-light dark:divide-border-dark"
        >
          {/* ── Section: Details ── */}
          <div className="px-6 py-6 space-y-4">
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Profile</p>

            {/* Name */}
            <div>
              <label htmlFor="p-name" className={labelClass}>
                Name
              </label>
              <input
                id="p-name"
                type="text"
                name="name"
                value={inputs?.name ?? ''}
                onChange={handleInput}
                placeholder={`${new Date().getFullYear()} Calendar`}
                className={fieldClass}
                aria-invalid={!!errors?.name}
                aria-describedby={errors?.name ? 'p-name-error' : undefined}
              />
              {errors?.name && (
                <p id="p-name-error" role="alert" className={errorClass}>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="p-description" className={labelClass}>
                Description
              </label>
              <textarea
                id="p-description"
                name="description"
                value={inputs?.description ?? ''}
                onChange={handleInput}
                placeholder="Describe the product..."
                rows={8}
                className={`${fieldClass} resize-none`}
                aria-invalid={!!errors?.description}
                aria-describedby={errors?.description ? 'p-description-error' : undefined}
              />
              {errors?.description && (
                <p id="p-description-error" role="alert" className={errorClass}>
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* ── Section: Pricing ── */}
          <div className="px-6 py-6 space-y-4">
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Pricing</p>
            {/* Price + Shipping side by side */}
            <div className="grid grid-cols-2 gap-3">
              {/* Price */}
              <div>
                <label htmlFor="p-price" className={labelClass}>
                  Price
                </label>
                <div className="relative">
                  <span
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono text-muted-light dark:text-muted-dark pointer-events-none"
                    aria-hidden="true"
                  >
                    $
                  </span>
                  <input
                    id="p-price"
                    type="number"
                    name="price"
                    min={0}
                    step={0.01}
                    value={inputs?.price ?? ''}
                    onChange={handleInput}
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value)
                      if (!isNaN(val)) handleInput({ target: { name: 'price', value: val.toFixed(2) } })
                    }}
                    placeholder="0.00"
                    className={`${fieldClass} pl-8`}
                    aria-invalid={!!errors?.price}
                    aria-describedby={errors?.price ? 'p-price-error' : undefined}
                  />
                </div>
                {errors?.price && (
                  <p id="p-price-error" role="alert" className={errorClass}>
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Shipping Price */}
              <div>
                <label htmlFor="p-shipping-price" className={labelClass}>
                  Shipping Price
                </label>
                <div className="relative">
                  <span
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono text-muted-light dark:text-muted-dark pointer-events-none"
                    aria-hidden="true"
                  >
                    $
                  </span>
                  <input
                    id="p-shipping-price"
                    type="number"
                    name="shippingPrice"
                    min={0}
                    step={0.01}
                    value={inputs?.shippingPrice ?? ''}
                    onChange={handleInput}
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value)
                      if (!isNaN(val)) handleInput({ target: { name: 'shippingPrice', value: val.toFixed(2) } })
                    }}
                    placeholder="0.00"
                    className={`${fieldClass} pl-8`}
                    aria-invalid={!!errors?.shippingPrice}
                    aria-describedby={errors?.shippingPrice ? 'p-shipping-price-error' : undefined}
                  />
                </div>
                {errors?.shippingPrice && (
                  <p id="p-shipping-price-error" role="alert" className={errorClass}>
                    {errors.shippingPrice}
                  </p>
                )}
              </div>
            </div>

            {/* Count In Stock */}
            <div>
              <label htmlFor="p-count-in-stock" className={labelClass}>
                Count In Stock
              </label>
              <div className="relative">
                <input
                  id="p-count-in-stock"
                  type="number"
                  name="countInStock"
                  min={0}
                  step={1}
                  value={inputs?.countInStock ?? ''}
                  onChange={handleInput}
                  onBlur={(e) => {
                    const val = parseInt(e.target.value)
                    if (!isNaN(val)) handleInput({ target: { name: 'countInStock', value: Math.max(0, val) } })
                  }}
                  placeholder="0"
                  className={fieldClass}
                  aria-invalid={!!errors?.countInStock}
                  aria-describedby={errors?.countInStock ? 'p-count-in-stock-error' : undefined}
                />
                {inputs?.countInStock != null && (
                  <span
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono pointer-events-none ${
                      inputs.countInStock === 0 ? 'text-red-500 dark:text-red-400' : 'text-muted-light dark:text-muted-dark'
                    }`}
                    aria-hidden="true"
                  >
                    {inputs.countInStock === 0 ? 'out of stock' : 'in stock'}
                  </span>
                )}
              </div>
              {errors?.countInStock && (
                <p id="p-count-in-stock-error" role="alert" className={errorClass}>
                  {errors.countInStock}
                </p>
              )}
            </div>
          </div>

          {/* ── Section: Settings ── */}
          <div className="px-6 py-6 space-y-2">
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-4">Settings</p>

            <div>
              <Toggle
                id="p-isLive"
                label="Live"
                description="Visible to the public on the merch page"
                checked={inputs?.isLive ?? false}
                onToggle={() => store.dispatch(setInputs({ formName: 'productForm', data: { ...inputs, isLive: !inputs?.isLive } }))}
              />
            </div>
          </div>

          {/* ── Section: Images ── */}
          <div className="px-6 py-6 space-y-4">
            {/* Images */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Images</label>
                {inputs?.images?.length > 0 && (
                  <span className="text-[10px] font-mono text-primary-light dark:text-primary-dark">{inputs.images.length} uploaded</span>
                )}
              </div>

              {/* Existing images grid */}
              {inputs?.images?.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {inputs.images.map((url: string, i: number) => (
                    <div key={i} className="relative aspect-square border border-border-light dark:border-border-dark overflow-hidden group">
                      <Picture priority={false} src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() =>
                          store.dispatch(
                            setInputs({
                              formName: 'productForm',
                              data: { images: inputs.images.filter((_: string, idx: number) => idx !== i) }
                            })
                          )
                        }
                        aria-label={`Remove image ${i + 1}`}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center focus:outline-none"
                      >
                        <X className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload trigger */}
              <label
                htmlFor="p-images-upload"
                className="flex flex-col items-center justify-center gap-2 w-full py-6 border border-dashed border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark cursor-pointer transition-colors duration-200"
              >
                {imagesUploading ? (
                  <>
                    <div className="w-full max-w-30 h-px bg-border-light dark:bg-border-dark relative">
                      <motion.div
                        className="absolute top-0 left-0 h-px bg-primary-light dark:bg-primary-dark"
                        animate={{ width: `${imagesUploadProgress}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    <p className="text-[10px] font-mono text-primary-light dark:text-primary-dark">{Math.round(imagesUploadProgress)}%</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-muted-light dark:text-muted-dark" aria-hidden="true" />
                    <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">Add images</p>
                    <p className="text-[10px] font-mono text-muted-light/60 dark:text-muted-dark/60">Select multiple</p>
                  </>
                )}
                <input
                  id="p-images-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files ?? [])
                    if (!files.length) return

                    setImagesUploading(true)
                    try {
                      const uploaded: string[] = []
                      for (let i = 0; i < files.length; i++) {
                        const url = await uploadFileToFirebase(files[i], (progress) => {
                          setImagesUploadProgress((i / files.length) * 100 + progress / files.length)
                        })
                        uploaded.push(url)
                      }
                      store.dispatch(
                        setInputs({
                          formName: 'productForm',
                          data: { images: [...(inputs?.images ?? []), ...uploaded] }
                        })
                      )
                    } catch {
                      store.dispatch(showToast({ message: 'Failed to upload one or more images', type: 'error' }))
                    } finally {
                      setImagesUploading(false)
                      setImagesUploadProgress(0)
                      e.target.value = ''
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </form>
      </div>

      {/* ── Footer ── */}
      <div className="px-6 py-5 border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shrink-0 flex items-center justify-between gap-3">
        <button type="button" onClick={onClose} className={cancelButtonClass}>
          Cancel
        </button>
        <motion.button
          type="submit"
          form="product-form"
          disabled={isLoading}
          whileHover={!isLoading ? { scale: 1.02 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
          className={`${submitButtonClass} ${
            isLoading
              ? 'bg-surface-light dark:bg-surface-dark text-muted-light dark:text-muted-dark border border-border-light dark:border-border-dark cursor-not-allowed'
              : 'bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white cursor-pointer'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2" aria-live="polite">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="block w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full"
                aria-hidden="true"
              />
              {isUpdating ? 'Saving...' : 'Creating...'}
            </span>
          ) : isUpdating ? (
            'Save Changes'
          ) : (
            'Create Product'
          )}
        </motion.button>
      </div>
    </div>
  )
}
