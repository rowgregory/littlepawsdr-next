import connectDB from 'app/lib/mongo/db'
import { startSession } from 'mongoose'

const startMongoSession = async () => {
  await connectDB()
  const session = await startSession()
  session.startTransaction()
  return session
}

export default startMongoSession
