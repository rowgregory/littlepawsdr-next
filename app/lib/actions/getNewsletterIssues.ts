'use server'

import prisma from 'prisma/client'

export default async function getNewsletterIssues() {
  try {
    const issues = await prisma.newsletterIssue.findMany({
      orderBy: { publishedAt: 'desc' }
    })

    return { success: true, data: issues }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
