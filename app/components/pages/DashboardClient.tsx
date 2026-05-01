'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Plus, Search, ArrowRight } from 'lucide-react'

interface DashCardProps {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  delay?: number
  noPad?: boolean
}

export function DashCard({ title, action, children, className = '', delay = 0, noPad = false }: DashCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className={`bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-border-light dark:border-border-dark flex-wrap">
        <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light dark:text-text-dark">{title}</h2>
        {action && <div className="flex items-center gap-2 flex-wrap">{action}</div>}
      </div>

      {/* Body */}
      <div className={`flex-1 ${noPad ? '' : 'p-5'}`}>{children}</div>
    </motion.div>
  )
}

interface StatCardProps {
  label: string
  value: string
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
  accentColor?: string
  delay?: number
}

export function StatCard({ label, value, sub, trend, accentColor = 'bg-primary-light dark:bg-primary-dark', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative overflow-hidden bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark p-4"
    >
      {/* Left accent bar */}
      <div className={`absolute top-0 left-0 w-0.75 h-full ${accentColor}`} aria-hidden="true" />

      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-2 pl-1">{label}</p>
      <p className="font-quicksand font-black text-[28px] leading-none text-text-light dark:text-text-dark pl-1">{value}</p>
      {sub && (
        <p
          className={`font-mono text-[10px] tracking-[0.12em] mt-1.5 pl-1 ${
            trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-light dark:text-muted-dark'
          }`}
        >
          {sub}
        </p>
      )}
    </motion.div>
  )
}

export interface Column<T> {
  key: keyof T | string
  label: string
  render?: (row: T) => React.ReactNode
  mono?: boolean
  muted?: boolean
}

export function DataTable<T extends Record<string, unknown>>({ columns, rows, keyField }: any) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border-collapse text-xs min-w-120">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="text-left font-mono text-[9px] tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark px-3 py-2 border-b border-border-light dark:border-border-dark whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <motion.tr
              key={String(row[keyField])}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className="group border-b border-border-light dark:border-border-dark last:border-0 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`px-3 py-2.5 align-middle ${
                    col.mono ? 'font-mono text-[10px] tracking-[0.05em]' : 'font-nunito'
                  } ${col.muted ? 'text-muted-light dark:text-muted-dark' : 'text-text-light dark:text-text-dark'}`}
                >
                  {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '')}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export interface ActivityItem {
  id: string
  text: React.ReactNode
  time: string
  type: 'success' | 'info' | 'warn' | 'danger' | 'muted'
}

const dotColor: Record<ActivityItem['type'], string> = {
  success: 'bg-green-500',
  info: 'bg-primary-light dark:bg-primary-dark',
  warn: 'bg-amber-500',
  danger: 'bg-red-500',
  muted: 'bg-muted-light dark:bg-muted-dark'
}

interface ActivityFeedProps {
  items: ActivityItem[]
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <ul className="flex flex-col divide-y divide-border-light dark:divide-border-dark" role="list">
      {items.map((item, i) => (
        <motion.li
          key={item.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.06 }}
          className="flex items-start gap-3 py-2.5"
        >
          <span className={`mt-1.25 w-2 h-2 shrink-0 ${dotColor[item.type]}`} aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-xs font-nunito text-text-light dark:text-text-dark leading-snug">{item.text}</p>
            <p className="font-mono text-[10px] tracking-widest text-muted-light dark:text-muted-dark mt-0.5">{item.time}</p>
          </div>
        </motion.li>
      ))}
    </ul>
  )
}

interface FilterChipsProps {
  options: string[]
  onChange?: (active: string) => void
}

export function FilterChips({ options, onChange }: FilterChipsProps) {
  const [active, setActive] = useState(options[0])

  function select(opt: string) {
    setActive(opt)
    onChange?.(opt)
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => select(opt)}
          className={`px-3 py-1 font-mono text-[9px] tracking-[0.15em] uppercase border transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark ${
            active === opt
              ? 'border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark bg-primary-light/5 dark:bg-primary-dark/5'
              : 'border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (v: string) => void
  actions?: React.ReactNode
}

export function SearchBar({ placeholder = 'Search...', value, onChange, actions }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="relative flex-1">
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full pl-8 pr-3 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark font-nunito text-xs focus:outline-none focus:border-primary-light dark:focus:border-primary-dark transition-colors"
        />
      </div>
      {actions}
    </div>
  )
}

interface MiniBarProps {
  label: string
  sublabel?: string
  pct: number
  color?: string
}

export function MiniBar({ label, sublabel, pct, color = 'bg-primary-light dark:bg-primary-dark' }: MiniBarProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="font-mono text-[10px] tracking-widest uppercase text-text-light dark:text-text-dark">{label}</span>
        <span className="font-mono text-[10px] tracking-widest text-muted-light dark:text-muted-dark">{sublabel ?? `${pct}%`}</span>
      </div>
      <div className="h-0.75 bg-border-light dark:bg-border-dark w-full overflow-hidden">
        <motion.div
          className={`h-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

interface DetailRowProps {
  label: string
  children: React.ReactNode
}

export function DetailRow({ label, children }: DetailRowProps) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-2 py-2 border-b border-border-light dark:border-border-dark last:border-0 items-center">
      <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">{label}</span>
      <span className="text-xs text-text-light dark:text-text-dark font-nunito">{children}</span>
    </div>
  )
}

interface BadgeProps {
  variant?: 'success' | 'warn' | 'danger' | 'info' | 'muted'
  children: React.ReactNode
}

const variantClasses: Record<string, string> = {
  success: 'bg-green-500/10 text-green-500',
  warn: 'bg-amber-500/10 text-amber-500',
  danger: 'bg-red-500/10 text-red-500',
  info: 'bg-primary-light/10 text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark',
  muted: 'bg-surface-light dark:bg-surface-dark text-muted-light dark:text-muted-dark'
}

export function Badge({ variant = 'muted', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 font-mono text-[9px] tracking-widest uppercase ${variantClasses[variant]}`}>
      {children}
    </span>
  )
}

