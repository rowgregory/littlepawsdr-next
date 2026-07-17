'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import {
  Mail,
  Phone,
  Shield,
  Clock,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Check,
  Package,
  ChevronRight,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { formatDate } from 'app/utils/_date.utils'
import { formatRole } from 'app/utils/_user.utils'
import AdminPageHeader from 'app/components/admin/_shared/AdminPageHeader'
import { StatusPill } from 'app/components/_primitives'
import { MergeUserSection } from 'app/components/admin/user/MergeUserSection'
import { updateUserRole } from 'app/lib/actions/admin/user/updateUserRole'
import { getUserById } from 'app/lib/actions/admin/user/getUserById'

type UserDetail = NonNullable<Awaited<ReturnType<typeof getUserById>>['data']>

const ASSIGNABLE_ROLES: Role[] = ['ADMIN', 'SUPPORTER']

function Field({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border-light dark:border-border-dark last:border-b-0">
      <Icon className="w-4 h-4 text-muted-light dark:text-muted-dark shrink-0 mt-0.5" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-0.5">
          {label}
        </p>
        <div className="text-sm text-text-light dark:text-text-dark wrap-break-word">{children}</div>
      </div>
    </div>
  )
}

type Props = {
  user: UserDetail
  migrationStatus: { hasPendingMigration: boolean; pendingCount: number } | null
}

