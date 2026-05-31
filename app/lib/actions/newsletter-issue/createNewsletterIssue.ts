'use server'

import prisma from 'prisma/client'

export default async function createNewsletterIssue({
  title,
  description,
  pdfUrl,
  publishedAt
}: {
  title: string
  description: string | null
  pdfUrl: string
  publishedAt: Date
}) {
  try {
    const issue = await prisma.newsletterIssue.create({
      data: { title, description, pdfUrl, publishedAt }
    })

    return { success: true, data: issue }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
