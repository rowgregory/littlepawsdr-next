import { createLog } from 'app/lib/actions/createLog'
import { pusher } from 'app/lib/pusher'

export const SUPERUSER_CHANNEL = 'superuser'

export async function pusherTrigger(channel: string, event: string, data: Record<string, unknown>) {
  // Fire both simultaneously — original channel + superuser feed
  await Promise.all([
    pusher.trigger(channel, event, data),
    // Don't double-broadcast if already targeting superuser channel
    channel !== SUPERUSER_CHANNEL
      ? pusher.trigger(SUPERUSER_CHANNEL, event, {
          ...data,
          _channel: channel, // so the feed knows where it came from
          _ts: new Date().toISOString()
        })
      : Promise.resolve()
  ])

  await createLog('info', '[PUSHER]', {
    channel,
    event,
    payload: data
  })
}

export async function pusherSuperuser(event: string, data: Record<string, unknown>) {
  await pusherTrigger(SUPERUSER_CHANNEL, event, {
    ...data,
    _ts: new Date().toISOString()
  })
}