export default function AdminUserDetailsClient({ user, migrationStatus }: Props) {
  const router = useRouter()

  const [role, setRole] = useState<Role>(user.role)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dirty = role !== user.role
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Unnamed user'
  const totalSpent = user.orders
    .filter((o) => o.status === 'CONFIRMED')
    .reduce((sum, o) => sum + Number(o.totalAmount), 0)

  async function handleSave() {
    if (!dirty || saving) return
    setSaving(true)
    setError(null)
    const result = await updateUserRole(user.id, role)
    setSaving(false)
    if (result.success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    } else {
      setError(result.error ?? 'Something went wrong')
      setRole(user.role)
    }
  }

  return (
    <main id="main-content" className="min-h-screen w-full bg-bg-light dark:bg-bg-dark">
      <AdminPageHeader
        title={fullName}
        breadcrumbs={[{ label: 'Users', href: '/admin/users' }]}
        action={
          migrationStatus?.hasPendingMigration ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/5 text-[9px] font-mono tracking-[0.15em] uppercase">
              <AlertCircle className="w-3 h-3" aria-hidden="true" />
              Migration pending ({migrationStatus.pendingCount})
            </span>
          ) : migrationStatus ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 text-[9px] font-mono tracking-[0.15em] uppercase">
              <CheckCircle className="w-3 h-3" aria-hidden="true" />
              History migrated
            </span>
          ) : null
        }
      />

      <div className="w-full px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6 items-start">
          {/* ── Left column ── */}
          <div className="space-y-6">
            {/* Identity */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 shrink-0 flex items-center justify-center bg-primary-light/10 dark:bg-primary-dark/10 font-quicksand font-black text-lg text-primary-light dark:text-primary-dark">
                  {(user.firstName?.[0] ?? user.email[0]).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-text-light dark:text-text-dark truncate">{fullName}</h2>
                  <p className="text-sm text-muted-light dark:text-muted-dark truncate">{user.email}</p>
                </div>
              </div>

              <div className="border border-border-light dark:border-border-dark px-4">
                <Field icon={Mail} label="Email">
                  {user.email}
                </Field>
                <Field icon={Phone} label="Phone">
                  {user.phone || <span className="text-muted-light dark:text-muted-dark">—</span>}
                </Field>
                <Field icon={Shield} label="Current role">
                  {formatRole(user.role)}
                </Field>
                <Field icon={CheckCircle} label="Status">
                  {user.status}
                </Field>
                <Field icon={user.emailVerified ? CheckCircle : XCircle} label="Email verified">
                  {user.emailVerified ? (
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Verified {formatDate(user.emailVerified)}
                    </span>
                  ) : (
                    <span className="text-muted-light dark:text-muted-dark">Not verified</span>
                  )}
                </Field>
                <Field icon={Clock} label="Last login">
                  {user.lastLoginAt ? (
                    formatDate(user.lastLoginAt)
                  ) : (
                    <span className="text-muted-light dark:text-muted-dark">Never</span>
                  )}
                </Field>
                <Field icon={Calendar} label="Joined">
                  {formatDate(user.createdAt)}
                </Field>
                {(user.lastGeoCity || user.lastGeoRegion || user.lastGeoCountry) && (
                  <Field icon={MapPin} label="Last location">
                    {[user.lastGeoCity, user.lastGeoRegion, user.lastGeoCountry].filter(Boolean).join(', ')}
                  </Field>
                )}
              </div>
            </section>

            {/* Role editor */}
            <section className="border border-border-light dark:border-border-dark p-5">
              <p className="text-[15px] font-bold text-text-light dark:text-text-dark mb-1">Change role</p>
              <p className="text-[13px] text-muted-light dark:text-muted-dark mb-4">
                Admins can manage the site. Supporters are regular members.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark w-fit">
                  {ASSIGNABLE_ROLES.map((r) => {
                    const selected = role === r
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        aria-pressed={selected}
                        className={`px-4 py-2 text-[10px] font-mono tracking-[0.2em] uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark ${
                          selected
                            ? 'bg-primary-light dark:bg-primary-dark text-bg-light dark:text-bg-dark'
                            : 'bg-bg-light dark:bg-bg-dark text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark'
                        }`}
                      >
                        {formatRole(r)}
                      </button>
                    )
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!dirty || saving}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-[10px] font-mono tracking-[0.2em] uppercase bg-primary-light dark:bg-primary-dark text-white dark:text-bg-dark transition-colors hover:bg-secondary-light dark:hover:bg-secondary-dark disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                >
                  {saved ? (
                    <>
                      <Check className="w-3.5 h-3.5" aria-hidden="true" /> Saved
                    </>
                  ) : saving ? (
                    'Saving...'
                  ) : (
                    'Save role'
                  )}
                </button>
              </div>

              {error && (
                <p role="alert" className="mt-3 font-mono text-[11px] text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}
            </section>

            <MergeUserSection userId={user.id} userEmail={user.email} />
          </div>

          {/* ── Right column — orders ── */}
          <div className="space-y-4">
            {/* Total spent stat */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-border-light dark:border-border-dark p-4">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-1">
                  Total spent
                </p>
                <p className="font-quicksand text-2xl font-black text-text-light dark:text-text-dark">
                  ${totalSpent.toFixed(2)}
                </p>
              </div>
              <div className="border border-border-light dark:border-border-dark p-4">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-1">
                  Orders
                </p>
                <p className="font-quicksand text-2xl font-black text-text-light dark:text-text-dark">
                  {user.orders.length}
                </p>
              </div>
            </div>

            {/* Orders list */}
            <section>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-3">
                Order history
              </p>

              {user.orders.length === 0 ? (
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">
                  No orders yet
                </p>
              ) : (
                <div className="border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark">
                  {user.orders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/admin/orders/${order.id}`}
                      className="flex items-center justify-between gap-4 px-4 py-3.5 hover:bg-primary-light/5 dark:hover:bg-primary-dark/5 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Package
                          className="w-3.5 h-3.5 text-muted-light dark:text-muted-dark shrink-0"
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-mono text-xs text-text-light dark:text-text-dark">
                              #{order.id.slice(-8)}
                            </p>
                            <StatusPill status={order.status} />
                          </div>
                          <p className="font-mono text-[10px] text-muted-light dark:text-muted-dark mt-0.5">
                            {order.type.replaceAll('_', ' ')} · {formatDate(order.createdAt)}
                          </p>
                          {order.items.length > 0 && (
                            <p className="font-mono text-[10px] text-muted-light dark:text-muted-dark truncate">
                              {order.items.map((i) => i.itemName ?? 'Item').join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <p className="font-mono text-sm font-bold text-text-light dark:text-text-dark tabular-nums">
                          ${Number(order.totalAmount).toFixed(2)}
                        </p>
                        <ChevronRight
                          className="w-3.5 h-3.5 text-muted-light dark:text-muted-dark group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors"
                          aria-hidden="true"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
