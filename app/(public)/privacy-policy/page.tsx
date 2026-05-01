'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const EFFECTIVE_DATE = 'April 22, 2026'

interface SectionProps {
  number: string
  title: string
  children: React.ReactNode
  delay?: number
}

function Section({ number, title, children, delay = 0 }: SectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      aria-labelledby={`section-${number}`}
      className="border-t border-border-light dark:border-border-dark pt-8 sm:pt-10"
    >
      <div className="flex items-baseline gap-4 mb-4">
        <span className="font-mono text-[10px] tracking-[0.2em] text-primary-light dark:text-primary-dark shrink-0">{number}</span>
        <h2 id={`section-${number}`} className="font-quicksand font-black text-lg sm:text-xl text-text-light dark:text-text-dark leading-tight">
          {title}
        </h2>
      </div>
      <div className="pl-0 sm:pl-8 space-y-4 font-nunito text-sm sm:text-[15px] text-text-light dark:text-text-dark leading-relaxed">{children}</div>
    </motion.section>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2" role="list">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-1.75 w-1 h-1 bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-quicksand font-bold text-[13px] sm:text-sm text-text-light dark:text-text-dark uppercase tracking-wide mb-2">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Muted({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-light dark:text-muted-dark">{children}</p>
}

export default function PrivacyPolicyPage() {
  return (
    <main id="main-content" className="bg-bg-light dark:bg-bg-dark min-h-screen">
      {/* Hero */}
      <section aria-labelledby="privacy-heading" className="relative border-b border-border-light dark:border-border-dark overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.055] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
          aria-hidden="true"
        />
        {/* Accent */}
        <div className="absolute top-0 left-0 w-1 h-20 bg-primary-light dark:bg-primary-dark" aria-hidden="true" />

        <div className="max-w-4xl mx-auto px-4 xs:px-5 sm:px-6 py-14 sm:py-20">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-3 mb-4"
            aria-hidden="true"
          >
            <div className="w-6 h-px bg-primary-light dark:bg-primary-dark" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Legal</span>
          </motion.div>

          <motion.h1
            id="privacy-heading"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="font-quicksand font-black text-3xl xs:text-4xl sm:text-5xl text-text-light dark:text-text-dark leading-tight mb-4 tracking-tight"
          >
            Privacy Policy
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex flex-wrap items-center gap-3 sm:gap-6"
          >
            <p className="font-mono text-[11px] tracking-widest text-muted-light dark:text-muted-dark">Effective {EFFECTIVE_DATE}</p>
            <span className="w-px h-3 bg-border-light dark:bg-border-dark" aria-hidden="true" />
            <p className="font-mono text-[11px] tracking-widest text-muted-light dark:text-muted-dark">littlepawsdr.org</p>
            <span className="w-px h-3 bg-border-light dark:bg-border-dark" aria-hidden="true" />
            <Link
              href="/"
              className="font-mono text-[11px] tracking-widest uppercase text-primary-light dark:text-primary-dark hover:underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
            >
              Home →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 xs:px-5 sm:px-6 py-10 sm:py-14 space-y-10 sm:space-y-12">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-5 sm:p-6"
        >
          <p className="font-nunito text-sm sm:text-[15px] text-text-light dark:text-text-dark leading-relaxed">
            Little Paws Dachshund Rescue (&quot;Little Paws,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is a volunteer-run 501(c)(3)
            nonprofit dedicated to rescuing, rehabilitating, and rehoming dachshunds and dachshund mixes. This Privacy Policy explains what personal
            information we collect through our platform at{' '}
            <a href="https://littlepawsdr.org" className="text-primary-light dark:text-primary-dark hover:underline underline-offset-2">
              littlepawsdr.org
            </a>
            , how we use it, and your rights with respect to that information.
          </p>
          <p className="font-nunito text-sm sm:text-[15px] text-muted-light dark:text-muted-dark leading-relaxed mt-3">
            By using our platform you agree to the practices described in this policy. If you do not agree, please do not use our services.
          </p>
        </motion.div>

        {/* Section 1 */}
        <Section number="01" title="Information We Collect">
          <SubSection title="Account Information">
            <p>When you create an account, we collect:</p>
            <BulletList
              items={[
                'First and last name',
                'Email address',
                'Phone number (optional)',
                'Account password (stored as a secure hash — we never store your plaintext password)'
              ]}
            />
          </SubSection>

          <SubSection title="Payment Information">
            <p>
              All payment processing is handled by{' '}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-light dark:text-primary-dark hover:underline underline-offset-2"
              >
                Stripe, Inc.
              </a>{' '}
              We do not store your raw credit card numbers, CVV codes, or full card details on our servers. What we store is limited to:
            </p>
            <BulletList
              items={[
                'A Stripe Customer ID — a tokenized reference to your record in Stripe',
                'Tokenized payment method references (last 4 digits, card brand, expiration date) provided by Stripe for display purposes only',
                'Order and transaction records including amounts, dates, and payment status'
              ]}
            />
            <Muted>Stripe&apos;s handling of your payment data is governed by the Stripe Privacy Policy at stripe.com/privacy.</Muted>
          </SubSection>

          <SubSection title="Transaction & Activity Data">
            <p>We maintain records of your activity on our platform, including:</p>
            <BulletList
              items={[
                'Auction bids placed, items won, and winning bidder payment status',
                'Welcome Wiener donations and associated dogs',
                'Store orders and order items',
                'Adoption fee payments',
                'Instant buy transactions'
              ]}
            />
          </SubSection>

          <SubSection title="Authentication Data">
            <p>
              We use NextAuth.js to manage authentication. When you sign in, we issue a signed JSON Web Token (JWT) stored in a secure, HttpOnly HTTP
              cookie on your browser. This token contains your user ID and session metadata. We do not store session records in our database —
              authentication state lives entirely in the cookie on your device and expires automatically.
            </p>
            <p>
              If you sign in via Google OAuth, we receive your name and email address from Google. We do not receive your Google password or any other
              Google account data beyond what is needed to identify you.
            </p>
          </SubSection>

          <SubSection title="Communication Preferences">
            <p>
              If you opt in to our newsletter or email communications, we store your email address and subscription preferences so we can send you
              updates about dogs, events, and fundraising campaigns.
            </p>
          </SubSection>

          <SubSection title="Automatically Collected Data">
            <p>When you visit our website, our hosting provider (Vercel) may automatically collect:</p>
            <BulletList
              items={['IP address', 'Browser type and version', 'Device type and operating system', 'Pages visited and time spent', 'Referring URL']}
            />
            <Muted>This data is used for security and performance monitoring. It is not sold or used for advertising.</Muted>
          </SubSection>
        </Section>

        {/* Section 2 */}
        <Section number="02" title="What We Do Not Collect">
          <BulletList
            items={[
              'Raw credit or debit card numbers — all payment data is tokenized by Stripe',
              'Adoption application data — applications are managed through Rescue Groups, a separate third-party platform governed by their own privacy policy',
              'Dog medical records, behavioral assessments, or veterinary data — this information is managed in Rescue Groups',
              'Biometric data of any kind',
              'Data from children under 13 — our platform is not directed at minors'
            ]}
          />
        </Section>

        {/* Section 3 */}
        <Section number="03" title="How We Use Your Information">
          <BulletList
            items={[
              'To create and manage your account',
              'To process donations, auction payments, adoption fees, and store orders',
              'To send transaction confirmations, payment receipts, and outbid notifications',
              'To send winner notifications and payment reminders for auction wins',
              'To send newsletters and event updates if you have opted in',
              'To maintain auction integrity and prevent fraudulent bidding activity',
              'To comply with legal obligations and respond to lawful requests',
              'To improve our platform and troubleshoot technical issues'
            ]}
          />
          <Muted>
            We do not use your personal information for advertising, sell it to data brokers, or share it with third parties for their marketing
            purposes.
          </Muted>
        </Section>

        {/* Section 4 */}
        <Section number="04" title="How We Share Your Information">
          <SubSection title="Service Providers">
            <p>
              We share data with a limited set of trusted service providers who help us operate our platform. Each provider processes data only as
              necessary to perform their service:
            </p>
            <BulletList
              items={[
                'Stripe, Inc. — payment processing and fraud prevention',
                'Resend — transactional email delivery (order confirmations, auction notifications, magic link sign-in emails)',
                'Pusher — real-time auction bid updates and live event notifications',
                'Firebase (Google) — media file storage for dog images',
                'Vercel — website hosting and edge delivery'
              ]}
            />
          </SubSection>

          <SubSection title="Legal Requirements">
            <p>
              We may disclose your information if required to do so by law or in response to valid legal process such as a subpoena, court order, or
              government request. We may also disclose information where we believe in good faith that disclosure is necessary to protect the rights,
              property, or safety of Little Paws, our users, or the public.
            </p>
          </SubSection>

          <SubSection title="Organizational Transfers">
            <p>
              In the unlikely event of a merger, acquisition, or transfer of assets, your information may be transferred as part of that transaction.
              We will notify you before your information becomes subject to a materially different privacy policy.
            </p>
          </SubSection>
        </Section>

        {/* Section 5 */}
        <Section number="05" title="Cookies & Local Storage">
          <BulletList
            items={[
              'Authentication cookie — a secure, HttpOnly cookie containing your signed JWT token. This cookie is set when you sign in and expires when your session ends or you sign out. It cannot be accessed by JavaScript running on the page.',
              "Preference storage — we may store light preferences such as your dark/light mode setting in your browser's local storage."
            ]}
          />
          <p>
            We do not use advertising cookies or third-party tracking cookies. You can clear cookies at any time through your browser settings, but
            doing so will sign you out of our platform.
          </p>
        </Section>

        {/* Section 6 */}
        <Section number="06" title="Data Retention">
          <BulletList
            items={[
              'Account information is retained for the life of your account plus a reasonable period thereafter in case of disputes or legal obligations',
              'Transaction records are retained for a minimum of 7 years to comply with nonprofit financial record-keeping requirements',
              'Auction and bidding records are retained indefinitely as part of our fundraising history',
              'Newsletter subscription records are retained until you unsubscribe'
            ]}
          />
          <p>
            If you request deletion of your account, we will delete or anonymize your personal information within 30 days, except where retention is
            required by law or for legitimate business purposes such as fraud prevention or pending disputes.
          </p>
        </Section>

        {/* Section 7 */}
        <Section number="07" title="Your Rights & Choices">
          <p>Depending on your location, you may have the following rights with respect to your personal information:</p>
          <BulletList
            items={[
              'Access — you may request a copy of the personal information we hold about you',
              'Correction — you may request that we correct inaccurate or incomplete information',
              'Deletion — you may request that we delete your personal information, subject to legal retention requirements',
              'Portability — you may request your data in a structured, machine-readable format',
              'Opt-out of communications — you may unsubscribe from our newsletter at any time using the unsubscribe link in any email, or by contacting us directly'
            ]}
          />
          <Muted>
            To exercise any of these rights, please contact us using the information below. We will respond to verified requests within 30 days.
          </Muted>
        </Section>

        {/* Section 8 */}
        <Section number="08" title="Security">
          <BulletList
            items={[
              'HTTPS encryption for all data in transit',
              'HttpOnly, Secure cookies to prevent client-side token theft',
              'Signed JWT tokens with expiration to limit session lifetime',
              'Payment data handled exclusively by Stripe — we never receive or store raw card data',
              'Access controls limiting which team members can access user data',
              'Regular dependency updates and security patches'
            ]}
          />
          <Muted>
            No method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your data, we cannot
            guarantee absolute security.
          </Muted>
        </Section>

        {/* Section 9 */}
        <Section number="09" title="Third-Party Links">
          <p>
            Our platform may contain links to third-party websites such as Rescue Groups, Give Lively, and event ticketing platforms. This Privacy
            Policy does not apply to those sites. We encourage you to review the privacy policies of any third-party services you use.
          </p>
        </Section>

        {/* Section 10 */}
        <Section number="10" title="Children's Privacy">
          <p>
            Our platform is not directed at children under the age of 13, and we do not knowingly collect personal information from children. If you
            believe we have inadvertently collected information from a child, please contact us immediately and we will delete it promptly.
          </p>
        </Section>

        {/* Section 11 */}
        <Section number="11" title="Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. When we do, we will update the effective date at the top of this document and, for
            material changes, notify registered users by email. Your continued use of our platform after changes take effect constitutes your
            acceptance of the updated policy.
          </p>
        </Section>

        {/* Section 12 */}
        <Section number="12" title="Contact Us">
          <p>If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:</p>
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-5">
            <p className="font-quicksand font-bold text-text-light dark:text-text-dark mb-2">Little Paws Dachshund Rescue</p>
            <Link
              href="/contact"
              className="font-mono text-[11px] tracking-widest text-primary-light dark:text-primary-dark hover:underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
            >
              littlepawsdr.org/contact →
            </Link>
          </div>
          <Muted>We are a volunteer-run organization and will do our best to respond to all inquiries within 5 business days.</Muted>
        </Section>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="border-t border-border-light dark:border-border-dark pt-8 flex flex-wrap items-center justify-between gap-4"
        >
          <p className="font-mono text-[10px] tracking-widest text-muted-light dark:text-muted-dark">
            Little Paws Dachshund Rescue — Privacy Policy — Effective {EFFECTIVE_DATE}
          </p>
          <Link
            href="/terms"
            className="font-mono text-[10px] tracking-[0.15em] uppercase text-primary-light dark:text-primary-dark hover:underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            Terms of Service →
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
