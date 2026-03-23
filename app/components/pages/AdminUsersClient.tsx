'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { PanelRightOpen } from 'lucide-react'
import AdminPageHeader from '../common/AdminPageHeader'
import { formatDate } from 'app/utils/date.utils'
import { IUser, RoleFilter } from 'types/entities/user'
import { formatRole } from 'app/utils/formatRole'
import { Pagination } from '../common/Pagination'

const PAGE_SIZE = 25

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

  const totalPages = Math.max(1, Math.ceil(filtered?.length / PAGE_SIZE))
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
    <>
      <AdminPageHeader label="Admin" title="Users" description="Manage user accounts, roles, and permissions" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="border border-border-light dark:border-border-dark overflow-hidden">
          {/* ── Toolbar ── */}
          <div className="px-5 py-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark shrink-0">
              All Users
              <span className="ml-2 text-primary-light dark:text-primary-dark">{filtered?.length}</span>
            </p>

            <div className="flex items-center gap-2 w-full xs:w-auto flex-wrap">
              {/* Search */}
              <div className="relative flex-1 xs:flex-none">
                <label htmlFor="user-search" className="sr-only">
                  Search users
                </label>
                <input
                  id="user-search"
                  type="search"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search name or email..."
                  className="w-full xs:w-52 pl-3 pr-3 py-2 text-xs font-mono border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark placeholder:text-muted-light/50 dark:placeholder:text-muted-dark/50 transition-colors duration-150 focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark"
                />
              </div>

              {/* Role filter */}
              <div className="relative shrink-0">
                <label htmlFor="role-filter" className="sr-only">
                  Filter by role
                </label>
                <select
                  id="role-filter"
                  value={roleFilter}
                  onChange={(e) => handleFilter(e.target.value as RoleFilter)}
                  className="appearance-none pl-3 pr-8 py-2 text-xs font-mono border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark transition-colors duration-150 focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark"
                >
                  <option value="ALL">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPPORTER">Supporter</option>
                </select>
                <svg
                  viewBox="0 0 24 24"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-light dark:text-muted-dark pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="square"
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>

          {/* ── Table ── */}
          <div className="overflow-x-auto">
            <table className="w-full" role="table" aria-label="Users list">
              <thead>
                <tr className="border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                  {['Name', 'Role', 'Created', ''].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-5 py-3 text-left text-[10px] font-mono tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <motion.tbody
                key={`${roleFilter}-${search}-${safePage}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
              >
                {paginated?.length > 0 ? (
                  paginated.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border-light dark:border-border-dark last:border-0 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors duration-150"
                    >
                      {/* Name + email */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-text-light dark:text-text-dark leading-snug">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs font-mono text-muted-light dark:text-muted-dark mt-0.5">{user.email}</p>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`text-[9px] font-black tracking-widest uppercase px-2 py-1 ${
                            user.role === 'ADMIN' || user.role === 'SUPERUSER'
                              ? 'bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark'
                              : 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark'
                          }`}
                        >
                          {formatRole(user.role)}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono text-muted-light dark:text-muted-dark">{formatDate(user.createdAt)}</span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <button
                          //   onClick={() => {
                          //     store.dispatch(setOpenUserDrawer())
                          //     store.dispatch(setInputs({ formName: 'userForm', data: user }))
                          //   }}
                          aria-label={`Open details for ${user.firstName} ${user.lastName}`}
                          className="p-2 text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark border border-transparent hover:border-primary-light/30 dark:hover:border-primary-dark/30 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                        >
                          <PanelRightOpen size={15} aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-16 text-center">
                      <p className="text-sm font-mono text-muted-light dark:text-muted-dark">No users found.</p>
                    </td>
                  </tr>
                )}
              </motion.tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {filtered?.length > PAGE_SIZE && (
            <Pagination page={safePage} totalPages={totalPages} onPage={setPage} totalItems={filtered?.length} pageSize={PAGE_SIZE} />
          )}
        </div>
      </div>
    </>
  )
}
