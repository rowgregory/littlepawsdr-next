import prisma from 'prisma/client'
import { Prisma } from '@prisma/client'

export async function createLog(level: string, message: string, metadata?: Record<string, unknown>) {
  await prisma.log.create({
    data: {
      level,
      message,
      metadata: metadata ? (metadata as Prisma.InputJsonValue) : undefined
    }
  })
}
