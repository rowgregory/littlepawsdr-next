'use client'

import { setInputs } from 'app/lib/store/slices/formSlice'
import { Check, Dog, ImagePlus, LayoutDashboard, Loader2, Minus, Plus, X } from 'lucide-react'
import { IWelcomeWiener, WelcomeWienerProduct } from 'types/entities/welcome-wiener'
import Picture from '../common/Picture'
import { WELCOME_WIENER_CATALOG, WELCOME_WIENER_CATEGORIES, WELCOME_WIENER_CATEGORY_LABELS } from 'app/lib/constants/welcome-wiener'
import { store, useFormSelector } from 'app/lib/store/store'
import { uploadFileToFirebase } from 'app/utils/uploadFileToFirebase'
import { showToast } from 'app/lib/store/slices/toastSlice'
import { useEffect, useState } from 'react'
import { Toggle } from '../ui/Toggle'
import { useRouter } from 'next/navigation'
import { createFormActions } from 'app/utils/formActions'
import { updateWelcomeWiener } from 'app/lib/actions/welcome-wiener/updateWelcomeWiener'
import { createWelcomeWiener } from 'app/lib/actions/welcome-wiener/createWelcomeWiener'
import Link from 'next/link'
import { Field, SectionLabel } from './form.components'
import { inputClass, inputErrorClass } from 'app/lib/constants/form.constants'

