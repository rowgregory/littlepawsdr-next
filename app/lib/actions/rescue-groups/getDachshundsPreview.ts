import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from 'app/utils/log.utils'
import { createLog } from '../log/createLog'
import { getPicturesAndVideos } from 'app/utils/rescueGroupsHelpers'

export interface DachshundPreviewData {
  id: string
  name: string
  age: string
  sex: string
  status: string
  imageUrl?: string
}

export async function getDachshundsPreview(): Promise<{
  success: boolean
  data: DachshundPreviewData[]
  error?: string
}> {
  try {
    const response = await fetch(`https://api.rescuegroups.org/v5/public/orgs/5798/animals/search/dogs?limit=12`, {
      method: 'POST',
      headers: {
        Authorization: process.env.RESCUE_GROUPS_API_KEY ?? '',
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json'
      },
      body: JSON.stringify({
        data: {
          filters: [
            {
              fieldName: 'statuses.name',
              operation: 'equals',
              criteria: 'Available'
            }
          ]
        }
      }),
      next: { revalidate: 300 }
    })

    if (!response.ok) throw new Error(`Failed to fetch dachshunds: ${response.statusText}`)

    const json = await response.json()

    if (json?.data) {
      json.data = getPicturesAndVideos(json)?.reverse() ?? []
    }

    const data: DachshundPreviewData[] = (json.data ?? []).map((animal: any) => ({
      id: animal.id,
      name: (animal.attributes?.name ?? '').replace(/\d+$/, '').trim(),
      age: animal.attributes?.ageString ?? '',
      sex: animal.attributes?.sex === 'Female' ? 'F' : 'M',
      status: animal.attributes?.isAdoptionPending ? 'Pending' : 'Available',
      imageUrl: animal.attributes?.pictureThumbnailUrl ?? animal.attributes?.photos?.[0]
    }))

    const [actor, context] = await Promise.all([getActor(), getRequestContext()])
    const message = await buildLogMessage('fetched dachshunds preview', actor, context)
    await createLog('INFO', message, { count: data.length })

    return { success: true, data }
  } catch (error) {
    await createLog('ERROR', 'Error fetching dachshunds preview', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, data: [], error: 'Failed to fetch dachshunds' }
  }
}
