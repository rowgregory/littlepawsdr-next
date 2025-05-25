import connectDB from "app/config/db";
import { startSession } from "mongoose";

const startMongoSession = async () => {
  await connectDB();
  const session = await startSession();
  session.startTransaction();
  return session;
};

export default startMongoSession;
