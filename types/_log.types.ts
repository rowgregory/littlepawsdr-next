import { JsonValue } from '@prisma/client/runtime/library'

export type Log = {
  id: string
  level: string
  message: string
  metadata: JsonValue
  userId: string | null
  createdAt: Date
  updatedAt: Date
}
