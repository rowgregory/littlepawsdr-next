'use client'

import { fadeUp } from 'app/lib/constants/motion'
import { useUiSelector } from 'app/lib/store/store'
import { motion } from 'framer-motion'

const surrenderStatesData = [
  'Maine',
  'New Hampshire',
  'Vermont',
  'Massachusetts',
  'Rhode Island',
  'Connecticut',
  'New York',
  'New Jersey',
  'Pennsylvania',
  'Delaware',
  'Maryland',
  'Virginia',
  'North Carolina',
  'South Carolina',
  'Georgia',
  'Florida'
]

const SECTIONS = [
  {
    heading: 'Behavior Problems',
    body: 'If you are considering re-homing your dachshund because of behavior problems, there may be other options you can consider first. Talk to your vet about the issue to ensure the behavior is not a result of a medical problem or perhaps because the dog has not been spayed or neutered. You may also want to consider consulting a behaviorist who may be able to help resolve the problem with training (for you and your dog).'
  },
  {
    heading: 'Financial Assistance',
    body: 'If you are considering re-homing your dachshund because of financial issues or high vet costs, know that there are foundations and other organizations that may be able to offer financial assistance. A search of resources serving your geographic area may yield good results. Additionally, local governments offer lower-cost veterinary services.'
  },
  {
    heading: 'Personal Networks',
    body: 'Consider exploring your own personal networks of trusted friends, family, and co-workers who may be able to provide a good home for your dog.'
  },
  {
    heading: 'Surrendering Your Dog',
    body: 'When all options have been considered and you believe that surrendering your dog is the best option for you and your dachshund, Little Paws Dachshund Rescue may be able to help. All dachshunds that come into our rescue live in the home of an approved foster. Generally, the dog stays with the foster for two weeks before being posted on our website for adoption so we can better understand the needs and personality of the dog. All potential adopters go through a rigorous application process and are carefully screened.'
  }
]

export default function SurrenderPage() {
  const { isDark } = useUiSelector()
  return (
    <main id="main-content" className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-32">
        {/* ── Page header ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-10 sm:mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-8 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Surrender</p>
          </div>
          <h1 className="font-quicksand text-3xl sm:text-4xl font-bold text-text-light dark:text-text-dark leading-tight mb-6">
            Rehoming Your <span className="font-light text-muted-light dark:text-muted-dark">Dachshund</span>
          </h1>
          <p className="text-base text-muted-light dark:text-on-dark leading-relaxed">
            LPDR understands that rehoming may sometimes be necessary. People become ill, die, divorce, move overseas, develop allergies, lose their
            jobs, lose their homes, etc. Any of these situations can lead to a dog coming into rescue. We currently help rescue in the following
            states:
          </p>
        </motion.div>

        {/* ── States list ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="mb-12 sm:mb-16">
          <div
            className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-5 sm:p-6"
            aria-label="States where we currently rescue"
          >
            <ul className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-x-4 gap-y-2" role="list">
              {surrenderStatesData.map((state) => (
                <li key={state} className="flex items-center gap-2 text-sm text-text-light dark:text-text-dark">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
                  {state}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* ── Content sections ── */}
        <div className="flex flex-col gap-10 sm:gap-12 mb-16 sm:mb-20">
          {SECTIONS.map((section, i) => (
            <motion.section
              key={section.heading}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              custom={i}
              aria-labelledby={`section-${i}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
                <h2 id={`section-${i}`} className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
                  {section.heading}
                </h2>
              </div>
              <p className="text-base text-muted-light dark:text-on-dark leading-relaxed">{section.body}</p>
            </motion.section>
          ))}
        </div>

        {/* ── Surrender questionnaire ── */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          custom={0}
          aria-labelledby="questionnaire-heading"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
            <h2 id="questionnaire-heading" className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
              Surrender Questionnaire
            </h2>
          </div>
          <p className="text-base text-muted-light dark:text-on-dark leading-relaxed mb-8">
            To be considered for surrender, please complete and submit the following Surrender Questionnaire:
          </p>
          <div className="border border-border-light dark:border-border-dark overflow-hidden">
            {isDark ? (
              <iframe
                title="Surrender Application"
                width="100%"
                className="h-150 sm:h-175 block"
                src="https://toolkit.rescuegroups.org/of/f?c=RXYMKGSJ"
              ></iframe>
            ) : (
              <iframe
                title="Surrender Application"
                width="100%"
                className="h-150 sm:h-175 block"
                src="https://toolkit.rescuegroups.org/of/f?c=QCVXZJTH"
              />
            )}
          </div>
        </motion.section>
      </div>
    </main>
  )
}
