'use server'

import prisma from 'prisma/client'

export interface LogEntry {
  id: string
  ts: string
  level: 'INFO' | 'WARN' | 'ERROR'
  message: string
}

export async function getAuditLogs(limit = 50): Promise<LogEntry[]> {
  const logs = await prisma.log.findMany({
    where: {
      message: { startsWith: '[SUPER]' }
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      level: true,
      message: true,
      createdAt: true
    }
  })

  return logs.map((log) => ({
    id: log.id,
    ts: log.createdAt.toISOString().replace('T', ' ').slice(0, 19),
    level: log.level.toUpperCase() as LogEntry['level'],
    message: log.message
  }))
}
