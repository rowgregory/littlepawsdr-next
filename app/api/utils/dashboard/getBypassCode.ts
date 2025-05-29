import AdoptionApplicationBypassCode from 'models/adoptionApplicationBypassCodeModel'

export async function getBypassCode(): Promise<string | null> {
  const doc = await AdoptionApplicationBypassCode.findOne()
  return doc?.bypassCode ?? null
}
