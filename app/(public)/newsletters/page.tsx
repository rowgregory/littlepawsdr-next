import PublicNewslettersClient from 'app/(public)/newsletters/PublicNewslettersClient'
import getNewsletterIssues from 'app/lib/actions/public/newsletter-issue/getNewsletterIssues'

export default async function PublicNewslettersPage() {
  const result = await getNewsletterIssues()
  return <PublicNewslettersClient issues={result.data} />
}
