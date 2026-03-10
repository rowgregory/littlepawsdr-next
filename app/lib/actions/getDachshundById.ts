'use server'

import { Dog } from 'app/components/pages/DachshundDetailClient'
import { createLog } from './createLog'
import { getPicturesAndVideos } from '../../utils/rescueGroupsHelpers'

export async function getDachshundById(id: string): Promise<{ success: boolean; data?: { data: Dog }; error?: string }> {
  try {
    const response = await fetch(`https://api.rescuegroups.org/v5/public/orgs/5798/animals/${id}`, {
      headers: {
        Authorization: process.env.RESCUE_GROUPS_API_KEY ?? '',
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json'
      },
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch animal: ${response.statusText}`)
    }

    const json = await response.json()

    if (json?.data) {
      getPicturesAndVideos(json)
    }

    return { success: true, data: json }
  } catch (error) {
    createLog('error', 'getDachshundById', error)
    return { success: false, error: 'Failed to fetch dachshund' }
  }
}