export interface UserRecord {
  id: string
  initials: string
  name: string
  email: string
  phone?: string
  tier: 'Free' | 'Comfort' | 'Legacy'
  verified: boolean
  status: 'Active' | 'Suspended' | 'Unverified'
  joined: string
  lastLogin: string
  role: string
  avatarColor?: string
  orderCount?: string
}

const tierVariant: Record<string, 'info' | 'muted'> = {
  Legacy: 'info',
  Comfort: 'muted',
  Free: 'muted'
}

const statusVariant: Record<string, 'success' | 'danger' | 'warn'> = {
  Active: 'success',
  Suspended: 'danger',
  Unverified: 'warn'
}

interface UserRecordProps {
  user: UserRecord
  onResetPassword?: () => void
  onSendEmail?: () => void
  onSuspend?: () => void
}

export function UserRecord({ user, onResetPassword, onSendEmail, onSuspend }: UserRecordProps) {
  return (
    <div>
      {/* Avatar row */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border-light dark:border-border-dark">
        <div
          className="w-11 h-11 flex items-center justify-center font-mono text-[11px] font-bold text-white shrink-0"
          style={{ backgroundColor: user.avatarColor ?? 'var(--color-primary-light)' }}
          aria-hidden="true"
        >
          {user.initials}
        </div>
        <div>
          <p className="font-quicksand font-bold text-[15px] text-text-light dark:text-text-dark leading-tight">{user.name}</p>
          <p className="font-mono text-[10px] tracking-widest text-muted-light dark:text-muted-dark">{user.id}</p>
        </div>
      </div>

      <DetailRow label="Email">{user.email}</DetailRow>
      {user.phone && <DetailRow label="Phone">{user.phone}</DetailRow>}
      <DetailRow label="Tier">
        <Badge variant={tierVariant[user.tier]}>{user.tier}</Badge>
      </DetailRow>
      <DetailRow label="Verified">
        <Badge variant={user.verified ? 'success' : 'warn'}>{user.verified ? 'Yes' : 'No'}</Badge>
      </DetailRow>
      <DetailRow label="Status">
        <Badge variant={statusVariant[user.status]}>{user.status}</Badge>
      </DetailRow>
      <DetailRow label="Joined">{user.joined}</DetailRow>
      <DetailRow label="Last Login">{user.lastLogin}</DetailRow>
      <DetailRow label="Role">{user.role}</DetailRow>

      <div className="flex gap-2 flex-wrap mt-4 pt-4 border-t border-border-light dark:border-border-dark">
        <button
          onClick={onResetPassword}
          className="px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] uppercase border border-border-light dark:border-border-dark text-text-light dark:text-text-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
        >
          Reset PW
        </button>
        <button
          onClick={onSendEmail}
          className="px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] uppercase border border-border-light dark:border-border-dark text-text-light dark:text-text-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
        >
          Send Email
        </button>
        <button
          onClick={onSuspend}
          className="px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] uppercase bg-red-500 text-white hover:bg-red-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          Suspend
        </button>
      </div>
    </div>
  )
}

export interface OrderItem {
  id: string
  name: string
  qty: number
  unitPrice: number
}

export interface Order {
  id: string
  user: string
  stripePI: string
  createdAt: string
  subtotal: number
  tax: number
  shipping: number
  total: number
  shipTo: string
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded'
  items: OrderItem[]
}

interface OrderDetailProps {
  order: Order
  onRefund?: () => void
  onResendReceipt?: () => void
  onMarkShipped?: () => void
}

export function OrderDetail({ order, onRefund, onResendReceipt, onMarkShipped }: OrderDetailProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border-light dark:border-border-dark">
        <span className="font-mono text-[11px] tracking-widest text-text-light dark:text-text-dark">{order.id}</span>
        <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
      </div>

      <DetailRow label="User">{order.user}</DetailRow>
      <DetailRow label="Created">{order.createdAt}</DetailRow>
      <DetailRow label="Stripe PI">
        <span className="font-mono text-[10px] tracking-[0.05em] text-muted-light dark:text-muted-dark">{order.stripePI}</span>
      </DetailRow>
      <DetailRow label="Subtotal">${order.subtotal.toFixed(2)}</DetailRow>
      <DetailRow label="Tax">${order.tax.toFixed(2)}</DetailRow>
      <DetailRow label="Shipping">${order.shipping.toFixed(2)}</DetailRow>
      <DetailRow label="Total">
        <span className="font-bold">${order.total.toFixed(2)}</span>
      </DetailRow>
      <DetailRow label="Ship To">{order.shipTo}</DetailRow>

      {/* Line items */}
      <div className="mt-4 pt-3 border-t border-border-light dark:border-border-dark">
        <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark mb-3">Line Items</p>
        <div className="flex flex-col divide-y divide-border-light dark:divide-border-dark">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-1.5 text-xs font-nunito">
              <span className="text-text-light dark:text-text-dark">{item.name}</span>
              <span className="text-muted-light dark:text-muted-dark font-mono text-[10px]">
                ×{item.qty} — ${(item.qty * item.unitPrice).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mt-4 pt-3 border-t border-border-light dark:border-border-dark">
        <button
          onClick={onRefund}
          className="px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] uppercase border border-border-light dark:border-border-dark text-text-light dark:text-text-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
        >
          Issue Refund
        </button>
        <button
          onClick={onResendReceipt}
          className="px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] uppercase border border-border-light dark:border-border-dark text-text-light dark:text-text-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
        >
          Resend Receipt
        </button>
        <button
          onClick={onMarkShipped}
          className="px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] uppercase border border-border-light dark:border-border-dark text-text-light dark:text-text-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
        >
          Mark Shipped
        </button>
      </div>
    </div>
  )
}

export interface LogEntry {
  id: string
  ts: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'CRON'
  message: string
}

const levelColor: Record<LogEntry['level'], string> = {
  INFO: 'text-primary-light dark:text-primary-dark',
  WARN: 'text-amber-500',
  ERROR: 'text-red-500',
  CRON: 'text-muted-light dark:text-muted-dark'
}

interface LogStreamProps {
  entries: LogEntry[]
}

export function LogStream({ entries }: LogStreamProps) {
  return (
    <div className="flex flex-col divide-y divide-border-light dark:divide-border-dark">
      {entries.map((entry, i) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: i * 0.03 }}
          className="flex flex-wrap gap-x-3 py-1.5 font-mono text-[10px] tracking-[0.05em]"
        >
          <span className="text-muted-light dark:text-muted-dark shrink-0 whitespace-nowrap">{entry.ts}</span>
          <span className={`shrink-0 min-w-10.5 ${levelColor[entry.level]}`}>{entry.level}</span>
          <span className="text-text-light dark:text-text-dark break-all">{entry.message}</span>
        </motion.div>
      ))}
    </div>
  )
}

