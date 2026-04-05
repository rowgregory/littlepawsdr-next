import { NextResponse } from 'next/server'
import prisma from 'prisma/client'

export const runtime = 'nodejs'

function generateBypassCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+'
  const random = (len: number) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')

  return `DOXIE-${random(2).toUpperCase()}${Math.floor(Math.random() * 10)}${random(5)}`
}

export async function GET() {
  try {
    const bypassCode = generateBypassCode()
    const existing = await prisma.adoptionApplicationBypassCode.findFirst()

    await prisma.adoptionApplicationBypassCode.upsert({
      where: { id: existing?.id ?? '' },
      update: { bypassCode, nextRotationAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
      create: { bypassCode, nextRotationAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
