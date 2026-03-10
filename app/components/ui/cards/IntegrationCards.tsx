'use client'

import { motion } from 'framer-motion'
import { RefreshCw, ExternalLink, CreditCard, Flame, Triangle, Train, Zap, Mail, BarChart2, Check, Copy, EyeOff, Eye } from 'lucide-react'
import { useState } from 'react'

function CredentialsSection({ email, password }: { email: string; password: string }) {
  const [showPassword, setShowPassword] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedPass, setCopiedPass] = useState(false)

  function copy(value: string, setCopied: (v: boolean) => void) {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border-t border-border-light dark:border-border-dark px-5 py-4 flex flex-col gap-3">
      <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Credentials</p>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <p className="text-[9px] font-mono tracking-[0.15em] uppercase text-muted-light/60 dark:text-muted-dark/60">Email</p>
        <div className="flex items-center gap-0 border border-border-light dark:border-border-dark">
          <p className="flex-1 px-3 py-2 text-[10px] font-mono text-text-light dark:text-text-dark truncate bg-surface-light dark:bg-surface-dark">
            {email}
          </p>
          <button
            onClick={() => copy(email, setCopiedEmail)}
            aria-label={copiedEmail ? 'Email copied' : 'Copy email'}
            className="shrink-0 w-8 h-8 flex items-center justify-center border-l border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            {copiedEmail ? <Check size={11} className="text-green-500" aria-hidden="true" /> : <Copy size={11} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <p className="text-[9px] font-mono tracking-[0.15em] uppercase text-muted-light/60 dark:text-muted-dark/60">Password</p>
        <div className="flex items-center gap-0 border border-border-light dark:border-border-dark">
          <p className="flex-1 px-3 py-2 text-[10px] font-mono text-text-light dark:text-text-dark truncate bg-surface-light dark:bg-surface-dark">
            {showPassword ? password : '•'.repeat(Math.min(password.length, 24))}
          </p>
          <button
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            className="shrink-0 w-8 h-8 flex items-center justify-center border-l border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            {showPassword ? <EyeOff size={11} aria-hidden="true" /> : <Eye size={11} aria-hidden="true" />}
          </button>
          <button
            onClick={() => copy(password, setCopiedPass)}
            aria-label={copiedPass ? 'Password copied' : 'Copy password'}
            className="shrink-0 w-8 h-8 flex items-center justify-center border-l border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            {copiedPass ? <Check size={11} className="text-green-500" aria-hidden="true" /> : <Copy size={11} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Status = 'connected' | 'error' | 'syncing'

interface IntegrationCardProps {
  label: string
  name: string
  description: string
  status: Status
  stats: { label: string; value: string }[]
  href: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  onAction?: () => void
  actionLabel?: string
  credentials?: { email: string; password: string }
}

// ─── Shared status config ─────────────────────────────────────────────────────
function useStatus(status: Status) {
  return {
    connected: { label: 'Connected', dot: 'bg-green-500', className: 'text-green-600 dark:text-green-400' },
    error: { label: 'Error', dot: 'bg-red-500', className: 'text-red-500 dark:text-red-400' },
    syncing: { label: 'Syncing', dot: 'bg-primary-light dark:bg-primary-dark', className: 'text-primary-light dark:text-primary-dark' }
  }[status]
}

// ─── Base card ────────────────────────────────────────────────────────────────
function IntegrationCard({
  label,
  name,
  description,
  status,
  stats,
  href,
  icon: Icon,
  iconBg,
  iconColor,
  onAction,
  actionLabel,
  credentials
}: IntegrationCardProps) {
  const s = useStatus(status)

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-label={`${name} integration status`}
      className="border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-light dark:border-border-dark">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 ${iconBg} flex items-center justify-center shrink-0 border border-border-light dark:border-border-dark`}>
            <Icon size={14} className={iconColor} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-mono font-black tracking-wide text-text-light dark:text-text-dark leading-none">{name}</p>
            <p className="text-[9px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mt-0.5">{label}</p>
          </div>
        </div>

        {/* Status */}
        <div className={`flex items-center gap-1.5 ${s.className}`} role="status" aria-label={`${name} status: ${s.label}`}>
          {status === 'syncing' ? (
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} aria-hidden="true">
              <RefreshCw size={11} />
            </motion.span>
          ) : (
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className={`block w-1.5 h-1.5 ${s.dot}`}
              aria-hidden="true"
            />
          )}
          <span className="text-[9px] font-mono tracking-[0.2em] uppercase">{s.label}</span>
        </div>
      </div>

      {/* Description */}
      <p className="px-5 py-3 text-[10px] font-mono text-muted-light dark:text-muted-dark border-b border-border-light dark:border-border-dark leading-relaxed">
        {description}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-px bg-border-light dark:bg-border-dark border-b border-border-light dark:border-border-dark">
        {stats.map(({ label, value }) => (
          <div key={label} className="bg-bg-light dark:bg-bg-dark px-5 py-4">
            <p className="text-[9px] font-mono tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark mb-1">{label}</p>
            <p className="font-quicksand font-black text-lg text-text-light dark:text-text-dark leading-snug">{value}</p>
          </div>
        ))}
      </div>

      {credentials && <CredentialsSection email={credentials.email} password={credentials.password} />}

      {/* Actions */}
      <div className="flex items-center gap-2 px-4 py-3 mt-auto">
        {onAction && actionLabel && (
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAction}
            aria-label={`${actionLabel} for ${name}`}
            className="flex items-center gap-2 px-3 py-2 text-[9px] font-mono tracking-[0.2em] uppercase border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:border-primary-light/40 dark:hover:border-primary-dark/40 hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            <RefreshCw size={11} aria-hidden="true" />
            {actionLabel}
          </motion.button>
        )}

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${name} dashboard (opens in new tab)`}
          className="flex items-center gap-2 px-3 py-2 text-[9px] font-mono tracking-[0.2em] uppercase border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:border-primary-light/40 dark:hover:border-primary-dark/40 hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
        >
          <ExternalLink size={11} aria-hidden="true" />
          Open Dashboard
        </a>
      </div>
    </motion.article>
  )
}