export interface QuickAction {
  label: string
  onClick?: () => void
  href?: string
  variant?: 'default' | 'danger'
}

interface QuickActionsProps {
  actions: QuickAction[]
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {actions.map((action, i) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: i * 0.04 }}
          onClick={action.onClick}
          className={`group w-full flex items-center justify-between px-3 py-2.5 font-mono text-[10px] tracking-[0.15em] uppercase border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light ${
            action.variant === 'danger'
              ? 'border-red-500/30 text-red-500 hover:bg-red-500/5'
              : 'border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark'
          }`}
        >
          {action.label}
          <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
        </motion.button>
      ))}
    </div>
  )
}

interface SectionLabelProps {
  children: React.ReactNode
  delay?: number
}

export function SectionLabel({ children, delay = 0 }: SectionLabelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay }}
      className="col-span-full flex items-center gap-4 pt-2"
    >
      <div className="w-1 h-4 bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">{children}</span>
      <div className="flex-1 h-px bg-border-light dark:bg-border-dark" aria-hidden="true" />
    </motion.div>
  )
}

/* ─────────────────────────── mock data ─────────────────────────── */

const USERS: UserRecord[] = [
  {
    id: 'uid_9f2a8c4d',
    initials: 'SM',
    name: 'Sarah Mills',
    email: 'sarah@email.com',
    phone: '(617) 555-0142',
    tier: 'Legacy',
    verified: true,
    status: 'Active',
    joined: 'Jan 4, 2025',
    lastLogin: 'Apr 14, 2026',
    role: 'Member',
    avatarColor: '#0891b2'
  },
  {
    id: 'uid_3b1e7a2f',
    initials: 'TB',
    name: 'Tom Bauer',
    email: 'tom@email.com',
    tier: 'Comfort',
    verified: true,
    status: 'Active',
    joined: 'Mar 18, 2025',
    lastLogin: 'Apr 12, 2026',
    role: 'Member',
    avatarColor: '#f59e0b'
  },
  {
    id: 'uid_5c8d9e1a',
    initials: 'CJ',
    name: 'Carol Jones',
    email: 'carol@email.com',
    tier: 'Free',
    verified: false,
    status: 'Unverified',
    joined: 'Jun 2, 2025',
    lastLogin: 'Apr 10, 2026',
    role: 'Member',
    avatarColor: '#a78bfa'
  },
  {
    id: 'uid_2a4f6c8b',
    initials: 'MR',
    name: 'Mike Reed',
    email: 'mike@email.com',
    tier: 'Legacy',
    verified: true,
    status: 'Active',
    joined: 'Feb 11, 2025',
    lastLogin: 'Apr 14, 2026',
    role: 'Member',
    avatarColor: '#22c55e'
  },
  {
    id: 'uid_dk88',
    initials: 'DK',
    name: 'Dana Kim',
    email: 'dana@email.com',
    tier: 'Comfort',
    verified: true,
    status: 'Suspended',
    joined: 'Apr 30, 2025',
    lastLogin: 'Apr 1, 2026',
    role: 'Member',
    avatarColor: '#f472b6'
  }
]

