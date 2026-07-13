'use server'

import { revalidatePath } from 'next/cache'
import prisma from 'prisma/client'
import { createLog } from 'app/lib/actions/log/createLog'
import { requireAdmin } from '../user/requireAdmin'
import { getActor } from '../user/getActor'
import { getRequestContext, RequestContext } from 'app/utils/_log.server.utils'
import { buildLogMessage } from 'app/utils/_log.client.utils'

export default async function deleteNewsletterIssue(id: string) {
  const gate = await requireAdmin()
  if (gate.ok === false) {
    return { success: false, error: gate.error, data: null }
  }

  if (!id) {
    return { success: false, error: 'Missing issue id', data: null }
  }

  const [actor, context] = await Promise.all([
    getActor().catch(() => 'Unknown actor'),
    getRequestContext().catch(() => ({}) as RequestContext)
  ])

  try {
    const issue = await prisma.newsletterIssue.delete({
      where: { id },
      select: { id: true, month: true, year: true }
    })

    createLog('info', buildLogMessage('deleted newsletter issue', actor, context), {
      newsletterIssueId: issue.id,
      month: issue.month,
      year: issue.year,
      ...context
    })

    revalidatePath('/newsletters')
    revalidatePath('/admin/newsletter')

    return { success: true, error: null, data: issue }
  } catch (error) {
    // Prisma throws P2025 when the record doesn't exist
    const notFound = error instanceof Error && 'code' in error && (error as { code?: string }).code === 'P2025'

    await createLog('error', buildLogMessage('failed to delete newsletter issue', actor, context), {
      error: error instanceof Error ? error.message : 'Unknown error',
      newsletterIssueId: id,
      ...context
    })

    return {
      success: false,
      error: notFound ? 'That issue no longer exists.' : 'Failed to delete newsletter issue. Please try again.',
      data: null
    }
  }
}
