import { RequestContext } from './log.server.utils'

export function buildLogMessage(action: string, actor: string, context: RequestContext) {
  const time = new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/New_York'
  })

  return `${actor} ${action} on ${context.device} (${context.browser} · ${context.os}) at ${time}`
}
