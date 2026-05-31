'use server'

import prisma from 'prisma/client'

export default async function getAuctionAnomalies(auctionId: string) {
  try {
    const anomalies = await prisma.auctionAnomaly.findMany({
      where: { auctionId },
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, data: anomalies }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
