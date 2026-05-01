'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

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
    secondaryCta: { label: 'Learn More', href: '/' }
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

function getTimeLeft() {
  const race = new Date('2026-06-06T09:00:00-04:00')
  const now = new Date()
  const diff = race.getTime() - now.getTime()

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  }
}

function DachshundCountdown() {
  const [time, setTime] = useState(getTimeLeft())

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full text-center">
      <p className="text-f10 font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark mb-1">Georgia Dachshund Races</p>
      <p className="text-[11px] font-nunito text-muted-light dark:text-muted-dark mb-4">
        June 6, 2026 · Gwinnett County Fairgrounds · Benefiting LPDR
      </p>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { value: time.days, label: 'Days' },
          { value: time.hours, label: 'Hours' },
          { value: time.minutes, label: 'Mins' },
          { value: time.seconds, label: 'Secs' }
        ].map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center border border-border-light dark:border-border-dark px-2 py-2">
            <p className="font-sora font-black text-[24px] 1200:text-[28px] text-primary-light dark:text-primary-dark tabular-nums leading-none">
              {String(value).padStart(2, '0')}
            </p>
            <p className="text-f9 font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark mt-1">{label}</p>
          </div>
        ))}
      </div>

      <a
        href="https://www.ticketsignup.io/TicketEvent/GeorgiaDachshundRaces2026"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-full gap-2 px-4 py-2 border border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark text-[10px] font-mono tracking-[0.2em] uppercase hover:bg-primary-light dark:hover:bg-primary-dark hover:text-white dark:hover:text-bg-dark transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark focus-visible:ring-offset-2"
      >
        Get Tickets
        <ArrowRight className="w-3 h-3" aria-hidden="true" />
      </a>
    </div>
  )
}

