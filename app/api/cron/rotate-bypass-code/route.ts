import { createLog } from 'app/lib/actions/createLog'
import { NextResponse } from 'next/server'
import prisma from 'prisma/client'

export const runtime = 'nodejs'

function generateBypassCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+'
  const random = (len: number) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')

  return `DOXIE-${random(2).toUpperCase()}${Math.floor(Math.random() * 10)}${random(5)}`
}

export async function GET() {
  const start = Date.now()
  try {
    const bypassCode = generateBypassCode()
    const existing = await prisma.adoptionApplicationBypassCode.findFirst()

    await prisma.adoptionApplicationBypassCode.upsert({
      where: { id: existing?.id ?? '' },
      update: { bypassCode, nextRotationAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
      create: { bypassCode, nextRotationAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }
    })

    await createLog('info', '[CRON] rotate-bypass-code', {
      cronName: 'rotate-bypass-code',
      status: 'success',
      durationMs: Date.now() - start,
      detail: existing ? 'Bypass code rotated' : 'Bypass code created (first run)'
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    await createLog('error', '[CRON] rotate-bypass-code', {
      cronName: 'rotate-bypass-code',
      status: 'error',
      durationMs: Date.now() - start,
      detail: error instanceof Error ? error.message : 'Unknown error'
    })
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
