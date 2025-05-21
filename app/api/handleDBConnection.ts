import connectDB from "app/config/db";

const handleDBConnection = async () => {
  try {
    await connectDB();
  } catch (connectionError) {
    console.error("Error connecting to the database:", connectionError);
    throw new Error("Database connection failed");
  }
};

export default handleDBConnection;
