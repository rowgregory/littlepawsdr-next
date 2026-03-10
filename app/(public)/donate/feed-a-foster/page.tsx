'use client'

import Picture from 'app/components/common/Picture'
import { fadeUp } from 'app/lib/constants/motion'
import { motion } from 'framer-motion'

const feedAFosterData = [
  {
    img: '/images/feed-a-foster/kibble.jpg',
    title: 'Kibble for a Week',
    textKey:
      "Cover the cost of one foster dog's food for a full week. Every meal fuels their recovery and gets them one step closer to their forever home.",
    amount: 15
  },
  {
    img: '/images/feed-a-foster/vet.jpg',
    title: 'Vet Visit Fund',
    textKey: 'Help cover a routine vet visit for a foster dog. Regular checkups keep our fosters healthy and adoption-ready.',
    amount: 50
  },
  {
    img: '/images/feed-a-foster/treats.jpg',
    title: 'Treat & Enrichment Box',
    textKey: "Send a foster dog a month's worth of treats, chews, and enrichment toys. A happy dog is a healthy dog.",
    amount: 25
  },
  {
    img: '/images/feed-a-foster/medication.jpg',
    title: 'Monthly Medication',
    textKey: 'Many of our fosters come to us needing ongoing medication. Your donation covers one month of heartworm prevention and flea treatment.',
    amount: 35
  },
  {
    img: '/images/feed-a-foster/dental.jpg',
    title: 'Dental Care',
    textKey: "Dachshunds are prone to dental disease. Help us keep our fosters' teeth clean and pain-free with a dental cleaning fund contribution.",
    amount: 75
  },
  {
    img: '/images/feed-a-foster/transport.jpg',
    title: 'Transport & Rescue Pull',
    textKey: 'Cover the cost of pulling a dog from a shelter and transporting them to a foster home. This donation directly saves a life.',
    amount: 100
  }
]

export default function FeedAFoster() {
  const now = new Date()
  const isAvailable = now.getMonth() === 6 // 0-indexed, 6 = July
  return (
    <main id="main-content" className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-32">
        {/* ── Header ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-12 sm:mb-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="block w-8 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Feed A Foster</p>
            <span className="block w-8 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
          </div>
          <h1 className="font-quicksand text-3xl sm:text-4xl lg:text-5xl font-bold text-text-light dark:text-text-dark leading-tight mb-4">
            July is Foster <span className="font-light text-muted-light dark:text-muted-dark">Appreciation Month</span>
          </h1>
          <p className="text-base text-muted-light dark:text-on-dark max-w-lg mx-auto leading-relaxed">
            {isAvailable
              ? 'Please join us and help Feed A Foster! We are hosting our annual fundraiser, right here, online.'
              : 'Our annual Feed a Foster fundraiser opens in July. Check back then to support our foster dogs!'}
          </p>
        </motion.div>

        {/* ── Cards ── */}
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-light dark:bg-border-dark"
          role="list"
          aria-label="Feed a Foster donation options"
        >
          {feedAFosterData.map((item, i) => (
            <motion.li
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              custom={i}
              className="bg-bg-light dark:bg-bg-dark flex flex-col"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-surface-light dark:bg-surface-dark">
                <Picture
                  priority={false}
                  src={item.img}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />
                {/* Price badge */}
                <div className="absolute top-3 right-3 bg-primary-light dark:bg-primary-dark text-white font-mono text-sm font-bold px-3 py-1">
                  ${item.amount}
                </div>
              </div>

              {/* Content */}
              <div className={`flex flex-col flex-1 p-5 sm:p-6 gap-4 ${!isAvailable ? 'opacity-50' : ''}`}>
                <div>
                  <h2 className="font-quicksand text-lg font-bold text-text-light dark:text-text-dark mb-2">{item.title}</h2>
                  <p className="text-sm text-muted-light dark:text-on-dark leading-relaxed">{item.textKey}</p>
                </div>

                <div className="mt-auto pt-2">
                  {isAvailable ? (
                    <a
                      href={`https://donate.stripe.com?amount=${item.amount * 100}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Donate $${item.amount} for ${item.title}`}
                      className="block w-full text-center bg-button-light dark:bg-button-dark hover:bg-primary-light dark:hover:bg-primary-dark text-white font-semibold text-sm py-3 px-6 transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                    >
                      Donate ${item.amount}
                    </a>
                  ) : (
                    <div
                      aria-disabled="true"
                      role="button"
                      aria-label={`Donations for ${item.title} open in July`}
                      className="block w-full text-center bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark font-semibold text-sm py-3 px-6 cursor-not-allowed select-none"
                    >
                      Opens in July
                    </div>
                  )}
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </main>
  )
}