export function WelcomeWienerForm({ welcomeWiener }: { welcomeWiener: IWelcomeWiener | null }) {
  const router = useRouter()
  const isUpdating = !!welcomeWiener

  const { welcomeWienerForm } = useFormSelector()
  const inputs = welcomeWienerForm?.inputs
  const errors = welcomeWienerForm?.errors
  const { handleInput, setErrors, handleUploadProgress } = createFormActions('welcomeWienerForm', store.dispatch)

  const [loading, setLoading] = useState(false)
  const [pendingPhotos, setPendingPhotos] = useState<File[]>([])

  const setForm = (data: Record<string, any>) => store.dispatch(setInputs({ formName: 'welcomeWienerForm', data }))

  useEffect(() => {
    setForm(welcomeWiener ? { ...welcomeWiener, isUpdating: true } : { isLive: false, images: [], associatedProducts: [] })
  }, [welcomeWiener])

  const associated: WelcomeWienerProduct[] = inputs?.associatedProducts ?? []

  const isAdded = (id: string) => associated.some((p) => p.id === id)

  const toggleProduct = (product: WelcomeWienerProduct) => {
    setForm({ associatedProducts: isAdded(product.id) ? associated.filter((p) => p.id !== product.id) : [...associated, product] })
  }

  const handleSave = async () => {
    if (!inputs?.name?.trim()) {
      setErrors({ name: 'Required' })
      return
    }
    setLoading(true)
    setErrors({})

    // Upload pending images
    let uploaded: string[] = []
    if (pendingPhotos.length > 0) {
      try {
        uploaded = await Promise.all(pendingPhotos.map((file) => uploadFileToFirebase(file, handleUploadProgress)))
      } catch {
        setErrors({ form: 'Failed to upload images. Please try again.' })
        setLoading(false)
        return
      }
    }

    const payload = {
      name: inputs.name.trim(),
      bio: inputs.bio?.trim() || undefined,
      age: inputs.age?.trim() || undefined,
      isLive: !!inputs.isLive,
      images: [...(inputs?.images ?? []), ...uploaded], // kept existing + new — full array, this column replaces
      associatedProducts: associated
    }

    const result = isUpdating ? await updateWelcomeWiener(welcomeWiener!.id, payload) : await createWelcomeWiener(payload)

    if (!result.success) {
      setErrors({ form: result.error ?? 'Something went wrong.' })
      setLoading(false)
      return
    }

    store.dispatch(
      showToast({
        type: 'success',
        message: `${payload.name} ${isUpdating ? 'updated' : 'created'}`,
        description: [`${associated.length} donation product${associated.length === 1 ? '' : 's'}`, payload.isLive ? 'Live' : 'Draft'].join(' · ')
      })
    )

    if (isUpdating) {
      router.refresh()
      setLoading(false)
      setPendingPhotos([])
    } else {
      router.push('/admin/welcome-wieners')
    }
  }

  return (
    <main id="main-content" className="min-h-dvh w-full bg-bg-light dark:bg-bg-dark">
      {/* ── Topbar ── */}
      <header className="fixed top-0 z-10 w-full border-b border-border-light dark:border-border-dark bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur px-4 h-10 flex items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 min-w-0">
          <Link
            href="/admin/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            <LayoutDashboard className="w-3 h-3" aria-hidden="true" />
            Dashboard
          </Link>
          <span className="hidden sm:inline text-[9px] font-mono text-border-light dark:text-muted-dark/70" aria-hidden="true">
            /
          </span>
          <Link
            href="/admin/welcome-wieners"
            className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark shrink-0"
          >
            Welcome Wieners
          </Link>
          <span className="text-[9px] font-mono text-border-light dark:text-muted-dark/70" aria-hidden="true">
            /
          </span>
          <h1 className="text-[9px] font-mono tracking-[0.15em] uppercase text-text-light dark:text-text-dark truncate" aria-current="page">
            {isUpdating ? 'Edit Wiener' : 'New Wiener'}
          </h1>
        </nav>
      </header>

      <div className="w-full px-4 sm:px-6 pt-10 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* ── Title band ── */}
          <div className="flex items-center gap-3 pt-6 pb-4">
            <div className="w-8 h-8 flex items-center justify-center bg-primary-light/10 dark:bg-primary-dark/10 shrink-0">
              <Dog size={15} className="text-primary-light dark:text-primary-dark" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Welcome Wiener</p>
              <h2 className="text-xl font-quicksand font-black text-text-light dark:text-text-dark leading-snug truncate">
                {isUpdating ? `Edit ${inputs?.name ?? 'Wiener'}` : 'Add Wiener'}
              </h2>
            </div>
          </div>

          {/* ── Body grid ── */}
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-6 xl:gap-8 items-start pb-6">
            {/* ════ Left — profile, settings, products ════ */}
            <div className="space-y-5 min-w-0">
              {errors?.form && (
                <p role="alert" className="px-4 py-3 border border-red-500/30 bg-red-500/10 text-red-500 text-xs font-mono">
                  {errors.form}
                </p>
              )}

              {/* ── Profile ── */}
              <SectionLabel>Profile</SectionLabel>

              <Field id="ww-name" label="Name *" error={errors?.name}>
                <input
                  id="ww-name"
                  name="name"
                  type="text"
                  value={inputs?.name ?? ''}
                  onChange={handleInput}
                  placeholder="Peanut"
                  className={`${inputClass} ${errors?.name ? inputErrorClass : ''}`}
                  aria-invalid={!!errors?.name}
                  autoFocus
                />
              </Field>

              <Field id="ww-bio" label="Bio" error={errors?.bio}>
                <textarea
                  id="ww-bio"
                  name="bio"
                  value={inputs?.bio ?? ''}
                  onChange={handleInput}
                  placeholder="Tell this pup's story..."
                  rows={6}
                  className={`${inputClass} resize-y ${errors?.bio ? inputErrorClass : ''}`}
                  aria-invalid={!!errors?.bio}
                />
              </Field>

              <Field id="ww-age" label="Age" error={errors?.age}>
                <input
                  id="ww-age"
                  name="age"
                  type="text"
                  value={inputs?.age ?? ''}
                  onChange={handleInput}
                  placeholder="3 years"
                  className={`${inputClass} ${errors?.age ? inputErrorClass : ''}`}
                  aria-invalid={!!errors?.age}
                />
              </Field>

              {/* ── Donation products ── */}
              <SectionLabel>Donation Products</SectionLabel>
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
                              className={`w-full flex items-center justify-between px-3.5 py-2.5 border transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark text-left ${
                                added
                                  ? 'border-primary-light dark:border-primary-dark bg-primary-light/5 dark:bg-primary-dark/5'
                                  : 'border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:border-primary-light/50 dark:hover:border-primary-dark/50'
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
                                    <Check className="w-3 h-3 text-white dark:text-bg-dark" aria-hidden="true" />
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
              {errors?.associatedProducts && (
                <p role="alert" className="text-[11px] text-red-500 dark:text-red-400 font-mono">
                  {errors.associatedProducts}
                </p>
              )}
            </div>

            {/* ════ Right — images + selected summary ════ */}
            <div className="space-y-5 min-w-0">
              {/* ── Settings ── */}
              <SectionLabel>Settings</SectionLabel>
              <Toggle
                id="ww-isLive"
                label="Live"
                description="Visible to the public on the donation page"
                checked={inputs?.isLive ?? false}
                onToggle={() => setForm({ isLive: !inputs?.isLive })}
              />

              <section className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                <div className="px-4 py-2.5 border-b border-border-light dark:border-border-dark">
                  <h3 className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Photos</h3>
                </div>
                <div className="px-4 py-4 flex flex-col gap-1.5">
                  {/* Existing photos (edit mode) */}
                  {/* Existing photos (edit mode) */}
                  {isUpdating && inputs?.images?.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {inputs?.images.map((photo: string, i: number) => (
                        <div key={photo} className="relative group aspect-square border border-border-light dark:border-border-dark overflow-hidden">
                          <Picture priority={true} src={photo} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setForm({ images: inputs.images.filter((url: string) => url !== photo) })}
                            aria-label={`Remove image ${i + 1}`}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity flex items-center justify-center focus:outline-none"
                          >
                            <X className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pending photos preview */}
                  {pendingPhotos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {pendingPhotos.map((file, i) => (
                        <div
                          key={`${file.name}-${i}`}
                          className="relative group aspect-square border border-border-light dark:border-border-dark overflow-hidden"
                        >
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
                      e.target.value = ''
                    }}
                  />
                </div>
              </section>

              {/* Selected summary card */}
              {associated.length > 0 && (
                <section className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                  <div className="px-4 py-2.5 border-b border-border-light dark:border-border-dark flex items-center justify-between">
                    <h3 className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Selected</h3>
                    <span className="text-[9px] font-mono tabular-nums text-primary-light dark:text-primary-dark">{associated.length}</span>
                  </div>
                  <div className="px-4 py-3 space-y-1.5">
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
                </section>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky action bar — replaces the in-column Actions block ── */}
      <div className="fixed bottom-0 inset-x-0 z-20 w-full border-t border-border-light dark:border-border-dark bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-end gap-3">
          {errors?.form && (
            <p role="alert" className="mr-auto text-[10px] font-mono text-red-500 dark:text-red-400 truncate">
              {errors.form}
            </p>
          )}
          <Link
            href="/admin/welcome-wieners"
            className="px-4 py-2.5 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark text-[10px] font-mono tracking-[0.2em] uppercase hover:text-text-light dark:hover:text-text-dark hover:border-primary-light/40 dark:hover:border-primary-dark/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            aria-busy={loading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white dark:text-bg-dark text-[10px] font-mono tracking-[0.2em] uppercase transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            {loading ? (
              <>
                <Loader2 size={13} className="animate-spin" aria-hidden="true" /> {isUpdating ? 'Saving...' : 'Creating...'}
              </>
            ) : (
              <>
                <Dog size={13} aria-hidden="true" /> {isUpdating ? 'Save Changes' : 'Create Wiener'}
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  )
}