// ─── Stripe ───────────────────────────────────────────────────────────────────
export function StripeCard({ balance = '$0.00', transactions = '0' }: { balance?: string; transactions?: string }) {
  return (
    <IntegrationCard
      name="Stripe"
      label="Payments"
      description="Processes donations, store orders, and subscription billing."
      status="connected"
      icon={CreditCard}
      iconBg="bg-violet-500/10"
      iconColor="text-violet-500 dark:text-violet-400"
      href="https://dashboard.stripe.com"
      stats={[
        { label: 'Balance', value: balance },
        { label: 'Transactions', value: transactions }
      ]}
      credentials={{ email: 'hello@littlepaws.org', password: 'your-password-here' }}
    />
  )
}

// ─── Firebase ─────────────────────────────────────────────────────────────────
export function FirebaseCard({ files = '0', storage = '0 MB' }: { files?: string; storage?: string }) {
  return (
    <IntegrationCard
      name="Firebase"
      label="Storage"
      description="Stores uploaded images for dogs, products, and auction items."
      status="connected"
      icon={Flame}
      iconBg="bg-orange-500/10"
      iconColor="text-orange-500 dark:text-orange-400"
      href="https://console.firebase.google.com"
      stats={[
        { label: 'Files', value: files },
        { label: 'Storage Used', value: storage }
      ]}
      credentials={{ email: 'hello@littlepaws.org', password: 'your-password-here' }}
    />
  )
}

// ─── Vercel ───────────────────────────────────────────────────────────────────
export function VercelCard({ deployments = '0', lastDeploy = '—' }: { deployments?: string; lastDeploy?: string }) {
  return (
    <IntegrationCard
      name="Vercel"
      label="Hosting"
      description="Hosts and deploys the Little Paws web application."
      status="connected"
      icon={Triangle}
      iconBg="bg-surface-light dark:bg-surface-dark"
      iconColor="text-text-light dark:text-text-dark"
      href="https://vercel.com/dashboard"
      stats={[
        { label: 'Deployments', value: deployments },
        { label: 'Last Deploy', value: lastDeploy }
      ]}
    />
  )
}

// ─── Railway ──────────────────────────────────────────────────────────────────
export function RailwayCard({ uptime = '—', region = 'us-east' }: { uptime?: string; region?: string }) {
  return (
    <IntegrationCard
      name="Railway"
      label="Database"
      description="Hosts the PostgreSQL database for all application data."
      status="connected"
      icon={Train}
      iconBg="bg-primary-light/10 dark:bg-primary-dark/10"
      iconColor="text-primary-light dark:text-primary-dark"
      href="https://railway.app/dashboard"
      stats={[
        { label: 'Uptime', value: uptime },
        { label: 'Region', value: region }
      ]}
    />
  )
}

// ─── Pusher ───────────────────────────────────────────────────────────────────
export function PusherCard({ channels = '0', messages = '0' }: { channels?: string; messages?: string }) {
  return (
    <IntegrationCard
      name="Pusher"
      label="Real-time"
      description="Powers real-time bidding and live updates across the auction system."
      status="connected"
      icon={Zap}
      iconBg="bg-emerald-500/10"
      iconColor="text-emerald-500 dark:text-emerald-400"
      href="https://dashboard.pusher.com"
      stats={[
        { label: 'Channels', value: channels },
        { label: 'Messages', value: messages }
      ]}
      credentials={{ email: 'hello@littlepaws.org', password: 'your-password-here' }}
    />
  )
}

// ─── Resend ───────────────────────────────────────────────────────────────────
export function ResendCard({ sent = '0', lastSent = '—' }: { sent?: string; lastSent?: string }) {
  return (
    <IntegrationCard
      name="Resend"
      label="Email"
      description="Sends magic link auth, donation receipts, and newsletter emails."
      status="connected"
      icon={Mail}
      iconBg="bg-blue-500/10"
      iconColor="text-blue-500 dark:text-blue-400"
      href="https://resend.com/overview"
      stats={[
        { label: 'Emails Sent', value: sent },
        { label: 'Last Sent', value: lastSent }
      ]}
      credentials={{ email: 'hello@littlepaws.org', password: 'your-password-here' }}
    />
  )
}

// ─── Google Analytics ─────────────────────────────────────────────────────────
export function GoogleAnalyticsCard({ visitors = '0', pageViews = '0' }: { visitors?: string; pageViews?: string }) {
  return (
    <IntegrationCard
      name="Google Analytics"
      label="Analytics"
      description="Tracks visitor traffic, page views, and user behavior across the site."
      status="connected"
      icon={BarChart2}
      iconBg="bg-yellow-500/10"
      iconColor="text-yellow-500 dark:text-yellow-400"
      href="https://analytics.google.com"
      stats={[
        { label: 'Visitors', value: visitors },
        { label: 'Page Views', value: pageViews }
      ]}
      credentials={{ email: 'hello@littlepaws.org', password: 'your-password-here' }}
    />
  )
}
