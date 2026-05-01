'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Package, Loader2, Trash2, ImagePlus, Star, Lock, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { store, useFormSelector, useUiSelector } from 'app/lib/store/store'
import { setCloseAuctionItemDrawer } from 'app/lib/store/slices/uiSlice'
import { createFormActions } from 'app/utils/formActions'
import { deleteAuctionItem } from 'app/lib/actions/deleteAuctionItem'
import { uploadFileToFirebase } from 'app/utils/uploadFileToFirebase'
import Picture from '../common/Picture'
import { setPrimaryAuctionItemPhoto } from 'app/lib/actions/setPrimaryAuctionItemPhoto'
import { deleteAuctionItemPhoto } from 'app/lib/actions/deleteAuctionItemPhoto'
import { createAuctionItem } from 'app/lib/actions/auction/createAuctionItem'
import { updateAuctionItem } from 'app/lib/actions/updateAuctionItem'
import { resetForm, setInputs } from 'app/lib/store/slices/formSlice'
import { useEscapeKey } from '@hooks/useEscapeKey'
import { useAuctionItemValidation } from '@hooks/useAuctionItemValidation'

// ─── Shared field components ──────────────────────────────────────────────────
const inputClass =
  'w-full px-3.5 py-3 text-xs font-mono border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder:text-muted-light/50 dark:placeholder:text-muted-dark/50 transition-colors duration-150 focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark'
const inputErrorClass = 'border-red-500 focus-visible:border-red-500'

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-[10px] font-mono text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
      <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">{children}</p>
    </div>
  )
}

