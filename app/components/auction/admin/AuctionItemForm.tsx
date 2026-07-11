'use client'

import { CheckIcon, Eye, ImagePlus, LayoutDashboard, Loader2, Lock, Package, Star, Trash2, X, Zap } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'

import { createAuctionItem } from 'app/lib/actions/auction/createAuctionItem'
import { updateAuctionItem } from 'app/lib/actions/auction/updateAuctionItem'
import { deleteAuctionItem } from 'app/lib/actions/auction/deleteAuctionItem'
import { setPrimaryAuctionItemPhoto } from 'app/lib/actions/auction/setPrimaryAuctionItemPhoto'
import { deleteAuctionItemPhoto } from 'app/lib/actions/auction/deleteAuctionItemPhoto'
import { uploadFileToFirebase } from 'app/lib/firebase/firebase.utils'
import { formatMoney } from 'app/utils/currency.utils'
import { store } from 'app/lib/store/store'
import { showToast } from 'app/lib/store/slices/toastSlice'

import { FormField } from 'app/components/_primitives/FormField'
import Picture from '../../common/Picture'

import type { IAuctionItem, SellingFormat } from 'types/entities/auction-item'
import type { AuctionStatus } from 'types/entities/auction'
import { convertIfHeic } from 'app/utils/common.utils'

interface FormInputs {
  name: string
  description: string
  sellingFormat: SellingFormat
  startingPrice: string
  buyNowPrice: string
  totalQuantity: string
  requiresShipping: boolean
  shippingCosts: string
  photos: IAuctionItem['photos']
}

interface FormErrors {
  name?: string
  startingPrice?: string
  buyNowPrice?: string
  form?: string
}

interface PendingPhoto {
  file: File
  previewUrl: string
}

function validate(inputs: FormInputs, type: SellingFormat): FormErrors {
  const errs: FormErrors = {}
  if (!inputs.name.trim()) errs.name = 'Name is required'
  if (type === 'AUCTION' && !inputs.startingPrice) errs.startingPrice = 'Starting price is required'
  if (type === 'FIXED' && !inputs.buyNowPrice) errs.buyNowPrice = 'Buy now price is required'
  return errs
}

