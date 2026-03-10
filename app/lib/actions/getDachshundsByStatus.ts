'use server'

import { createLog } from './createLog'
import { getPicturesAndVideos } from '../../utils/rescueGroupsHelpers'

export async function getDachshundsByStatus({ status, pageLimit, currentPage }: { status: string; pageLimit: number; currentPage: number }) {
  try {
    const response = await fetch(`https://api.rescuegroups.org/v5/public/orgs/5798/animals/search/dogs?limit=${pageLimit}`, {
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
              criteria: status
            }
          ]
        }
      })
    })

    if (!response.ok) throw new Error(`Failed to fetch dachshunds: ${response.statusText}`)

    const data = await response.json()

    if (data?.data) {
      getPicturesAndVideos(data).reverse()
    }

    console.log('GET DACHSHUNDS BY STATUS: ', data)

    return { success: true, data }
  } catch (error) {
    await createLog('error', 'Error fetching dachshunds by status', {
      status,
      pageLimit,
      currentPage,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Failed to fetch dachshunds' }
  }
}
