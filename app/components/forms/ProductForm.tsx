'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Upload, Loader2, ArrowLeft, Package, Save } from 'lucide-react'
import Link from 'next/link'
import { createProduct } from 'app/lib/actions/product/createProduct'
import Picture from 'app/components/common/Picture'
import { uploadFileToFirebase } from 'app/utils/firebase.utils'
import { IProduct } from 'types/entities/product'
import { updateProduct } from 'app/lib/actions/product/updateProduct'

type SizeEntry = { size: string; quantity: number }

interface FormState {
  name: string
  description: string
  price: string
  shippingPrice: string
  countInStock: string
  isPhysicalProduct: boolean
  isLive: boolean
  images: string[]
  sizes: SizeEntry[]
}

const inputCls = `
  w-full px-3 py-2.5 text-[11px] font-mono
  bg-bg-light dark:bg-bg-dark
  border border-border-light dark:border-border-dark
  text-text-light dark:text-text-dark
  placeholder:text-muted-light dark:placeholder:text-muted-dark
  focus:outline-none focus:border-primary-light dark:focus:border-primary-dark
  transition-colors
`

const labelCls = `
  block text-[10px] font-mono tracking-[0.15em] uppercase
  text-muted-light dark:text-muted-dark mb-1.5
`
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

export default function ProductForm({ product }: { product?: IProduct }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isEditing = !!product
  const [form, setForm] = useState<FormState>({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price?.toString() ?? '',
    shippingPrice: product?.shippingPrice?.toString() ?? '',
    countInStock: product?.countInStock?.toString() ?? '',
    sizes: product?.sizes ?? [],
    isPhysicalProduct: product?.isPhysicalProduct ?? true,
    isLive: product?.isLive ?? false,
    images: product?.images ?? []
  })

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }))

  const [uploadingImages, setUploadingImages] = useState<{ file: File; progress: number; url?: string }[]>([])

  const hasSizes = form.sizes.length > 0
  const sizesTotal = form.sizes.reduce((sum, s) => sum + (s.quantity || 0), 0)
  const countInStock = hasSizes ? sizesTotal : parseInt(form.countInStock) || 0

  const handleImageFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const newUploads = Array.from(files).map((file) => ({ file, progress: 0 }))
    setUploadingImages((prev) => [...prev, ...newUploads])

    await Promise.all(
      Array.from(files).map(async (file) => {
        try {
          const url = await uploadFileToFirebase(
            file,
            (progress) => {
              setUploadingImages((prev) => prev.map((u) => (u.file.name === file.name ? { ...u, progress } : u)))
            },
            'image'
          )
          setUploadingImages((prev) => prev.map((u) => (u.file.name === file.name ? { ...u, progress: 100, url } : u)))
          setForm((prev) => ({ ...prev, images: [...prev.images, url] }))
        } catch (err) {
          console.error(`Failed to upload ${file.name}`, err)
          setUploadingImages((prev) => prev.filter((u) => u.file.name !== file.name))
        }
      })
    )
  }

  const removeImage = (index: number) =>
    set(
      'images',
      form.images.filter((_, i) => i !== index)
    )

  const handleSubmit = async () => {
    if (!form.name.trim()) return
    setLoading(true)

    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price) || 0,
      shippingPrice: parseFloat(form.shippingPrice) || 0,
      countInStock,
      sizes: form.sizes.length > 0 ? form.sizes : null,
      isPhysicalProduct: form.isPhysicalProduct,
      isLive: form.isLive,
      images: form.images
    }

    const res = isEditing ? await updateProduct({ id: product.id, ...payload }) : await createProduct(payload)

    setLoading(false)
    if (res.success) {
      router.push('/admin/products')
    }
  }

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">
      {/* ── Top bar ── */}
      <div className="h-16.25 px-5 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex items-center justify-between gap-3 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors"
            aria-label="Back to products"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-px h-4 bg-border-light dark:bg-border-dark" aria-hidden="true" />
          <Package className="w-3.5 h-3.5 text-primary-light dark:text-primary-dark" aria-hidden="true" />
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
            {isEditing ? 'Edit Product' : 'New Product'}
          </span>
        </div>

        <motion.button
          onClick={handleSubmit}
          disabled={loading || !form.name.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-mono tracking-[0.2em] uppercase bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="w-3.5 h-3.5" aria-hidden="true" />
          )}
          {loading ? 'Saving...' : 'Save Product'}
        </motion.button>
      </div>

      {/* ── Body ── */}
      <div className="max-w-4xl mx-auto px-5 py-8 grid grid-cols-1 1000:grid-cols-12 gap-6">
        {/* ── Left — Core fields ── */}
        <div className="1000:col-span-8 flex flex-col gap-6">
          {/* Identity */}
          <section className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-5">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border-light dark:border-border-dark">
              <div className="w-1 h-3.5 bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
              <h2 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
                Identity
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="name" className={labelCls}>
                  Product Name <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Dachshund Plush Toy"
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="description" className={labelCls}>
                  Description
                </label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Describe the product..."
                  rows={5}
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-5">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border-light dark:border-border-dark">
              <div className="w-1 h-3.5 bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
              <h2 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
                Pricing & Inventory
              </h2>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-3 gap-4">
              <div>
                <label htmlFor="price" className={labelCls}>
                  Price ($)
                </label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  placeholder="0.00"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="shipping" className={labelCls}>
                  Shipping ($)
                </label>
                <input
                  id="shipping"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.shippingPrice}
                  onChange={(e) => set('shippingPrice', e.target.value)}
                  placeholder="0.00"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="stock" className={labelCls}>
                  Count in Stock
                </label>
                {hasSizes ? (
                  <>
                    <input
                      id="stock"
                      type="number"
                      value={sizesTotal}
                      readOnly
                      disabled
                      aria-describedby="stock-hint"
                      className={`${inputCls} opacity-60 cursor-not-allowed`}
                    />
                    <p id="stock-hint" className="mt-1 text-[9px] font-mono text-muted-light dark:text-muted-dark">
                      Calculated from sizes
                    </p>
                  </>
                ) : (
                  <input
                    id="stock"
                    type="number"
                    min="0"
                    value={form.countInStock}
                    onChange={(e) => set('countInStock', e.target.value)}
                    placeholder="0"
                    className={inputCls}
                  />
                )}
              </div>
            </div>
          </section>

          {/* Sizes */}
          <section className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-5">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border-light dark:border-border-dark">
              <div className="w-1 h-3.5 bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
              <h2 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
                Sizes
              </h2>
              <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark ml-auto">
                {form.sizes.length} {form.sizes.length === 1 ? 'size' : 'sizes'}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <AnimatePresence>
                {form.sizes.map((entry, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center"
                  >
                    <select
                      value={entry.size}
                      onChange={(e) => {
                        const updated = [...form.sizes]
                        updated[i] = { ...updated[i], size: e.target.value }
                        set('sizes', updated)
                      }}
                      aria-label={`Size ${i + 1}`}
                      className={inputCls}
                    >
                      <option value="">Select size</option>
                      {SIZE_OPTIONS.map((s) => (
                        <option
                          key={s}
                          value={s}
                          disabled={form.sizes.some((entry, idx) => idx !== i && entry.size === s)}
                        >
                          {s}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="0"
                      value={entry.quantity === 0 ? '' : entry.quantity}
                      onChange={(e) => {
                        const updated = [...form.sizes]
                        updated[i] = {
                          ...updated[i],
                          quantity: e.target.value === '' ? 0 : parseInt(e.target.value) || 0
                        }
                        set('sizes', updated)
                      }}
                      placeholder="Qty"
                      aria-label={`Quantity for size ${i + 1}`}
                      className={inputCls}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        set(
                          'sizes',
                          form.sizes.filter((_, idx) => idx !== i)
                        )
                      }
                      className="text-muted-light dark:text-muted-dark hover:text-red-500 transition-colors p-1"
                      aria-label={`Remove size ${entry.size || i + 1}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {form.sizes.length > 0 && (
                <div className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-1 mt-0.5">
                  <span className="text-[9px] font-mono text-muted-light dark:text-muted-dark px-0.5">SIZE</span>
                  <span className="text-[9px] font-mono text-muted-light dark:text-muted-dark px-0.5">QUANTITY</span>
                  <span className="w-5" />
                </div>
              )}

              <button
                type="button"
                onClick={() => set('sizes', [...form.sizes, { size: '', quantity: 0 }])}
                className="flex items-center gap-2 px-3 py-2 border border-dashed border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors w-full justify-center mt-1"
              >
                <Plus className="w-3 h-3" aria-hidden="true" />
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase">Add Size</span>
              </button>
            </div>
          </section>

          {/* Images */}
          <section className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-5">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border-light dark:border-border-dark">
              <div className="w-1 h-3.5 bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
              <h2 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
                Images
              </h2>
              <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark ml-auto">
                {form.images.length} uploaded
              </span>
            </div>

            {/* Upload zone */}
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center py-8 border border-dashed border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark transition-colors cursor-pointer group mb-4"
            >
              <Upload
                className="w-6 h-6 text-muted-light dark:text-muted-dark group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors mb-2"
                aria-hidden="true"
              />
              <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark group-hover:text-text-light dark:group-hover:text-text-dark transition-colors">
                Click to upload images
              </p>
              <p className="text-[9px] font-mono text-muted-light dark:text-muted-dark mt-1">
                Multiple files supported
              </p>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => handleImageFiles(e.target.files)}
              />
            </label>

            {/* Uploading progress */}
            <AnimatePresence>
              {uploadingImages
                .filter((u) => !u.url)
                .map(({ file, progress }) => (
                  <motion.div
                    key={file.name}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 p-2.5 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark mb-2"
                  >
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-light dark:text-primary-dark shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark truncate mb-1">
                        {file.name}
                      </p>
                      <div className="h-1 bg-border-light dark:bg-border-dark w-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary-light dark:bg-primary-dark"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.2 }}
                        />
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-muted-light dark:text-muted-dark shrink-0">
                      {Math.round(progress)}%
                    </span>
                  </motion.div>
                ))}
            </AnimatePresence>

            {/* Uploaded images */}
            <AnimatePresence>
              {form.images.map((url, i) => (
                <motion.div
                  key={url}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="flex items-center gap-3 p-2.5 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark mb-2"
                >
                  <Picture
                    priority
                    src={url}
                    alt={`Product image ${i + 1}`}
                    className="w-10 h-10 object-cover shrink-0"
                  />
                  <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark truncate flex-1">
                    {url}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="text-muted-light dark:text-muted-dark hover:text-red-500 transition-colors shrink-0"
                    aria-label="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {form.images.length === 0 && uploadingImages.length === 0 && (
              <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark text-center py-2">
                No images uploaded yet
              </p>
            )}
          </section>
        </div>

        {/* ── Right — Settings ── */}
        <div className="1000:col-span-4 flex flex-col gap-6">
          <section className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-5">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border-light dark:border-border-dark">
              <div className="w-1 h-3.5 bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
              <h2 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
                Settings
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {/* Physical product toggle */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-mono text-text-light dark:text-text-dark">Physical Product</p>
                  <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">
                    Requires shipping
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => set('isPhysicalProduct', !form.isPhysicalProduct)}
                  className={`relative w-10 h-5.5 rounded-full transition-colors focus:outline-none ${
                    form.isPhysicalProduct
                      ? 'bg-primary-light dark:bg-primary-dark'
                      : 'bg-border-light dark:bg-border-dark'
                  }`}
                  aria-checked={form.isPhysicalProduct}
                  role="switch"
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                      form.isPhysicalProduct ? 'translate-x-4.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="h-px bg-border-light dark:bg-border-dark" />

              {/* Live toggle */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-mono text-text-light dark:text-text-dark">Published</p>
                  <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">
                    Visible to customers
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => set('isLive', !form.isLive)}
                  className={`relative w-10 h-5.5 rounded-full transition-colors focus:outline-none ${
                    form.isLive ? 'bg-primary-light dark:bg-primary-dark' : 'bg-border-light dark:bg-border-dark'
                  }`}
                  aria-checked={form.isLive}
                  role="switch"
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                      form.isLive ? 'translate-x-4.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Summary */}
          <section className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-5">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border-light dark:border-border-dark">
              <div className="w-1 h-3.5 bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
              <h2 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
                Summary
              </h2>
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Price', value: form.price ? `$${parseFloat(form.price).toFixed(2)}` : '—' },
                {
                  label: 'Shipping',
                  value: form.shippingPrice ? `$${parseFloat(form.shippingPrice).toFixed(2)}` : '—'
                },
                { label: 'Stock', value: countInStock || '—' },
                { label: 'Images', value: form.images.length },
                { label: 'Type', value: form.isPhysicalProduct ? 'Physical' : 'Digital' },
                { label: 'Status', value: form.isLive ? 'Live' : 'Draft' }
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark">{label}</span>
                  <span
                    className={`text-[10px] font-mono ${
                      label === 'Status'
                        ? form.isLive
                          ? 'text-emerald-500'
                          : 'text-muted-light dark:text-muted-dark'
                        : 'text-text-light dark:text-text-dark'
                    }`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
