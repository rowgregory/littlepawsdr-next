'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Picture from '../common/Picture'

type GalleryImage = {
  id: number
  image: string
  span?: 'tall' | 'wide' | 'normal' | 'featured'
  alt?: string
}

const DOGS: GalleryImage[] = [
  { id: 1, image: '/images/gallery/gallery-3.jpg', span: 'tall', alt: 'Dachshund yawning on gravel' },
  { id: 2, image: '/images/gallery/gallery-9.jpg', span: 'featured', alt: 'Wirehaired dachshund wearing a checkered bandana' },
  { id: 3, image: '/images/gallery/gallery-2.jpg', span: 'normal', alt: 'Miniature dachshund standing on a sidewalk' },
  { id: 4, image: '/images/gallery/gallery-8.jpg', span: 'normal', alt: 'Two dachshunds resting on a blanket' },
  { id: 5, image: '/images/gallery/gallery-6.jpg', span: 'normal', alt: 'Dachshund cuddling with a colorful patchwork pillow' },
  { id: 6, image: '/images/gallery/gallery-7.jpg', span: 'normal', alt: 'One small dachshund playing on a sandy beach' },
  { id: 7, image: '/images/gallery/gallery-1.jpg', span: 'wide', alt: 'Piebald dachshund standing on pavement looking at camera' }
]

const DogCard = ({ dog, index }: { dog: GalleryImage; index: number }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.96 }}
    transition={{ duration: 0.35, delay: index * 0.15, ease: 'easeOut' }}
    className={`relative overflow-hidden group z-40 ${
      dog.span === 'tall' ? 'row-span-2' : dog.span === 'wide' ? 'col-span-2' : dog.span === 'featured' ? 'col-span-2 row-span-2' : ''
    }`}
  >
    <Picture
      priority={false}
      src={dog.image}
      alt={dog.alt ?? 'Dachshund rescue dog'}
      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
      style={{
        minHeight: dog.span === 'tall' || dog.span === 'featured' ? '520px' : '260px'
      }}
    />

    {/* Slide-up label on hover */}
    <div
      className="absolute bottom-0 h-30 w-full bg-primary-light dark:bg-primary-dark transition-all duration-500 z-30 translate-y-full group-hover:translate-y-0 flex items-center text-lg font-nunito px-10 text-white dark:text-bg-dark font-bold"
      aria-hidden="true"
    >
      {dog?.alt}
    </div>

    {/* Tint overlay */}
    <div
      className="absolute inset-0 bg-primary-light/20 dark:bg-primary-dark/15 group-hover:bg-primary-light/0 dark:group-hover:bg-primary-dark/0 transition-colors duration-500"
      aria-hidden="true"
    />
  </motion.div>
)

export const DogGalleryBlock = () => {
  return (
    <section aria-labelledby="gallery-heading" className="w-full bg-bg-light dark:bg-bg-dark">
      {/* Header */}
      <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3" aria-hidden="true">
            <div className="w-8 h-px bg-primary-light dark:bg-primary-dark" />
            <p className="text-xs font-bold uppercase tracking-widest text-muted-light dark:text-muted-dark font-nunito">Our Gallery</p>
          </div>
          <h2
            id="gallery-heading"
            className="font-quicksand leading-tight text-text-light dark:text-text-dark"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
          >
            <span className="font-black block">GALLERY</span>
            <span className="font-light">OF OUR DACHSHUNDS</span>
          </h2>
        </div>

        <Link
          href="/available"
          aria-label="View all dachshunds available for adoption"
          className="group relative font-nunito text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark rounded pb-1 text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark self-start sm:self-auto whitespace-nowrap"
        >
          View Dachshunds
          <span
            className="absolute bottom-0 left-0 w-0 group-hover:w-full h-px bg-primary-light dark:bg-primary-dark transition-all duration-300"
            aria-hidden="true"
          />
        </Link>
      </div>

      {/* Full-bleed grid */}
      <div role="list" aria-label="Dog gallery — all dogs" className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[330px]">
        <AnimatePresence mode="popLayout">
          {DOGS.map((dog, i) => (
            <DogCard key={dog.id} dog={dog} index={i} />
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}