type OrderRow = { id: string; user: string; items: number; total: string; method: string; status: string; date: string }
const ORDER_ROWS: OrderRow[] = [
  { id: '#ORD-1041', user: 'Sarah Mills', items: 3, total: '$48.00', method: 'Visa ••4242', status: 'Paid', date: 'Apr 14' },
  { id: '#ORD-1040', user: 'Tom Bauer', items: 1, total: '$120.00', method: 'MC ••5588', status: 'Pending', date: 'Apr 14' },
  { id: '#ORD-1039', user: 'Carol Jones', items: 2, total: '$35.00', method: 'Visa ••9012', status: 'Paid', date: 'Apr 13' },
  { id: '#ORD-1038', user: 'Mike Reed', items: 4, total: '$85.00', method: 'Amex ••1009', status: 'Failed', date: 'Apr 13' },
  { id: '#ORD-1037', user: 'Dana Kim', items: 1, total: '$22.00', method: 'Visa ••7734', status: 'Refunded', date: 'Apr 12' }
]

type ItemRow = { id: string; orderId: string; product: string; sku: string; qty: number; unit: string; subtotal: string }
const ITEM_ROWS: ItemRow[] = [
  { id: 'item_001', orderId: '#ORD-1041', product: 'LPDR Tote Bag', sku: 'TOTE-BLK', qty: 1, unit: '$18.00', subtotal: '$18.00' },
  { id: 'item_002', orderId: '#ORD-1041', product: 'Dachshund Enamel Pin', sku: 'PIN-DACH', qty: 2, unit: '$12.00', subtotal: '$24.00' },
  { id: 'item_003', orderId: '#ORD-1041', product: 'Donation — General', sku: 'DON-GEN', qty: 1, unit: '$6.00', subtotal: '$6.00' },
  { id: 'item_004', orderId: '#ORD-1040', product: 'Ecard Bundle × 5', sku: 'ECARD-5', qty: 1, unit: '$120.00', subtotal: '$120.00' },
  { id: 'item_005', orderId: '#ORD-1039', product: 'Welcome Wiener Pack', sku: 'WW-PKG', qty: 1, unit: '$35.00', subtotal: '$35.00' }
]

type PaymentRow = { id: string; user: string; amount: string; type: string; status: string; date: string }
const PAYMENT_ROWS: PaymentRow[] = [
  { id: 'pi_3RF001', user: 'Sarah M.', amount: '$48.00', type: 'Order', status: 'Succeeded', date: 'Apr 14' },
  { id: 'pi_3RF002', user: 'Mike R.', amount: '$25.00', type: 'Subscription', status: 'Succeeded', date: 'Apr 14' },
  { id: 'pi_3RF003', user: 'Tom B.', amount: '$120.00', type: 'Order', status: 'Processing', date: 'Apr 14' },
  { id: 'pi_3RF004', user: 'Mike R.', amount: '$85.00', type: 'Order', status: 'Failed', date: 'Apr 13' },
  { id: 'pi_3RF005', user: 'Dana K.', amount: '$22.00', type: 'Order', status: 'Refunded', date: 'Apr 12' }
]