export default function AdminAuctionItemDrawer() {
  const router = useRouter()
  const { auctionItemDrawer } = useUiSelector()
  const { auctionItemForm } = useFormSelector()
  const inputs = auctionItemForm?.inputs
  const errors = auctionItemForm?.errors
  const { handleInput, setErrors, handleUploadProgress } = createFormActions('auctionItemForm', store.dispatch)

  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)
  const [pendingPhotos, setPendingPhotos] = useState<File[]>([])

  const isUpdating = !!inputs?.isUpdating
  const isActive = inputs?.status === 'ACTIVE'
  const showBuyNow = inputs?.sellingFormat === 'FIXED'

  // Escape key
  useEscapeKey(auctionItemDrawer, () => store.dispatch(setCloseAuctionItemDrawer()))

  const validate = useAuctionItemValidation(inputs)

  const handleSave = async () => {
    const [errs, isValid] = validate()
    if (!isValid) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setErrors({})

    // Upload pending photos
    let photos: string[] = []
    if (pendingPhotos.length > 0) {
      try {
        photos = await Promise.all(pendingPhotos.map((file) => uploadFileToFirebase(file, handleUploadProgress)))
      } catch {
        setErrors({ form: 'Failed to upload photos. Please try again.' })
        setLoading(false)
        return
      }
    }

    const payload = {
      auctionId: inputs?.auction?.id,
      name: inputs?.name.trim(),
      description: inputs?.description?.trim() || null,
      sellingFormat: inputs?.sellingFormat,
      startingPrice: inputs?.startingPrice ? Number(inputs.startingPrice) : null,
      buyNowPrice: inputs?.buyNowPrice ? Number(inputs.buyNowPrice) : null,
      totalQuantity: inputs?.totalQuantity ? Number(inputs.totalQuantity) : 1,
      requiresShipping: inputs?.requiresShipping,
      shippingCosts: inputs?.shippingCosts ? Number(inputs.shippingCosts) : null,
      photos: photos.length > 0 ? photos : (inputs?.photos?.map((p: any) => (typeof p === 'string' ? p : p.url)) ?? [])
    }

    const result = isUpdating ? await updateAuctionItem(inputs.id!, payload) : await createAuctionItem(payload)

    if (!result.success) {
      setErrors({ form: result.error ?? 'Something went wrong.' })
      setLoading(false)
      return
    }

    router.refresh()
    store.dispatch(setCloseAuctionItemDrawer())
    store.dispatch(resetForm('auctionItemForm'))
    setLoading(false)
    setPendingPhotos([])
  }

  const handleDelete = async () => {
    if (!confirmDel) {
      setConfirmDel(true)
      return
    }

    setDeleting(true)
    const result = await deleteAuctionItem(inputs.id!, inputs?.auctionId)
    if (!result.success) {
      setErrors({ form: result.error ?? 'Failed to delete item.' })
      setDeleting(false)
      setConfirmDel(false)
      return
    }
    router.refresh()
    store.dispatch(setCloseAuctionItemDrawer())
  }

  return (
    <AnimatePresence>
      {auctionItemDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => store.dispatch(setCloseAuctionItemDrawer())}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label={isUpdating ? 'Edit auction item' : 'Add auction item'}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-bg-light dark:bg-bg-dark border-l border-border-light dark:border-border-dark flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border-light dark:border-border-dark shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-primary-light/10 dark:bg-primary-dark/10">
                  <Package size={15} className="text-primary-light dark:text-primary-dark" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Auction Item</p>
                  <p className="text-sm font-quicksand font-black text-text-light dark:text-text-dark leading-snug">
                    {isUpdating ? 'Edit Item' : 'Add Item'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isActive && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/10 border border-amber-500/30">
                    <Lock size={10} className="text-amber-500 shrink-0" aria-hidden="true" />
                    <span className="text-[9px] font-mono tracking-[0.15em] uppercase text-amber-500 font-black">Limited Editing</span>
                  </div>
                )}
                <button
                  onClick={() => store.dispatch(setCloseAuctionItemDrawer())}
                  aria-label="Close drawer"
                  className="p-2 text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark border border-transparent hover:border-border-light dark:hover:border-border-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                >
                  <X size={15} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {/* Form error */}
              <AnimatePresence>
                {errors?.form && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    role="alert"
                    className="px-4 py-3 border border-red-500/30 bg-red-500/10 text-red-500 text-xs font-mono"
                  >
                    {errors?.form}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Basic info ── */}
              <SectionLabel>Basic Info</SectionLabel>

              <Field id="name" label="Name *" error={errors?.name}>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={inputs?.name || ''}
                  onChange={handleInput}
                  placeholder="Item name"
                  className={`${inputClass} ${errors?.name ? inputErrorClass : ''}`}
                  aria-invalid={!!errors?.name}
                  autoFocus
                />
              </Field>
              <Field id="description" label="Description">
                <textarea
                  id="description"
                  name="description"
                  value={inputs?.description || ''}
                  onChange={handleInput}
                  placeholder="Item description..."
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </Field>

              {/* ── Selling format ── */}
              <SectionLabel>Pricing</SectionLabel>
              <Field id="sellingFormat" label="Selling Format *" error={errors?.sellingFormat}>
                <div className="relative">
                  <select
                    id="sellingFormat"
                    name="sellingFormat"
                    value={inputs?.sellingFormat}
                    onChange={handleInput}
                    disabled={isActive}
                    className={`${inputClass} appearance-none pr-8 ${errors?.sellingFormat ? inputErrorClass : ''} ${isActive ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                    aria-invalid={!!errors?.sellingFormat}
                    aria-disabled={isActive}
                  >
                    <option value="AUCTION">Auction</option>
                    <option value="FIXED">Fixed / Buy Now</option>
                  </select>
                  <svg
                    viewBox="0 0 24 24"
                    className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none ${isActive ? 'opacity-50 text-muted-light dark:text-muted-dark' : 'text-muted-light dark:text-muted-dark'}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="square"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                  {isActive && <div className="absolute inset-0 cursor-not-allowed" aria-hidden="true" />}
                </div>
              </Field>
              {/*  Starting Price/Buy Now Price */}
              <div className="grid grid-cols-2 gap-3">
                {inputs?.showStartingPrice && (
                  <Field id="startingPrice" label="Starting Price *" error={errors?.startingPrice}>
                    <div className="relative">
                      <input
                        id="startingPrice"
                        name="startingPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={inputs?.startingPrice || ''}
                        onChange={handleInput}
                        placeholder="0.00"
                        className={`${inputClass} ${errors?.startingPrice ? inputErrorClass : ''} ${isActive ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                        aria-invalid={!!errors?.startingPrice}
                      />
                      {isActive && <div className="absolute inset-0 cursor-not-allowed" aria-hidden="true" />}
                    </div>
                  </Field>
                )}
                {showBuyNow && (
                  <Field id="buyNowPrice" label="Buy Now Price *" error={errors?.buyNowPrice}>
                    <div className="relative">
                      <input
                        id="buyNowPrice"
                        name="buyNowPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={inputs?.buyNowPrice || ''}
                        onChange={handleInput}
                        placeholder="0.00"
                        className={`${inputClass} ${errors?.buyNowPrice ? inputErrorClass : ''} ${isActive ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                        aria-invalid={!!errors?.buyNowPrice}
                      />
                      {isActive && <div className="absolute inset-0 cursor-not-allowed" aria-hidden="true" />}
                    </div>
                  </Field>
                )}
              </div>

              {/* ── Photos ── */}
              <SectionLabel>Photos</SectionLabel>
              <div className="flex flex-col gap-1.5">
                {/* Existing photos (edit mode) */}
                {isUpdating && inputs?.photos?.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {inputs?.photos.map((photo) => (
                      <div key={photo.id} className="relative group aspect-square border border-border-light dark:border-border-dark overflow-hidden">
                        <Picture priority={false} src={photo.url} alt={photo.name ?? 'Photo'} className="w-full h-full object-cover" />
                        {photo.isPrimary && (
                          <span className="absolute top-1 left-1 text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 bg-primary-light dark:bg-primary-dark text-white">
                            Primary
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {!photo.isPrimary && (
                            <button
                              type="button"
                              onClick={async () => {
                                await setPrimaryAuctionItemPhoto(photo.id, inputs?.id, inputs?.auctionId)
                                router.refresh()

                                const updatedPhotos = inputs?.photos?.map((p) => ({
                                  ...p,
                                  isPrimary: p.id === photo.id
                                }))

                                store.dispatch(
                                  setInputs({
                                    formName: 'auctionItemForm',
                                    data: { ...inputs, photos: updatedPhotos }
                                  })
                                )
                              }}
                              aria-label="Set as primary photo"
                              className="w-7 h-7 flex items-center justify-center bg-white/20 hover:bg-primary-light dark:hover:bg-primary-dark text-white backdrop-blur-sm transition-colors"
                            >
                              <Star size={13} aria-hidden="true" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              deleteAuctionItemPhoto(photo.id, inputs?.auctionId)
                              router.refresh()
                              store.dispatch(
                                setInputs({
                                  formName: 'auctionItemForm',
                                  data: { ...inputs, photos: inputs.photos.filter((item) => item.id !== photo.id) }
                                })
                              )
                            }}
                            aria-label="Remove photo"
                            className="w-7 h-7 flex items-center justify-center bg-white/20 hover:bg-red-500 text-white backdrop-blur-sm transition-colors"
                          >
                            <Trash2 size={13} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pending photos preview */}
                {pendingPhotos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {pendingPhotos.map((file, i) => (
                      <div key={i} className="relative group aspect-square border border-border-light dark:border-border-dark overflow-hidden">
                        <Picture priority={false} src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                        {i === 0 && !isUpdating && (
                          <span className="absolute top-1 left-1 text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 bg-primary-light dark:bg-primary-dark text-white">
                            Primary
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => setPendingPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X size={10} aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* File input */}
                <label
                  htmlFor="photos"
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark text-[10px] font-mono tracking-[0.2em] uppercase cursor-pointer transition-colors"
                >
                  <ImagePlus size={13} aria-hidden="true" />
                  {pendingPhotos.length > 0 ? `${pendingPhotos.length} selected — add more` : 'Select photos'}
                </label>
                <input
                  id="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? [])
                    setPendingPhotos((prev) => [...prev, ...files])
                  }}
                />
              </div>

              {/* ── Shipping ── */}
              <SectionLabel>Shipping</SectionLabel>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-text-light dark:text-text-dark">Requires Shipping</p>
                  <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">Item needs to be physically shipped</p>
                </div>
                <button
                  disabled={isActive}
                  name="requiresShipping"
                  type="button"
                  role="switch"
                  aria-checked={inputs?.requiresShipping}
                  aria-label="Toggle requires shipping"
                  onClick={() =>
                    store.dispatch(setInputs({ formName: 'auctionItemForm', data: { ...inputs, requiresShipping: !inputs.requiresShipping } }))
                  }
                  className={`relative w-10 h-5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark ${
                    inputs?.requiresShipping ? 'bg-primary-light dark:bg-primary-dark' : 'bg-border-light dark:bg-border-dark'
                  } ${isActive ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white transition-transform duration-200 ${inputs?.requiresShipping ? 'translate-x-0.5' : '-translate-x-4.5'}`}
                  />
                </button>
              </div>

              {inputs?.requiresShipping && (
                <Field id="shippingCosts" label="Shipping Cost ($)">
                  <div className="relative">
                    <input
                      id="shippingCosts"
                      name="shippingCosts"
                      type="number"
                      min="0"
                      step="0.01"
                      value={inputs?.shippingCosts || ''}
                      onChange={handleInput}
                      placeholder="0.00"
                      className={`${inputClass} ${isActive ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                    />
                    {isActive && <div className="absolute inset-0 cursor-not-allowed" aria-hidden="true" />}
                  </div>
                </Field>
              )}

              <div className="grid grid-cols-2 gap-3">
                {/* ── Other ── */}
                {inputs?.sellingFormat === 'FIXED' && <SectionLabel>Other</SectionLabel>}
                {inputs?.sellingFormat === 'FIXED' && (
                  <Field id="totalQuantity" label="Quantity">
                    <input
                      id="totalQuantity"
                      name="totalQuantity"
                      type="number"
                      min="1"
                      step="1"
                      value={inputs?.totalQuantity || ''}
                      onChange={handleInput}
                      placeholder="1"
                      className={inputClass}
                    />
                  </Field>
                )}
              </div>

              {/* Delete */}
              {isUpdating && (
                <div className="border border-red-500/20 bg-red-500/5">
                  <div className="px-4 py-3 border-b border-red-500/20">
                    <div className="flex items-center gap-2">
                      <span className="block w-3 h-px bg-red-500 shrink-0" aria-hidden="true" />
                      <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-red-500">Danger Zone</p>
                    </div>
                  </div>
                  <div className="px-4 py-4 relative">
                    <p className="text-xs font-semibold text-text-light dark:text-text-dark mb-0.5">Delete Item</p>
                    <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mb-4 leading-relaxed">
                      {isActive
                        ? 'Items cannot be deleted while the auction is live.'
                        : 'Permanently removes this item and all associated bids and photos. This cannot be undone.'}
                    </p>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isActive || deleting}
                      className={`w-full py-2.5 text-[10px] font-mono tracking-[0.2em] uppercase transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 ${
                        confirmDel ? 'bg-red-500 text-white' : 'border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white'
                      } ${isActive ? 'cursor-not-allowed pointer-events-none' : ''}`}
                      aria-busy={deleting}
                    >
                      {deleting ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 size={12} className="animate-spin" aria-hidden="true" /> Deleting...
                        </span>
                      ) : confirmDel ? (
                        'Confirm Delete'
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Trash2 size={12} aria-hidden="true" /> Delete Item
                        </span>
                      )}
                    </button>
                    {confirmDel && (
                      <button
                        type="button"
                        onClick={() => setConfirmDel(false)}
                        className="w-full py-2 text-[10px] font-mono text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors mt-1"
                      >
                        Cancel
                      </button>
                    )}
                    {isActive && <div className="absolute inset-0 cursor-not-allowed" aria-hidden="true" />}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-border-light dark:border-border-dark shrink-0 space-y-3">
              {isActive && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-amber-500/10 border border-amber-500/30">
                  <Zap size={11} className="text-amber-500 shrink-0" aria-hidden="true" />
                  <p className="text-[10px] font-mono text-amber-500 leading-snug">
                    This auction is live — only name, description, and photos can be changed.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  aria-busy={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white text-[10px] font-mono tracking-[0.2em] uppercase transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                >
                  {loading ? (
                    <>
                      <Loader2 size={13} className="animate-spin" aria-hidden="true" /> Saving...
                    </>
                  ) : (
                    <>
                      <Package size={13} aria-hidden="true" /> {isUpdating ? 'Save Changes' : 'Add Item'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => store.dispatch(setCloseAuctionItemDrawer())}
                  disabled={loading}
                  className="px-4 py-3 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark text-[10px] font-mono tracking-[0.2em] uppercase hover:text-text-light dark:hover:text-text-dark hover:border-primary-light/40 dark:hover:border-primary-dark/40 transition-colors duration-150 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
