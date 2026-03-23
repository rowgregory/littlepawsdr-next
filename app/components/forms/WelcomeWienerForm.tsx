import { setInputs } from 'app/lib/store/slices/formSlice'
import { Check, Minus, Plus, Upload, X } from 'lucide-react'
import { WelcomeWienerProduct } from 'types/entities/welcome-wiener'
import Picture from '../common/Picture'
import { WELCOME_WIENER_CATALOG, WELCOME_WIENER_CATEGORIES, WELCOME_WIENER_CATEGORY_LABELS } from 'app/lib/constants/welcome-wiener'
import { motion } from 'framer-motion'
import { store } from 'app/lib/store/store'
import { uploadFileToFirebase } from 'app/utils/uploadFileToFirebase'
import { showToast } from 'app/lib/store/slices/toastSlice'
import { useState } from 'react'
import { FormProps } from 'types/common'
import { Toggle } from '../ui/Toggle'
import { cancelButtonClass, errorClass, fieldClass, labelClass, submitButtonClass } from 'app/lib/constants/styles'

export const WelcomeWienerForm = ({ inputs, errors, handleInput, handleSubmit, onClose, isUpdating, isLoading }: FormProps) => {
  const [imagesUploading, setImagesUploading] = useState(false)
  const [imagesUploadProgress, setImagesUploadProgress] = useState(0)

  const associated: WelcomeWienerProduct[] = inputs?.associatedProducts ?? []

  const isAdded = (id: string) => associated.some((p) => p.id === id)

  const toggleProduct = (product: WelcomeWienerProduct) => {
    const updated = isAdded(product.id) ? associated.filter((p) => p.id !== product.id) : [...associated, product]

    store.dispatch(setInputs({ formName: 'welcomeWienerForm', data: { associatedProducts: updated } }))
  }

  return (
    <div className="flex flex-col h-full bg-bg-light dark:bg-bg-dark overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="block w-5 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
              {isUpdating ? 'Edit' : 'New'} Welcome Wiener
            </p>
          </div>
          <p className="text-xs font-mono text-muted-light dark:text-muted-dark pl-8">
            {isUpdating ? `Editing ${inputs?.name ?? 'wiener'}` : 'Add a new dachshund profile'}
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
          id="welcome-wiener-form"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Welcome Wiener form"
          className="divide-y divide-border-light dark:divide-border-dark"
        >
          {/* ── Section: Profile ── */}
          <div className="px-6 py-6 space-y-4">
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Profile</p>

            {/* Name */}
            <div>
              <label htmlFor="ww-name" className={labelClass}>
                Name
              </label>
              <input
                id="ww-name"
                type="text"
                name="name"
                value={inputs?.name ?? ''}
                onChange={handleInput}
                placeholder="Peanut"
                className={fieldClass}
                aria-invalid={!!errors?.name}
                aria-describedby={errors?.name ? 'ww-name-error' : undefined}
              />
              {errors?.name && (
                <p id="ww-name-error" role="alert" className={errorClass}>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="ww-bio" className={labelClass}>
                Bio
              </label>
              <textarea
                id="ww-bio"
                name="bio"
                value={inputs?.bio ?? ''}
                onChange={handleInput}
                placeholder="Tell this pup&#39;s story..."
                rows={8}
                className={`${fieldClass} resize-none`}
                aria-invalid={!!errors?.bio}
                aria-describedby={errors?.bio ? 'ww-bio-error' : undefined}
              />
              {errors?.bio && (
                <p id="ww-bio-error" role="alert" className={errorClass}>
                  {errors.bio}
                </p>
              )}
            </div>

            {/* Age */}
            <div>
              <label htmlFor="ww-age" className={labelClass}>
                Age
              </label>
              <input
                id="ww-age"
                type="text"
                name="age"
                value={inputs?.age ?? ''}
                onChange={handleInput}
                placeholder="3 years"
                className={fieldClass}
                aria-invalid={!!errors?.age}
                aria-describedby={errors?.age ? 'ww-age-error' : undefined}
              />
              {errors?.age && (
                <p id="ww-age-error" role="alert" className={errorClass}>
                  {errors.age}
                </p>
              )}
            </div>

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
                              formName: 'welcomeWienerForm',
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
                htmlFor="ww-images-upload"
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
                  id="ww-images-upload"
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
                          formName: 'welcomeWienerForm',
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

          {/* ── Section: Settings ── */}
          <div className="px-6 py-6 space-y-2">
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-4">Settings</p>

            <Toggle
              id="ww-isLive"
              label="Live"
              description="Visible to the public on the donation page"
              checked={inputs?.isLive ?? false}
              onToggle={() => store.dispatch(setInputs({ formName: 'welcomeWienerForm', data: { ...inputs, isLive: !inputs?.isLive } }))}
            />
          </div>

          {/* ── Section: Associated Products ── */}
          <div className="px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Associated Products</p>
              {associated.length > 0 && (
                <span className="text-[10px] font-mono text-primary-light dark:text-primary-dark">{associated.length} selected</span>
              )}
            </div>

            <div className="space-y-6">
              {WELCOME_WIENER_CATEGORIES.map((category) => {
                const items = WELCOME_WIENER_CATALOG.filter((p) => p.category === category)
                return (
                  <div key={category}>
                    <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light/60 dark:text-muted-dark/60 mb-2">
                      {WELCOME_WIENER_CATEGORY_LABELS[category]}
                    </p>
                    <div className="space-y-1">
                      {items.map((product) => {
                        const added = isAdded(product.id)
                        return (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => toggleProduct(product)}
                            aria-pressed={added}
                            className={`w-full flex items-center justify-between px-3.5 py-3 border transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark text-left
                              ${
                                added
                                  ? 'border-primary-light dark:border-primary-dark bg-primary-light/5 dark:bg-primary-dark/5'
                                  : 'border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark hover:border-primary-light/50 dark:hover:border-primary-dark/50'
                              }`}
                          >
                            <div className="min-w-0">
                              <p
                                className={`text-xs font-mono truncate ${added ? 'text-primary-light dark:text-primary-dark' : 'text-text-light dark:text-text-dark'}`}
                              >
                                {product.name}
                              </p>
                              <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5 truncate">{product.description}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0 ml-4">
                              <span
                                className={`text-xs font-mono font-bold tabular-nums ${added ? 'text-primary-light dark:text-primary-dark' : 'text-muted-light dark:text-muted-dark'}`}
                              >
                                ${product.price}
                              </span>
                              <div
                                className={`w-5 h-5 flex items-center justify-center border transition-colors duration-150 ${added ? 'border-primary-light dark:border-primary-dark bg-primary-light dark:bg-primary-dark' : 'border-border-light dark:border-border-dark'}`}
                              >
                                {added ? (
                                  <Check className="w-3 h-3 text-white" aria-hidden="true" />
                                ) : (
                                  <Plus className="w-3 h-3 text-muted-light dark:text-muted-dark" aria-hidden="true" />
                                )}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Selected summary */}
            {associated.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border-light dark:border-border-dark">
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-3">Selected</p>
                <div className="space-y-1.5">
                  {associated.map((p) => (
                    <div key={p.id} className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-text-light dark:text-text-dark">{p.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-primary-light dark:text-primary-dark tabular-nums">${p.price}</span>
                        <button
                          type="button"
                          onClick={() => toggleProduct(p)}
                          aria-label={`Remove ${p.name}`}
                          className="text-muted-light dark:text-muted-dark hover:text-red-500 dark:hover:text-red-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                        >
                          <Minus className="w-3 h-3" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-border-light dark:border-border-dark flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">Total</span>
                    <span className="text-sm font-mono font-bold text-primary-light dark:text-primary-dark tabular-nums">
                      ${associated.reduce((sum, p) => sum + p.price, 0)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {errors?.associatedProducts && (
              <p role="alert" className="text-[11px] text-red-500 dark:text-red-400 font-mono mt-2">
                {errors.associatedProducts}
              </p>
            )}
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
          form="welcome-wiener-form"
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
            'Create Wiener'
          )}
        </motion.button>
      </div>
    </div>
  )
}
