'use server'

import { revalidatePath } from 'next/cache'
import prisma from 'prisma/client'
import { createLog } from 'app/lib/actions/log/createLog'
import { MONTHS } from 'app/lib/constants/date.constants'
import { CreateNewsletterIssueInput } from 'types/entities/newsletter-issue.types'
import { requireAdmin } from '../user/requireAdmin'
import { getActor } from '../user/getActor'
import { getRequestContext, RequestContext } from 'app/utils/log.server.utils'
import { buildLogMessage } from 'app/utils/log.client.utils'

export default async function createNewsletterIssue(input: CreateNewsletterIssueInput) {
  const gate = await requireAdmin()
  if (gate.ok === false) {
    return { success: false, error: gate.error, data: null }
  }

  const month = input.month?.trim()
  const year = input.year?.trim()
  const pdfUrl = input.pdfUrl?.trim()

  if (!month || !MONTHS.includes(month as (typeof MONTHS)[number])) {
    return { success: false, error: 'A valid month is required', data: null }
  }

  if (!year || !/^\d{4}$/.test(year)) {
    return { success: false, error: 'A valid four-digit year is required', data: null }
  }

  if (!pdfUrl) {
    return { success: false, error: 'A PDF URL is required', data: null }
  }

  const isLive = input.isLive ?? false

  const [actor, context] = await Promise.all([
    getActor().catch(() => 'Unknown actor'),
    getRequestContext().catch(() => ({}) as RequestContext)
  ])

  try {
    const issue = await prisma.newsletterIssue.create({
      data: { month, year, pdfUrl, isLive }
    })

    await createLog('info', buildLogMessage('created newsletter issue', actor, context), {
      newsletterIssueId: issue.id,
      month: issue.month,
      year: issue.year,
      isLive: issue.isLive,
      ...context
    })

    revalidatePath('/newsletters')
    revalidatePath('/admin/newsletter')

    return { success: true, error: null }
  } catch (error) {
    await createLog('error', buildLogMessage('failed to create newsletter issue', actor, context), {
      error: error instanceof Error ? error.message : 'Unknown error',
      input: { month, year, pdfUrl, isLive },
      userId: gate.userId,
      ...context
    }).catch(console.error)

    return {
      success: false,
      error: 'Failed to create newsletter issue. Please try again.',
      data: null
    }
  }
}
