import AdminNewsletterPageClient from 'app/components/pages/AdminNewsletterClient'
import getNewsletterIssues from 'app/lib/actions/getNewsletterIssues'
import getNewsletters from 'app/lib/actions/getNewsletters'

export default async function AdminNewsletterPage() {
  const [newslettersResult, issuesResult] = await Promise.all([getNewsletters(), getNewsletterIssues()])

  return <AdminNewsletterPageClient newsletters={newslettersResult?.data ?? []} issues={issuesResult?.data ?? []} />
}
