import prisma from 'prisma/client'

export async function createLog(level: string, message: string, metadata: unknown) {
  await prisma.log.create({
    data: {
      level,
      message,
      metadata: metadata ? JSON.stringify(metadata) : undefined
    }
  })
}
