'use client'

import { useCallback, useEffect, useState } from 'react'
import Picture from '../common/Picture'
import { Play } from 'lucide-react'

const SLIDES = [
  {
    id: 1,
    tag: 'Give Them a Second Chance',
    heading: 'Every Dog Deserves A Loving Home',
    subheading: 'We rescue, rehabilitate, and rehome dachshunds in need. Join us in making a difference — one paw at a time.',
    primaryCta: { label: 'Adopt Today', href: '/adopt' },
    secondaryCta: { label: 'Make a Donation', href: '/donate' }
  },
  {
    id: 2,
    tag: 'Foster & Save Lives',
    heading: 'Open Your Home, Change a Life',
    subheading: 'Foster families are the backbone of our rescue. Provide a temporary safe haven while we find forever homes.',
    primaryCta: { label: 'Become a Foster', href: '/foster' },
    secondaryCta: { label: 'Learn More', href: '/about' }
  },
  {
    id: 3,
    tag: 'Make an Impact',
    heading: 'Your Support Saves Lives Every Day',
    subheading: 'From medical care to food and shelter, your donation goes directly toward giving rescued dogs the care they deserve.',
    primaryCta: { label: 'Donate Now', href: '/donate' },
    secondaryCta: { label: 'View Our Dogs', href: '/dogs' }
  }
]

export const Hero = () => {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const slideCount = SLIDES.length

  const goTo = useCallback((index: number) => setCurrent((index + slideCount) % slideCount), [slideCount])
  const goNext = useCallback(() => goTo(current + 1), [current, goTo])
  const goPrev = () => goTo(current - 1)

  useEffect(() => {
    if (paused) return
    const id = setInterval(goNext, 5500)
    return () => clearInterval(id)
  }, [current, goNext, paused])

  const slide = SLIDES[current]

  return (
    <section
      aria-label="Hero carousel"
      className="relative w-full bg-bg-dark -mt-[168.5px] h-200 1200:h-225"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background video */}
      <div className="absolute inset-0" aria-hidden="true">
        <video src="/videos/landing.mp4" autoPlay muted loop playsInline className="h-full w-full object-cover object-top" />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Slide content */}
      <div className="max-w-180 1000:max-w-240 1200:max-w-300 mx-auto relative z-10 flex h-full min-h-[inherit] flex-col justify-between">
        <div className="flex flex-1 items-center py-16">
          <div className="w-full tracking-tighter">
            <div className="tracking-tighter">
              <h1
                className="font-light tracking-tighter leading-none text-white font-quicksand m-0"
                style={{ fontSize: 'clamp(1.5rem, 4vw, 60px)' }}
                aria-live="polite"
                aria-atomic="true"
              >
                {slide.heading.split(' ').slice(0, 3).join(' ')}
              </h1>

              <h1
                className="font-bold leading-none text-white font-quicksand m-0"
                style={{ fontSize: 'clamp(2.5rem, 8vw, 100px)' }}
                aria-live="polite"
                aria-atomic="true"
              >
                {slide.heading.split(' ').slice(3).join(' ')}
              </h1>
            </div>
            {/* Subheading */}
            <p
              className="mb-8 leading-relaxed text-white/80 font-nunito max-w-xl"
              style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
              aria-live="polite"
              aria-atomic="true"
            >
              {slide.subheading}
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-3">
              <a
                href={slide.primaryCta.href}
                className="inline-flex items-center justify-center bg-transparent border-2 border-primary-light dark:border-primary-dark px-6 py-3 font-semibold font-nunito text-white hover:bg-primary-light dark:hover:bg-primary-dark hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95"
                style={{ minWidth: '140px', fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)' }}
              >
                {slide.primaryCta.label}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative z-10 w-full" style={{ backgroundColor: 'rgba(13,10,20,0.90)', backdropFilter: 'blur(8px)' }}>
          {/* Live cam thumbnail */}
          <div className="absolute left-0 bottom-0 1200:-bottom-10 w-70 1200:w-117.5 h-42.5 1200:h-55">
            <Picture src="/images/random/img-9.jpg" priority className="w-full h-full object-cover relative z-10" alt="Live cam preview" />
            <div className="absolute inset-0 bg-black/50 z-20 w-full h-full flex items-center justify-center gap-x-20">
              <h2 className="text-white text-lg font-nunito font-semibold">Live Cam</h2>
              <div className="w-14 h-14 rounded-full bg-primary-light dark:bg-primary-dark flex items-center justify-center" aria-hidden="true">
                <Play className="w-4 h-4 text-white dark:text-bg-dark" />
              </div>
            </div>
          </div>

          {/* Dot indicators */}
          <div
            className="absolute bottom-0 1200:-bottom-10 left-70 1200:left-117.5 z-20 flex items-center gap-10 bg-navbar-light dark:bg-navbar-dark px-17.5 py-12.5 flex-1 w-[calc(100%-280px)] 1200:w-107.5"
            role="tablist"
            aria-label="Slide indicators"
          >
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={i === current}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className="relative flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark rounded-full cursor-pointer"
              >
                {i === current ? (
                  <span className="relative flex items-center justify-center w-5 h-5" aria-hidden="true">
                    <span className="absolute inset-0 rounded-full border-2 border-primary-light dark:border-primary-dark" />
                    <span className="w-2 h-2 rounded-full bg-primary-light dark:bg-primary-dark" />
                  </span>
                ) : (
                  <span
                    className="w-2 h-2 rounded-full bg-on-dark/40 hover:bg-primary-light dark:hover:bg-primary-dark transition-colors"
                    aria-hidden="true"
                  />
                )}
              </button>
            ))}

            <span className="w-16 mx-2 h-px bg-on-dark/10" aria-hidden="true" />

            <span className="text-on-dark text-xs font-mono tabular-nums" aria-live="polite" aria-atomic="true">
              {current + 1}/{SLIDES.length}
            </span>
          </div>
        </div>
      </div>

      {/* Prev / Next controls */}
      <div className="hidden 1200:flex absolute left-0 right-0 top-1/2 z-20 -translate-y-1/2 justify-between px-2 sm:px-4">
        <button
          onClick={goPrev}
          aria-label="Previous slide"
          className="flex h-11 w-11 items-center justify-center border border-on-dark/20 bg-black/30 text-on-dark hover:bg-primary-light dark:hover:bg-primary-dark hover:text-white hover:border-transparent backdrop-blur-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          onClick={goNext}
          aria-label="Next slide"
          className="flex h-11 w-11 items-center justify-center border border-on-dark/20 bg-black/30 text-on-dark hover:bg-primary-light dark:hover:bg-primary-dark hover:text-white hover:border-transparent backdrop-blur-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Slide counter */}
      <div
        className="absolute right-4 top-4 z-20 px-3 py-1 text-xs font-mono font-medium text-on-dark sm:right-6 sm:top-6"
        style={{ backgroundColor: 'rgba(13,10,20,0.6)', backdropFilter: 'blur(4px)' }}
        aria-live="polite"
        aria-label={`Slide ${current + 1} of ${slideCount}`}
      >
        {String(current + 1).padStart(2, '0')} / {String(slideCount).padStart(2, '0')}
      </div>
    </section>
  )
}
