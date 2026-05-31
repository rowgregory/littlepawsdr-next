import prisma from 'prisma/client'

export default async function getAdoptionApplicationBypassCode() {
  try {
    const record = await prisma.adoptionApplicationBypassCode.findFirst()

    return { success: true, data: record }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
