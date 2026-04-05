import PublicNewslettersClient from 'app/components/pages/PublicNewslettersClient'
import getNewsletterIssues from 'app/lib/actions/getNewsletterIssues'

export default async function PublicNewslettersPage() {
  const result = await getNewsletterIssues()
  return <PublicNewslettersClient issues={result.data} />
}
