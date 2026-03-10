'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const faq = [
  {
    q: 'Why Rescue?',
    a: 'Plain and simple, rescue saves lives! There’s a common misconception that dogs that are in shelters or are surrendered are “bad” dogs. That’s just not true. Instead, these dogs are the product of owners who didn’t anticipate the time, energy or financial needs of a dog. A number of dogs also end up in shelters due to owners that pass away, move to an apartment that doesn’t allow animals or feel that by having a child their animal isn’t a priority anymore. Lastly, a number of dogs come from puppy mills. These are dogs that either didn’t make it to the local storefront or “aged out of the system”. In all these instances, it’s the VERY lucky few that end up being taken into rescues such as Little Paws Dachshund Rescue.'
  },
  {
    q: "Why Aren't Rescue Dogs Free?",
    a: 'This is a common question. Veterinary care for our rescue dogs costs money! We pay many shelters a pull fee (similar to what you’d pay as an adopter at a shelter) and then each dog must have a physical examination, receive any required vaccinations, be tested for heartworms, and be spayed or neutered. In some instances, additional procedures, including dentals are performed as well. Add that up – and you’ll see that that rescues aren’t making money! We are an all-volunteer organization (ie. No paid salaries), with less than 5% overhead expenses. We rescue because it believe we can make a difference in the lives of dogs.'
  },
  {
    q: "I'm Interested in One of Your Dogs. Can I Find Out More Information About Him/Her?",
    a: 'Yes! We want all of our dogs and adopters to be set up to succeed. That means part of our adoption process is emailing or talking with LPDR’s foster parents.'
  },
  {
    q: 'How come I didn’t get the dog I applied for?',
    a: 'Many of our dogs get multiple applications. We process adoption applications in the order they are received, which means that if the first family makes it through the online application, reference check, vet check and home visit and is a great fit for the dog – they will be the adopter. Following submission of your adoption application, we will let you know if there are applications that have been received prior to yours. Our priority is to find homes where our dogs will be well cared for emotionally and physically.'
  },
  {
    q: 'If I adopt, are there any other fees I should know about, other than the adoption fee?',
    a: 'If the dog you are adopting is crossing state lines, there will be a fee for a health certificate. This is required by the USDA, to show that the dog has been seen by a veterinarian and is healthy. Some states also require a 48 hour quarantine. This fee will only be assessed in states mandating quarantine.'
  },
  {
    q: 'If my adopted dog isn’t the right fit for me, will you take him/her back?',
    a: 'Yes! Not only can we…we require that you return your adopted dog (as noted on our adoption contract) should the dog not be the right fit for you, or you can no longer care for him/her.'
  },
  {
    q: 'I rent my house. Can I adopt/foster?',
    a: 'Yes, being a renter doesn’t exclude you from being able to adopt or be a foster parent. As part of the application process, we will need written verification from your landlord that you are permitted to adopt/foster.'
  },
  {
    q: 'You listed a dog as a dachshund mix. Can you tell me what the dog is mixed with?',
    a: 'In many cases, we can identify (ie make an educated guess) what the breed mix is. However, that isn’t always the case. It’s not out of the question for a pregnant female that we intake to have pups from multiple “fathers” in the same litter.'
  }
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, easing: [0.25, 0.46, 0.45, 0.94], delay: i * 0.06 }
  })
}

export default function AdoptionFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  return (
    <main id="main-content" className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-32">
        {/* ── Header ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-8 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">FAQ</p>
          </div>
          <h1 className="font-quicksand text-4xl sm:text-5xl font-bold text-text-light dark:text-text-dark leading-tight mb-4">
            Frequently Asked <span className="font-light text-muted-light dark:text-muted-dark">Questions</span>
          </h1>
          <p className="text-base text-muted-light dark:text-on-dark leading-relaxed">
            Everything you need to know about adopting through Little Paws Dachshund Rescue.
          </p>
        </motion.div>

        {/* ── Accordion ── */}
        <dl className="flex flex-col gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark">
          {faq.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                custom={i % 5}
                className="bg-bg-light dark:bg-bg-dark"
              >
                <dt>
                  <button
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    id={`faq-question-${i}`}
                    className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="font-mono text-xs text-muted-light dark:text-muted-dark shrink-0 w-5" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-quicksand font-bold text-sm sm:text-base text-text-light dark:text-text-dark group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors">
                        {item.q}
                      </span>
                    </div>
                    <span
                      aria-hidden="true"
                      className={`shrink-0 w-4 h-4 flex items-center justify-center text-muted-light dark:text-muted-dark transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                    >
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
                        <path d="M8 2v12M2 8h12" />
                      </svg>
                    </span>
                  </button>
                </dt>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.dd
                      id={`faq-answer-${i}`}
                      role="region"
                      aria-labelledby={`faq-question-${i}`}
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } }}
                      exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 sm:px-6 pb-5 pl-13 sm:pl-15 text-sm text-muted-light dark:text-on-dark leading-relaxed">{item.a}</p>
                    </motion.dd>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </dl>
      </div>
    </main>
  )
}