type AddressRow = { id: string; user: string; line1: string; city: string; state: string; zip: string; isDefault: boolean }
const ADDRESS_ROWS: AddressRow[] = [
  { id: 'addr_1a2b', user: 'Sarah Mills', line1: '14 Maple St', city: 'Swampscott', state: 'MA', zip: '01907', isDefault: true },
  { id: 'addr_3c4d', user: 'Tom Bauer', line1: '88 Oak Ave, Apt 2B', city: 'Lynn', state: 'MA', zip: '01902', isDefault: false },
  { id: 'addr_5e6f', user: 'Mike Reed', line1: '200 Harbor Rd', city: 'Salem', state: 'MA', zip: '01970', isDefault: true },
  { id: 'addr_7g8h', user: 'Carol Jones', line1: '44 Elm St, Unit 5', city: 'Boston', state: 'MA', zip: '02101', isDefault: true }
]

type PMRow = { id: string; user: string; brand: string; last4: string; expires: string; stripeId: string; isDefault: boolean }
const PM_ROWS: PMRow[] = [
  { id: 'pm_aa1b', user: 'Sarah M.', brand: 'Visa', last4: '4242', expires: '12/27', stripeId: 'pm_1Abc...', isDefault: true },
  { id: 'pm_cc3d', user: 'Sarah M.', brand: 'Amex', last4: '1009', expires: '08/26', stripeId: 'pm_2Xyz...', isDefault: false },
  { id: 'pm_ee5f', user: 'Tom B.', brand: 'Mastercard', last4: '5588', expires: '03/28', stripeId: 'pm_3Def...', isDefault: true },
  { id: 'pm_gg7h', user: 'Dana K.', brand: 'Visa', last4: '7734', expires: '01/27', stripeId: 'pm_4Ghi...', isDefault: true }
]

const ACTIVITY: ActivityItem[] = [
  {
    id: '1',
    text: (
      <>
        <strong>sarah@email.com</strong> registered
      </>
    ),
    time: '2 min ago',
    type: 'success'
  },
  { id: '2', text: 'Order #ORD-1041 paid — $48.00', time: '14 min ago', type: 'info' },
  { id: '3', text: 'Auction "Rosie" ending in 2 hrs', time: '1 hr ago', type: 'warn' },
  { id: '4', text: 'Payment failed — #ORD-1038 card_declined', time: '3 hr ago', type: 'danger' },
  { id: '5', text: 'Subscription upgraded — Legacy tier', time: '5 hr ago', type: 'success' },
  { id: '6', text: 'Newsletter sent — 1,284 subscribers', time: '7 hr ago', type: 'info' }
]

const LOGS: LogEntry[] = [
  { id: 'l1', ts: '2026-04-15 09:44:02', level: 'INFO', message: 'User uid_9f2a8c4d logged in — sarah@email.com' },
  { id: 'l2', ts: '2026-04-15 09:41:18', level: 'INFO', message: 'Stripe webhook — payment_intent.succeeded pi_3RF001' },
  { id: 'l3', ts: '2026-04-15 09:41:17', level: 'INFO', message: 'Order #ORD-1041 marked PAID — $48.00' },
  { id: 'l4', ts: '2026-04-15 09:38:04', level: 'WARN', message: 'Auction "Rosie" ending < 2 hours — 3 active bidders' },
  { id: 'l5', ts: '2026-04-15 09:30:00', level: 'CRON', message: 'auto-end auction check — 0 auctions ended' },
  { id: 'l6', ts: '2026-04-15 08:55:12', level: 'ERROR', message: 'payment_intent.payment_failed pi_3RF004 — card_declined' },
  { id: 'l7', ts: '2026-04-15 08:55:11', level: 'ERROR', message: 'Order #ORD-1038 payment failed — notifying mike@email.com' },
  { id: 'l8', ts: '2026-04-15 08:00:00', level: 'CRON', message: 'auto-start auction check — 1 auction started' },
  { id: 'l9', ts: '2026-04-14 22:10:44', level: 'INFO', message: 'Newsletter sent — 1,284 subscribers — 0 errors' },
  { id: 'l10', ts: '2026-04-14 18:33:01', level: 'WARN', message: 'Subscription renewal retry — uid_dk88 — attempt 2/3' }
]

const SELECTED_ORDER: Order = {
  id: '#ORD-1041',
  user: 'Sarah Mills',
  stripePI: 'pi_3RFabc12xyz...',
  createdAt: 'Apr 14, 2026 — 9:22 AM',
  subtotal: 42,
  tax: 3.57,
  shipping: 2.43,
  total: 48,
  shipTo: '14 Maple St, Swampscott MA 01907',
  status: 'Paid',
  items: [
    { id: 'i1', name: 'LPDR Tote Bag', qty: 1, unitPrice: 18 },
    { id: 'i2', name: 'Enamel Pin', qty: 2, unitPrice: 12 },
    { id: 'i3', name: 'Donation', qty: 1, unitPrice: 6 }
  ]
}

/* ─────────────────────────── column defs ─────────────────────────── */