export function AuctionItemForm({
  auctionItem,
  auctionId,
  type,
  auctionStatus
}: {
  auctionItem: IAuctionItem | null
  auctionId: string
  type: SellingFormat
  auctionStatus: AuctionStatus
}) {
  const router = useRouter()

  const isUpdating = !!auctionItem
  const isActive = auctionStatus === 'ACTIVE'
  const showBuyNow = type === 'FIXED'

  const [inputs, setInputs] = useState<FormInputs>(() => ({
    name: auctionItem?.name ?? '',
    description: auctionItem?.description ?? '',
    sellingFormat: auctionItem?.sellingFormat ?? type,
    startingPrice: auctionItem?.startingPrice?.toString() ?? '',
    buyNowPrice: auctionItem?.buyNowPrice?.toString() ?? '',
    totalQuantity: auctionItem?.totalQuantity?.toString() ?? '1',
    requiresShipping: auctionItem?.requiresShipping ?? true,
    shippingCosts: auctionItem?.shippingCosts?.toString() ?? '',
    photos: auctionItem?.photos ?? []
  }))

  const patch = (data: Partial<FormInputs>) => setInputs((prev) => ({ ...prev, ...data }))

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    patch({ [e.target.name]: e.target.value } as Partial<FormInputs>)

  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([])
  const [uploadProgress, setUploadProgress] = useState<number>(0)

  const handleSave = async () => {
    const errs = validate(inputs, type)
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setErrors({})

    let photos: string[] = []
    if (pendingPhotos.length > 0) {
      try {
        photos = await Promise.all(
          pendingPhotos.map(({ file }) => uploadFileToFirebase(file, (progress) => setUploadProgress(progress)))
        )
      } catch {
        setErrors({ form: 'Failed to upload photos. Please try again.' })
        setLoading(false)
        return
      }
    }

    const payload = {
      auctionId,
      name: inputs.name.trim(),
      description: inputs.description.trim() || null,
      sellingFormat: inputs.sellingFormat,
      startingPrice: inputs.startingPrice ? Number(inputs.startingPrice) : null,
      buyNowPrice: inputs.buyNowPrice ? Number(inputs.buyNowPrice) : null,
      totalQuantity: inputs.totalQuantity ? Number(inputs.totalQuantity) : 1,
      requiresShipping: inputs.requiresShipping,
      shippingCosts: inputs.shippingCosts ? Number(inputs.shippingCosts) : null,
      photos
    }

    const result = isUpdating ? await updateAuctionItem(auctionItem!.id, payload) : await createAuctionItem(payload)

    if (!result.success) {
      setErrors({ form: result.error ?? 'Something went wrong.' })
      setLoading(false)
      return
    }

    const price =
      payload.sellingFormat === 'AUCTION'
        ? payload.startingPrice != null
          ? `starting at ${formatMoney(payload.startingPrice)}`
          : null
        : payload.buyNowPrice != null
          ? `${formatMoney(payload.buyNowPrice)} each`
          : null

    const shipping = payload.requiresShipping
      ? payload.shippingCosts != null
        ? `+${formatMoney(payload.shippingCosts)} shipping`
        : 'shipping TBD'
      : 'no shipping'

    store.dispatch(
      showToast({
        type: 'success',
        message: `${payload.name} ${isUpdating ? 'updated' : 'created'}`,
        description:
          [
            payload.sellingFormat === 'AUCTION' ? 'Auction item' : 'Instant buy',
            price,
            shipping,
            photos.length > 0 ? `${photos.length} photo${photos.length === 1 ? '' : 's'} added` : null
          ]
            .filter(Boolean)
            .join(' · ') || undefined,
        duration: 5000
      })
    )

    if (isUpdating) {
      router.refresh()
      setLoading(false)
      setUploadProgress(0)
      setPendingPhotos([])
    } else {
      router.push(`/admin/auctions/${auctionId}?tab=items&type=${result.data.sellingFormat}`)
    }
  }

  const handleDelete = async () => {
    if (!confirmDel) {
      setConfirmDel(true)
      return
    }

    setDeleting(true)
    const result = await deleteAuctionItem(auctionItem!.id, auctionId)

    if (!result.success) {
      setErrors({ form: result.error ?? 'Failed to delete item.' })
      setDeleting(false)
      setConfirmDel(false)
      return
    }

    store.dispatch(showToast({ type: 'success', message: `${auctionItem!.name} deleted` }))
    router.push(`/admin/auctions/${auctionId}?tab=items&type=${auctionItem!.sellingFormat}`)
  }

  return (
    <main id="main-content" className="min-h-screen w-full bg-bg-light dark:bg-bg-dark">
      {/* Topbar */}
      <header className="sticky top-0 z-10 w-full border-b border-border-light dark:border-border-dark bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur px-4 h-10 flex items-center justify-between gap-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 min-w-0">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-1.5 text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            <LayoutDashboard className="w-3 h-3" aria-hidden="true" />
            Dashboard
          </Link>
          <span className="text-[9px] font-mono text-border-light dark:text-border-dark" aria-hidden="true">
            /
          </span>
          <Link
            href="/admin/auctions"
            className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            Auctions
          </Link>
          <span className="text-[9px] font-mono text-border-light dark:text-border-dark" aria-hidden="true">
            /
          </span>
          <Link
            href={`/admin/auctions/${auctionId}?tab=items&type=${auctionItem?.sellingFormat ?? 'AUCTION'}`}
            className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            Auction Items
          </Link>
          <span className="text-[9px] font-mono text-border-light dark:text-border-dark" aria-hidden="true">
            /
          </span>
          <h1
            className="text-[9px] font-mono tracking-[0.15em] uppercase text-text-light dark:text-text-dark truncate"
            aria-current="page"
          >
            {isUpdating ? 'Edit Item' : 'New Item'}
          </h1>
        </nav>

        {isActive && (
          <span className="shrink-0 flex items-center gap-1.5 px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-[8px] font-mono tracking-[0.15em] uppercase text-amber-500 font-black">
            <Lock size={9} aria-hidden="true" /> Limited Editing
          </span>
        )}
      </header>

      <div className="w-full px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Title band */}
          <div className="flex items-start justify-between gap-3 flex-wrap pt-6 pb-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
                <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
                  Auction Item
                </p>
              </div>
              <h2 className="text-xl font-quicksand font-black text-text-light dark:text-text-dark leading-snug truncate">
                {isUpdating ? `Edit ${inputs.name || 'Item'}` : 'Add Item'}
              </h2>
            </div>

            {isUpdating && (
              <Link
                href={`/admin/auctions/${auctionId}/${auctionItem.id}/view`}
                className="flex items-center gap-2 px-3.5 py-2 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark text-[10px] font-mono tracking-[0.2em] uppercase hover:text-primary-light dark:hover:text-primary-dark hover:border-primary-light/40 dark:hover:border-primary-dark/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                <Eye size={12} aria-hidden="true" /> View Item
              </Link>
            )}
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-6 xl:gap-8 items-start pb-6">
            {/* Left — fields */}
            <div className="space-y-5 min-w-0">
              {isActive && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-amber-500/10 border border-amber-500/30">
                  <Zap size={11} className="text-amber-500 shrink-0" aria-hidden="true" />
                  <p className="text-[10px] font-mono text-amber-500 leading-snug">
                    This auction is live — only name, description, and photos can be changed.
                  </p>
                </div>
              )}

              {/* Form error */}
              <AnimatePresence>
                {errors.form && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    role="alert"
                    className="px-4 py-3 border border-red-500/30 bg-red-500/10 text-red-500 text-xs font-mono"
                  >
                    {errors.form}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Basic info */}
              <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
                Basic Info
              </p>

              <FormField
                id="name"
                label="Name"
                name="name"
                value={inputs.name}
                onChange={handleInput}
                placeholder="Item name"
                error={errors.name}
                required
              />

              <FormField
                id="description"
                label="Description"
                name="description"
                type="textarea"
                value={inputs.description}
                onChange={handleInput}
                placeholder="Item description..."
                rows={3}
              />

              {/* Pricing */}
              <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
                Pricing
              </p>

              <div className="grid grid-cols-2 gap-3">
                {type === 'AUCTION' && (
                  <FormField
                    id="startingPrice"
                    label="Starting Price"
                    name="startingPrice"
                    type="number"
                    value={inputs.startingPrice}
                    onChange={handleInput}
                    placeholder="0.00"
                    error={errors.startingPrice}
                    required
                    className={isActive ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
                  />
                )}
                {showBuyNow && (
                  <FormField
                    id="buyNowPrice"
                    label="Buy Now Price"
                    name="buyNowPrice"
                    type="number"
                    value={inputs.buyNowPrice}
                    onChange={handleInput}
                    placeholder="0.00"
                    error={errors.buyNowPrice}
                    required
                    className={isActive ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
                  />
                )}
                {showBuyNow && (
                  <FormField
                    id="totalQuantity"
                    label="Quantity"
                    name="totalQuantity"
                    type="number"
                    value={inputs.totalQuantity}
                    onChange={handleInput}
                    placeholder="1"
                  />
                )}
              </div>

              {/* Shipping */}
              <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
                Shipping
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-text-light dark:text-text-dark">Requires Shipping</p>
                  <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">
                    Item needs to be physically shipped
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={inputs.requiresShipping}
                  aria-label="Toggle requires shipping"
                  disabled={isActive}
                  onClick={() => patch({ requiresShipping: !inputs.requiresShipping })}
                  className={`relative w-10 h-5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark ${
                    inputs.requiresShipping
                      ? 'bg-primary-light dark:bg-primary-dark'
                      : 'bg-border-light dark:bg-border-dark'
                  } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white transition-transform duration-200 ${
                      inputs.requiresShipping ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {inputs.requiresShipping && (
                <FormField
                  id="shippingCosts"
                  label="Shipping Cost ($)"
                  name="shippingCosts"
                  type="number"
                  value={inputs.shippingCosts}
                  onChange={handleInput}
                  placeholder="0.00"
                  className={isActive ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
                />
              )}

              {/* Upload progress */}
              {loading && uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">
                    Uploading photos... {Math.round(uploadProgress)}%
                  </p>
                  <div className="w-full h-1 bg-border-light dark:bg-border-dark">
                    <div
                      className="h-1 bg-primary-light dark:bg-primary-dark transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  aria-busy={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white dark:text-bg-dark text-[10px] font-mono tracking-[0.2em] uppercase transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
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
                <Link
                  href={`/admin/auctions/${auctionId}?tab=items`}
                  className="px-4 py-3 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark text-[10px] font-mono tracking-[0.2em] uppercase hover:text-text-light dark:hover:text-text-dark hover:border-primary-light/40 dark:hover:border-primary-dark/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                >
                  Cancel
                </Link>
              </div>
            </div>

            {/* Right — photos & danger zone */}
            <div className="space-y-5 min-w-0">
              <section className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                <div className="px-4 py-2.5 border-b border-border-light dark:border-border-dark">
                  <h3 className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
                    Photos
                  </h3>
                </div>
                <div className="px-4 py-4 flex flex-col gap-1.5">
                  {/* Existing photos */}
                  {isUpdating && inputs.photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {inputs.photos.map((photo) => (
                        <div
                          key={photo.id}
                          className="relative group aspect-square border border-border-light dark:border-border-dark overflow-hidden"
                        >
                          <Picture
                            priority={false}
                            src={photo.url}
                            alt={photo.name ?? 'Photo'}
                            className="w-full h-full object-cover"
                          />
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
                                  await setPrimaryAuctionItemPhoto(photo.id, auctionItem!.id, auctionId)
                                  router.refresh()
                                  patch({ photos: inputs.photos.map((p) => ({ ...p, isPrimary: p.id === photo.id })) })
                                }}
                                aria-label="Set as primary photo"
                                className="w-7 h-7 flex items-center justify-center bg-white/20 hover:bg-primary-light dark:hover:bg-primary-dark text-white backdrop-blur-sm transition-colors"
                              >
                                <Star size={13} aria-hidden="true" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={async () => {
                                await deleteAuctionItemPhoto(photo.id, auctionId)
                                router.refresh()
                                patch({ photos: inputs.photos.filter((p) => p.id !== photo.id) })
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

                  {/* Pending photos */}
                  {pendingPhotos.map(({ file, previewUrl }, i) => (
                    <div
                      key={`${file.name}-${i}`}
                      className="relative group aspect-square border border-border-light dark:border-border-dark overflow-hidden"
                    >
                      <Picture
                        priority={false}
                        src={previewUrl}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                      {i === 0 && !isUpdating && (
                        <span className="absolute top-1 left-1 text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 bg-primary-light dark:bg-primary-dark text-white">
                          Primary
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(previewUrl)
                          setPendingPhotos((prev) => prev.filter((_, idx) => idx !== i))
                        }}
                        className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Remove ${file.name}`}
                      >
                        <X size={10} aria-hidden="true" />
                      </button>
                    </div>
                  ))}

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
                    onChange={async (e) => {
                      const files = Array.from(e.target.files ?? [])
                      const pending = await Promise.all(
                        files.map(async (file) => {
                          const converted = await convertIfHeic(file)
                          return {
                            file: converted,
                            previewUrl: URL.createObjectURL(converted)
                          }
                        })
                      )
                      setPendingPhotos((prev) => [...prev, ...pending])
                      e.target.value = ''
                    }}
                  />
                </div>
              </section>

              {/* Danger zone */}
              {isUpdating && auctionStatus === 'DRAFT' && (
                <div className="border border-red-500/20 bg-red-500/5">
                  <div className="px-4 py-3 border-b border-red-500/20">
                    <div className="flex items-center gap-2">
                      <span className="block w-3 h-px bg-red-500 shrink-0" aria-hidden="true" />
                      <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-red-500">Danger Zone</p>
                    </div>
                  </div>
                  <div className="px-4 py-4">
                    <p className="text-xs font-semibold text-text-light dark:text-text-dark mb-0.5">Delete Item</p>
                    <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mb-4 leading-relaxed">
                      Permanently removes this item and its data. Photos are removed from our records but may remain in
                      storage.
                    </p>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleting}
                      aria-busy={deleting}
                      className={`w-full py-2.5 text-[10px] font-mono tracking-[0.2em] uppercase transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 ${
                        confirmDel
                          ? 'border border-transparent bg-red-500 text-white'
                          : 'border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white'
                      }`}
                    >
                      {deleting ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 size={12} className="animate-spin" aria-hidden="true" /> Deleting...
                        </span>
                      ) : confirmDel ? (
                        <span className="flex items-center justify-center gap-2">
                          <CheckIcon size={12} aria-hidden="true" /> Confirm Delete
                        </span>
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
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
