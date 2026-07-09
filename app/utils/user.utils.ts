export function formatRole(role: string): string {
  const ROLE_LABELS: Record<string, string> = {
    SUPERUSER: 'Super User',
    ADMIN: 'Admin',
    SUPPORTER: 'Supporter'
  }
  return ROLE_LABELS[role] ?? role
}