const statusBadge = (status: string) => {
  const map: Record<string, 'success' | 'warn' | 'danger' | 'muted' | 'info'> = {
    Active: 'success',
    Paid: 'success',
    Succeeded: 'success',
    Pending: 'warn',
    Unverified: 'warn',
    Processing: 'warn',
    Failed: 'danger',
    Suspended: 'danger',
    Refunded: 'muted',
    Free: 'muted',
    Legacy: 'info',
    Subscription: 'info'
  }
  return <Badge variant={map[status] ?? 'muted'}>{status}</Badge>
}

const USER_COLS: Column<UserRecord>[] = [
  {
    key: 'name',
    label: 'User',
    render: (u) => (
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 flex items-center justify-center font-mono text-[9px] font-bold text-white shrink-0"
          style={{ backgroundColor: u.avatarColor ?? '#0891b2' }}
        >
          {u.initials}
        </div>
        {u.name}
      </div>
    )
  },
  { key: 'email', label: 'Email', muted: true },
  { key: 'tier', label: 'Tier', render: (u) => <Badge variant={u.tier === 'Legacy' ? 'info' : 'muted'}>{u.tier}</Badge> },
  { key: 'joined', label: 'Joined', muted: true },
  { key: 'orderCount', label: 'Orders', render: (u) => String(u.orderCount ?? 0) },
  { key: 'status', label: 'Status', render: (u) => statusBadge(u.status) }
]

const ORDER_COLS: Column<OrderRow>[] = [
  { key: 'id', label: 'Order ID', mono: true },
  { key: 'user', label: 'User' },
  { key: 'items', label: 'Items' },
  { key: 'total', label: 'Total' },
  { key: 'method', label: 'Method', muted: true },
  { key: 'status', label: 'Status', render: (r) => statusBadge(r.status) },
  { key: 'date', label: 'Date', muted: true }
]

const ITEM_COLS: Column<ItemRow>[] = [
  { key: 'id', label: 'Item ID', mono: true, muted: true },
  { key: 'orderId', label: 'Order', mono: true },
  { key: 'product', label: 'Product' },
  { key: 'sku', label: 'SKU', mono: true, muted: true },
  { key: 'qty', label: 'Qty' },
  { key: 'unit', label: 'Unit Price' },
  { key: 'subtotal', label: 'Subtotal' }
]

const PAYMENT_COLS: Column<PaymentRow>[] = [
  { key: 'id', label: 'Stripe PI', mono: true, muted: true },
  { key: 'user', label: 'User' },
  { key: 'amount', label: 'Amount' },
  { key: 'type', label: 'Type', render: (r) => <Badge variant={r.type === 'Subscription' ? 'info' : 'muted'}>{r.type}</Badge> },
  { key: 'status', label: 'Status', render: (r) => statusBadge(r.status) },
  { key: 'date', label: 'Date', muted: true }
]

const ADDRESS_COLS: Column<AddressRow>[] = [
  { key: 'id', label: 'ID', mono: true, muted: true },
  { key: 'user', label: 'User' },
  { key: 'line1', label: 'Line 1' },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State' },
  { key: 'zip', label: 'ZIP', mono: true },
  { key: 'isDefault', label: 'Default', render: (r) => <Badge variant={r.isDefault ? 'success' : 'muted'}>{r.isDefault ? 'Yes' : 'No'}</Badge> }
]

const PM_COLS: Column<PMRow>[] = [
  { key: 'id', label: 'ID', mono: true, muted: true },
  { key: 'user', label: 'User' },
  { key: 'brand', label: 'Brand' },
  { key: 'last4', label: 'Last 4', mono: true },
  { key: 'expires', label: 'Expires', mono: true },
  { key: 'stripeId', label: 'Stripe PM', mono: true, muted: true },
  { key: 'isDefault', label: 'Default', render: (r) => <Badge variant={r.isDefault ? 'success' : 'muted'}>{r.isDefault ? 'Yes' : 'No'}</Badge> }
]

/* ─────────────────────────── helpers ─────────────────────────── */

