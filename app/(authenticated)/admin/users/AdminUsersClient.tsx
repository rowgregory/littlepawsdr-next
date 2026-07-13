'use client'

import { useState, useMemo } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { formatDate } from 'app/utils/_date.utils'
import { IUser, RoleFilter } from 'types/_user'
import { formatRole } from 'app/utils/_user.utils'
import AdminPageHeader from 'app/components/admin/_shared/AdminPageHeader'
import AdminFilterTabs from 'app/components/admin/_shared/AdminFilterTabs'
import AdminTable, { type Column } from 'app/components/admin/_shared/AdminTable'
import { Pagination } from 'app/components/_common/Pagination'
import { PAGE_SIZE, ROLE_FILTER_LABELS, ROLE_FILTERS } from 'app/lib/constants/user.constants'
import Link from 'next/link'

const columns: Column<IUser>[] = [
  {
    header: 'Name',
    cell: (user) => (
      <>
        <p className="text-sm font-semibold text-text-light dark:text-text-dark leading-snug">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-xs font-mono text-muted-light dark:text-muted-dark mt-0.5">{user.email}</p>
      </>
    )
  },
  {
    header: 'Role',
    className: 'whitespace-nowrap',
    cell: (user) => (
      <span
        className={`text-[9px] font-black tracking-widest uppercase px-2 py-1 ${
          user.role === 'ADMIN' || user.role === 'SUPERUSER'
            ? 'bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark'
            : 'bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark'
        }`}
      >
        {formatRole(user.role)}
      </span>
    )
  },
  {
    header: 'Created',
    className: 'whitespace-nowrap text-xs font-mono text-muted-light dark:text-muted-dark',
    cell: (user) => formatDate(user.createdAt)
  },
  {
    header: '',
    className: 'sticky right-0 whitespace-nowrap text-right bg-surface-light dark:bg-surface-dark',
    headerClassName: 'sticky right-0 bg-surface-light dark:bg-surface-dark',
    cell: (user) => (
      <Link
        href={`/admin/users/${user.id}`}
        aria-label={`Open details for ${user.firstName} ${user.lastName}`}
        className="inline-flex p-2 text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark border border-transparent hover:border-primary-light/30 dark:hover:border-primary-dark/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
      >
        <ArrowRight size={15} aria-hidden="true" />
      </Link>
    )
  }
]

export default function AdminUsersClient({ users }: { users: IUser[] }) {
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return users.filter((u) => {
      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
      const matchesSearch = !q || [u.firstName, u.lastName, u.email].some((v) => v?.toLowerCase().includes(q))
      return matchesRole && matchesSearch
    })
  }, [users, roleFilter, search])

  const counts = useMemo(() => {
    const base = Object.fromEntries(ROLE_FILTERS.map((f) => [f, 0])) as Record<RoleFilter, number>
    base.ALL = users.length
    for (const u of users) {
      if (u.role in base) base[u.role as RoleFilter]++
    }
    return base
  }, [users])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function handleFilter(value: RoleFilter) {
    setRoleFilter(value)
    setPage(1)
  }

  function handleSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  return (
    <main id="main-content" className="min-h-screen w-full bg-bg-light dark:bg-bg-dark">
      <AdminPageHeader title="Users" count={{ value: filtered.length, noun: 'user' }} />

      <div className="w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Toolbar: search + role filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1 sm:max-w-xs">
            <label htmlFor="user-search" className="sr-only">
              Search users
            </label>
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-light dark:text-muted-dark pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="user-search"
              type="search"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search name or email..."
              className="w-full pl-9 pr-3 py-2 text-xs font-mono border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder:text-muted-light/50 dark:placeholder:text-muted-dark/50 transition-colors focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark"
            />
          </div>

          <AdminFilterTabs
            options={ROLE_FILTERS}
            value={roleFilter}
            onChange={handleFilter}
            counts={counts}
            labels={ROLE_FILTER_LABELS}
            label="Filter users by role"
          />
        </div>

        {/* Table */}
        <AdminTable
          columns={columns}
          rows={paginated}
          rowKey={(u) => u.id}
          caption="Users list"
          emptyMessage="No users found"
          rowClassName={() =>
            'border-b border-border-light dark:border-border-dark last:border-0 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors'
          }
        />

        {/* Pagination */}
        {filtered.length > PAGE_SIZE && (
          <Pagination
            page={safePage}
            totalPages={totalPages}
            onPage={setPage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
          />
        )}
      </div>
    </main>
  )
}
