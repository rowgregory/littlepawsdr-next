'use client'

import { motion } from 'framer-motion'
import { fadeUp } from 'app/lib/constants/motion'
import { useSession } from 'next-auth/react'
import { IPaymentMethod } from 'types/entities/payment-method.types'
import { DonateForm } from '../forms/DonateForm'

type IPublicDonateClient = {
  savedCards: IPaymentMethod[]
  userName: { firstName: string; lastName: string }
}

export default function PublicDonateClient({ savedCards, userName }: IPublicDonateClient) {
  const session = useSession()

  return (
    <main className="min-h-dvh px-4 1150:px-0 pt-12 sm:pt-16 pb-24 sm:pb-32 bg-bg-light dark:bg-bg-dark flex flex-col gap-y-20 sm:gap-y-28">
      <div className="max-w-5xl mx-auto w-full">
        {/* ── Page header ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-8 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">One-Time Donation</p>
          </div>
          <h1 className="font-quicksand text-4xl sm:text-5xl font-bold text-text-light dark:text-text-dark leading-tight mb-5">
            Make a <span className="font-light text-muted-light dark:text-muted-dark">Difference</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-light dark:text-on-dark leading-relaxed max-w-2xl">
            Every dollar goes directly to rescue, vetting, and care for our dachshunds.
          </p>
        </motion.div>

        {/* ── Two-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-12 items-start">
          {/* ── LEFT PANEL ── */}
          <motion.aside
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.5}
            className="lg:sticky lg:top-8 space-y-8"
            aria-label="About Little Paws Dachshund Rescue"
          >
            {/* Mission */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="block w-5 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Our Mission</p>
              </div>
              <p className="text-sm text-muted-light dark:text-muted-dark leading-relaxed">
                Little Paws Dachshund Rescue is a volunteer-run nonprofit dedicated to saving dachshunds and dachshund mixes from shelters,
                surrenders, and neglect — giving every long dog a second chance at a loving forever home.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-border-light dark:bg-border-dark" aria-hidden="true" />

            {/* Impact stats */}
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-5">Your Impact</p>
              <dl className="space-y-5">
                {[
                  { stat: '1,900+', label: 'Dogs rescued since 2012' },
                  { stat: '100%', label: 'Volunteer-operated' },
                  { stat: 'ME→FL', label: 'Rescue network up & down the East Coast' }
                ].map(({ stat, label }) => (
                  <div key={stat} className="flex items-baseline gap-4">
                    <dt className="font-quicksand font-black text-2xl te  xt-primary-light dark:text-primary-dark tabular-nums shrink-0">{stat}</dt>
                    <dd className="text-[11px] font-mono text-muted-light dark:text-muted-dark leading-snug">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Divider */}
            <div className="h-px bg-border-light dark:bg-border-dark" aria-hidden="true" />

            {/* What your donation covers */}
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-4">Where It Goes</p>
              <ul className="space-y-3" aria-label="What your donation covers">
                {[
                  { amount: '$25', desc: 'covers a vet wellness visit' },
                  { amount: '$50', desc: 'funds heartworm treatment' },
                  { amount: '$100', desc: 'sponsors a full rescue intake' }
                ].map(({ amount, desc }) => (
                  <li key={amount} className="flex items-start gap-3">
                    <span className="font-quicksand font-black text-sm text-primary-light dark:text-primary-dark shrink-0 mt-px">{amount}</span>
                    <span className="text-[11px] font-mono text-muted-light dark:text-muted-dark leading-snug">{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* ── Logged-in indicator ── */}
            {session?.data?.user && (
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}>
                <div className="h-px bg-border-light dark:bg-border-dark mb-8" aria-hidden="true" />
                <div className="flex items-center gap-3">
                  {/* Avatar initials circle */}
                  <div
                    aria-hidden="true"
                    className="shrink-0 w-8 h-8 rounded-full bg-primary-light/10 dark:bg-primary-dark/10 border border-primary-light/30 dark:border-primary-dark/30 flex items-center justify-center"
                  >
                    <span className="text-[10px] font-mono font-bold text-primary-light dark:text-primary-dark uppercase">
                      {session.data?.user?.name
                        ? session.data.user.name
                            .split(' ')
                            .map((n: string) => n[0])
                            .slice(0, 2)
                            .join('')
                        : session.data?.user?.email?.[0]}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">Signed in as</p>
                    <p className="text-xs font-mono text-text-light dark:text-text-dark truncate">{session.data.user.email}</p>
                  </div>
                  {/* Active dot */}
                  <div aria-hidden="true" className="shrink-0 ml-auto w-1.5 h-1.5 rounded-full bg-primary-light dark:bg-primary-dark" />
                </div>
              </motion.div>
            )}
          </motion.aside>

          {/* ── RIGHT PANEL — the form ── */}
          <DonateForm savedCards={savedCards} userName={userName} />
        </div>
        {/* end two-column grid */}
      </div>
    </main>
  )
}