function Btn({ children, onClick, variant = 'ghost' }: { children: React.ReactNode; onClick?: () => void; variant?: 'ghost' | 'primary' }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-2 font-mono text-[10px] tracking-[0.15em] uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark ${
        variant === 'primary'
          ? 'bg-primary-light dark:bg-primary-dark text-white hover:bg-secondary-light dark:hover:bg-secondary-dark'
          : 'border border-border-light dark:border-border-dark text-text-light dark:text-text-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark'
      }`}
    >
      {children}
    </button>
  )
}

/* ─────────────────────────── page ─────────────────────────── */

export default function DashboardClient() {
  const [refreshing, setRefreshing] = useState(false)

  function handleRefresh() {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1200)
  }

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      {/* ── Topbar ── */}
      <header className="sticky top-0 z-50 bg-bg-light dark:bg-bg-dark border-b border-border-light dark:border-border-dark px-4 xs:px-6 py-3.5 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-light dark:bg-primary-dark flex items-center justify-center text-sm shrink-0" aria-hidden="true">
            🐾
          </div>
          <div>
            <p className="font-quicksand font-bold text-[14px] text-text-light dark:text-text-dark leading-tight">Little Paws Dachshund Rescue</p>
            <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark">Super Admin Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Btn onClick={handleRefresh}>
            <RefreshCw size={11} className={refreshing ? 'animate-spin' : ''} aria-hidden="true" />
            Refresh
          </Btn>
          <Btn variant="primary">
            <Plus size={11} aria-hidden="true" />
            Add Record
          </Btn>
        </div>
      </header>

      {/* ── Grid ── */}
      <main id="main-content" className="p-4 xs:p-5 sm:p-6 grid grid-cols-12 gap-4">
        {/* ── Overview stats ── */}
        <SectionLabel delay={0.05}>Overview</SectionLabel>

        <div className="col-span-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="Total Users"
            value="1,284"
            sub="↑ 12% vs last month"
            trend="up"
            accentColor="bg-primary-light dark:bg-primary-dark"
            delay={0.08}
          />
          <StatCard label="Revenue MTD" value="$18,420" sub="↑ 8% vs last month" trend="up" accentColor="bg-green-500" delay={0.12} />
          <StatCard label="Open Orders" value="47" sub="↑ 3 since yesterday" trend="down" accentColor="bg-amber-500" delay={0.16} />
          <StatCard label="Active Auctions" value="6" sub="2 ending today" accentColor="bg-violet-400" delay={0.2} />
          <StatCard label="Subscriptions" value="636" sub="412 Comfort · 224 Legacy" accentColor="bg-pink-400" delay={0.24} />
          <StatCard label="Failed Payments" value="6" sub="$1,240 at risk" trend="down" accentColor="bg-red-500" delay={0.28} />
          <StatCard label="Total Orders" value="342" sub="289 paid · 47 pending" accentColor="bg-primary-light dark:bg-primary-dark" delay={0.32} />
          <StatCard label="All-Time Revenue" value="$84,210" sub="Since Jan 2024" trend="up" accentColor="bg-green-500" delay={0.36} />
        </div>

        {/* ── Users & Activity ── */}
        <SectionLabel delay={0.1}>Users & Activity</SectionLabel>

        {/* Users table */}
        <DashCard
          title="Users"
          className="col-span-12 lg:col-span-8"
          delay={0.14}
          noPad
          action={
            <>
              <FilterChips options={['All', 'Free', 'Comfort', 'Legacy', 'Suspended']} />
              <Btn>Export</Btn>
            </>
          }
        >
          <div className="p-4">
            <SearchBar placeholder="Search name, email, ID..." />
          </div>
          <DataTable columns={USER_COLS} rows={USERS} keyField="id" />
        </DashCard>

        {/* Activity feed */}
        <DashCard title="Live Activity" className="col-span-12 lg:col-span-4" delay={0.18}>
          <ActivityFeed items={ACTIVITY} />
        </DashCard>

        {/* User record */}
        <DashCard title="User Record" className="col-span-12 sm:col-span-6 lg:col-span-4" delay={0.22} action={<Btn>Edit</Btn>}>
          <UserRecord
            user={USERS[0]}
            onResetPassword={() => alert('Reset password')}
            onSendEmail={() => alert('Send email')}
            onSuspend={() => alert('Suspend user')}
          />
        </DashCard>

        {/* Linked data */}
        <DashCard title="Linked Data — Sarah Mills" className="col-span-12 sm:col-span-6 lg:col-span-4" delay={0.26}>
          {[
            { label: 'Orders', value: '12', badge: <Badge variant="success">$842 total</Badge> },
            { label: 'Payment Methods', value: '2' },
            { label: 'Saved Addresses', value: '1' },
            { label: 'Auction Bids', value: '7' }
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between px-3 py-2.5 bg-surface-light dark:bg-surface-dark mb-1.5 last:mb-0">
              <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-text-light dark:text-text-dark">{row.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-quicksand font-bold text-xl text-text-light dark:text-text-dark">{row.value}</span>
                {row.badge}
              </div>
            </div>
          ))}
          <div className="mt-4 pt-3 border-t border-border-light dark:border-border-dark">
            <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark mb-2.5">Payment Methods</p>
            {[
              { label: 'Visa ••4242 — exp 12/27', isDefault: true },
              { label: 'Amex ••1009 — exp 08/26', isDefault: false }
            ].map((pm) => (
              <div
                key={pm.label}
                className="flex items-center justify-between px-3 py-2 bg-surface-light dark:bg-surface-dark mb-1.5 last:mb-0 text-xs font-nunito text-text-light dark:text-text-dark"
              >
                {pm.label}
                <Badge variant={pm.isDefault ? 'success' : 'muted'}>{pm.isDefault ? 'Default' : 'Backup'}</Badge>
              </div>
            ))}
          </div>
        </DashCard>

        {/* Breakdown bars */}
        <DashCard title="Subscription & Fulfillment" className="col-span-12 sm:col-span-6 lg:col-span-4" delay={0.3}>
          <div className="flex flex-col gap-4 mb-6">
            <MiniBar label="Free" sublabel="648 users — 50%" pct={50} color="bg-muted-light dark:bg-muted-dark" />
            <MiniBar label="Comfort $10/mo" sublabel="412 users — 32%" pct={32} />
            <MiniBar label="Legacy $25/mo" sublabel="224 users — 17%" pct={17} color="bg-secondary-light dark:bg-secondary-dark" />
          </div>
          <div className="pt-4 border-t border-border-light dark:border-border-dark">
            <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark mb-4">Order Fulfillment</p>
            <div className="flex flex-col gap-4">
              <MiniBar label="Paid" sublabel="289 — 84%" pct={84} color="bg-green-500" />
              <MiniBar label="Pending" sublabel="47 — 14%" pct={14} color="bg-amber-500" />
              <MiniBar label="Failed" sublabel="6 — 2%" pct={2} color="bg-red-500" />
            </div>
          </div>
        </DashCard>

        {/* ── Orders & Payments ── */}
        <SectionLabel delay={0.1}>Orders & Payments</SectionLabel>

        {/* Orders table */}
        <DashCard
          title="Orders"
          className="col-span-12 lg:col-span-8"
          delay={0.14}
          noPad
          action={
            <>
              <FilterChips options={['All', 'Paid', 'Pending', 'Failed', 'Refunded']} />
              <Btn>Export CSV</Btn>
            </>
          }
        >
          <div className="p-4">
            <SearchBar placeholder="Search order ID, user, amount..." />
          </div>
          <DataTable columns={ORDER_COLS} rows={ORDER_ROWS} keyField="id" />
        </DashCard>

        {/* Order detail */}
        <DashCard title="Order Detail" className="col-span-12 lg:col-span-4" delay={0.18}>
          <OrderDetail
            order={SELECTED_ORDER}
            onRefund={() => alert('Issue refund')}
            onResendReceipt={() => alert('Resend receipt')}
            onMarkShipped={() => alert('Mark shipped')}
          />
        </DashCard>

        {/* Order items */}
        <DashCard title="Order Items" className="col-span-12 lg:col-span-6" delay={0.22} noPad>
          <DataTable columns={ITEM_COLS} rows={ITEM_ROWS} keyField="id" />
        </DashCard>

        {/* Payment transactions */}
        <DashCard title="Payment Transactions" className="col-span-12 lg:col-span-6" delay={0.26} noPad action={<Btn>Retry Failed</Btn>}>
          <DataTable columns={PAYMENT_COLS} rows={PAYMENT_ROWS} keyField="id" />
        </DashCard>

        {/* ── Addresses & Payment Methods ── */}
        <SectionLabel delay={0.1}>Addresses & Payment Methods</SectionLabel>

        <DashCard title="Addresses" className="col-span-12 lg:col-span-6" delay={0.14} noPad action={<Btn>+ Add</Btn>}>
          <div className="p-4">
            <SearchBar placeholder="Search addresses..." />
          </div>
          <DataTable columns={ADDRESS_COLS} rows={ADDRESS_ROWS} keyField="id" />
        </DashCard>

        <DashCard title="Payment Methods" className="col-span-12 lg:col-span-6" delay={0.18} noPad>
          <DataTable columns={PM_COLS} rows={PM_ROWS} keyField="id" />
        </DashCard>

        {/* ── Logs & Quick Actions ── */}
        <SectionLabel delay={0.1}>System Logs & Tools</SectionLabel>

        <DashCard
          title="System Logs"
          className="col-span-12 lg:col-span-8"
          delay={0.14}
          action={<FilterChips options={['All', 'Info', 'Warn', 'Error', 'Cron', 'Stripe']} />}
        >
          <LogStream entries={LOGS} />
        </DashCard>

        <DashCard title="Quick Actions" className="col-span-12 lg:col-span-4" delay={0.18}>
          <QuickActions
            actions={[
              { label: 'Export Orders CSV' },
              { label: 'Export Users CSV' },
              { label: 'Send Newsletter' },
              { label: 'Retry Failed Payments' },
              { label: 'Run Auction Auto-Start' },
              { label: 'Run Auction Auto-End' },
              { label: 'Flush Cache' },
              { label: 'Open Stripe Dashboard', href: 'https://dashboard.stripe.com' },
              { label: 'Suspend All Unverified', variant: 'danger' }
            ]}
          />
        </DashCard>
      </main>
    </div>
  )
}