export const Hero = () => {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const slideCount = SLIDES?.length

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
      className="relative w-full bg-bg-light dark:bg-bg-dark h-180 1200:h-200"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background video */}
      <div className="absolute inset-0" aria-hidden="true">
        <video src="/videos/landing-2.mp4" autoPlay muted loop playsInline className="h-full w-full object-cover object-top" />
        <div className="absolute inset-0 bg-linear-to-r from-bg-light/90 dark:from-bg-dark/90 via-bg-light/40 dark:via-bg-dark/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-bg-light/70 dark:from-bg-dark/70 via-transparent to-transparent" />
      </div>

      {/* Slide content */}
      <div className="max-w-180 1000:max-w-240 1200:max-w-300 mx-auto relative z-10 flex h-full min-h-[inherit] flex-col justify-between">
        <div className="flex flex-1 items-center py-16 px-5">
          <div className="w-full">
            <h1
              className="font-light tracking-tighter leading-none text-muted-light dark:text-on-dark font-quicksand m-0"
              style={{ fontSize: 'clamp(1.5rem, 4vw, 60px)' }}
              aria-live="polite"
              aria-atomic="true"
            >
              {slide.heading.split(' ').slice(0, 3).join(' ')}
            </h1>

            <h1
              className="font-bold tracking-tighter leading-none text-text-light dark:text-text-dark font-quicksand m-0 mb-6"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 100px)' }}
              aria-live="polite"
              aria-atomic="true"
            >
              {slide.heading.split(' ').slice(3).join(' ')}
            </h1>

            {/* Subheading */}
            <p
              className="mb-8 leading-relaxed text-muted-light dark:text-muted-dark font-nunito max-w-xl"
              style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
              aria-live="polite"
              aria-atomic="true"
            >
              {slide.subheading}
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-3">
              <Link
                href={slide.primaryCta.href}
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-light dark:bg-primary-dark text-white dark:text-bg-dark text-[10px] font-mono tracking-[0.2em] uppercase hover:bg-secondary-light dark:hover:bg-secondary-dark transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-bg-light dark:focus-visible:ring-offset-bg-dark active:scale-95"
              >
                {slide.primaryCta.label}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative z-10 w-full bg-navbar-light dark:bg-navbar-dark border-t border-border-light dark:border-border-dark">
          {/* ── Mobile (below md) ── */}
          <div className="flex md:hidden items-center justify-between px-4 py-3">
            {/* Dots */}
            <div className="flex items-center gap-3" role="tablist" aria-label="Slide indicators">
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  className="relative flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                >
                  {i === current ? (
                    <span className="relative flex items-center justify-center w-4 h-4" aria-hidden="true">
                      <span className="absolute inset-0 border-2 border-primary-light dark:border-primary-dark" />
                      <span className="w-1.5 h-1.5 bg-primary-light dark:bg-primary-dark" />
                    </span>
                  ) : (
                    <span
                      className="w-1.5 h-1.5 bg-muted-light/40 dark:bg-on-dark/40 hover:bg-primary-light dark:hover:bg-primary-dark transition-colors"
                      aria-hidden="true"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Counter */}
            <span
              className="text-[10px] font-mono tracking-[0.2em] tabular-nums text-muted-light dark:text-muted-dark"
              aria-live="polite"
              aria-atomic="true"
            >
              {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
            </span>

            {/* Prev / Next */}
            <div className="flex items-center gap-2">
              <button
                onClick={goPrev}
                aria-label="Previous slide"
                className="w-8 h-8 flex items-center justify-center border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                <svg
                  width="13"
                  height="13"
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
                className="w-8 h-8 flex items-center justify-center border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                <svg
                  width="13"
                  height="13"
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
          </div>

          {/* ── Desktop (md and up) — unchanged ── */}
          <div className="hidden md:block">
            {/* Live cam thumbnail */}
            <div className="absolute left-0 bottom-0 1200:-bottom-10 w-70 1200:w-117.5 h-42.5 1200:h-55 bg-bg-light/80 dark:bg-bg-dark/80 backdrop-blur-sm border-r border-border-light dark:border-border-dark overflow-hidden">
              <div className="w-full h-full flex items-center justify-center px-6">
                <DachshundCountdown />
              </div>
            </div>

            {/* Dot indicators */}
            <div
              className="absolute bottom-0 1200:-bottom-10 left-70 1200:left-117.5 z-20 flex items-center gap-10 bg-navbar-light dark:bg-navbar-dark border-l border-border-light dark:border-border-dark px-17.5 py-12.5 flex-1 w-[calc(100%-280px)] 1200:w-107.5"
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
                  className="relative flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark cursor-pointer"
                >
                  {i === current ? (
                    <span className="relative flex items-center justify-center w-5 h-5" aria-hidden="true">
                      <span className="absolute inset-0 rounded-full border-2 border-primary-light dark:border-primary-dark" />
                      <span className="w-2 h-2 rounded-full bg-primary-light dark:bg-primary-dark" />
                    </span>
                  ) : (
                    <span
                      className="w-2 h-2 rounded-full bg-muted-light/40 dark:bg-on-dark/40 hover:bg-primary-light dark:hover:bg-primary-dark transition-colors"
                      aria-hidden="true"
                    />
                  )}
                </button>
              ))}

              <span className="w-16 mx-2 h-px bg-border-light dark:bg-border-dark" aria-hidden="true" />

              <span
                className="text-muted-light dark:text-muted-dark text-[10px] font-mono tracking-[0.2em] tabular-nums"
                aria-live="polite"
                aria-atomic="true"
              >
                {current + 1}/{SLIDES.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Prev / Next controls */}
      <div className="hidden 1200:flex absolute left-0 right-0 top-1/2 z-20 -translate-y-1/2 justify-between px-2 sm:px-4">
        <button
          onClick={goPrev}
          aria-label="Previous slide"
          className="flex h-11 w-11 items-center justify-center border border-border-light dark:border-border-dark bg-surface-light/60 dark:bg-surface-dark/60 text-text-light dark:text-on-dark hover:bg-primary-light dark:hover:bg-primary-dark hover:text-white dark:hover:text-bg-dark hover:border-transparent backdrop-blur-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
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
          className="flex h-11 w-11 items-center justify-center border border-border-light dark:border-border-dark bg-surface-light/60 dark:bg-surface-dark/60 text-text-light dark:text-on-dark hover:bg-primary-light dark:hover:bg-primary-dark hover:text-white dark:hover:text-bg-dark hover:border-transparent backdrop-blur-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
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
        className="absolute right-4 top-4 z-20 px-3 py-1 text-[10px] font-mono tracking-[0.2em] font-medium text-muted-light dark:text-muted-dark bg-surface-light/60 dark:bg-surface-dark/60 border border-border-light dark:border-border-dark backdrop-blur-sm sm:right-6 sm:top-6"
        aria-live="polite"
        aria-label={`Slide ${current + 1} of ${slideCount}`}
      >
        {String(current + 1).padStart(2, '0')} / {String(slideCount).padStart(2, '0')}
      </div>
    </section>
  )
}
