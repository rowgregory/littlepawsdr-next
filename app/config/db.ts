import mongoose, { Connection } from "mongoose";
import chalk from "chalk";

// Declare global variable to hold mongoose connection and promise
declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

// Initialize global.mongoose if not already defined
global.mongoose = global.mongoose || {
  conn: null,
  promise: null,
};

const connectDB = async (): Promise<Connection> => {
  console.log(
    chalk.blue(`🍃 MongoDB ready state: ${mongoose.connection.readyState}`)
  );

  // Log available details
  console.log(chalk.green(`🍃 MongoDB Host: ${mongoose.connection.host}`));
  console.log(chalk.green(`🍃 MongoDB Port: ${mongoose.connection.port}`));
  console.log(
    chalk.green(
      `🍃 MongoDB Database Name: ${mongoose.connection.name || "N/A"}`
    )
  );

  if (mongoose.connection.readyState >= 1) return mongoose.connection;

  try {
    if (global.mongoose.conn) {
      return global.mongoose.conn;
    }

    // Ensure the promise is created only once
    if (!global.mongoose.promise) {
      global.mongoose.promise = mongoose
        .connect(process.env.MONGO_URI as string, {
          autoIndex: true,
        })
        .then((mongooseInstance) => mongooseInstance.connection);
    }

    // Wait for the connection promise to resolve
    global.mongoose.conn = await global.mongoose.promise;

    console.log(
      chalk.gray(`🍃 MongoDB connected: `) +
        chalk.white(`${global.mongoose.conn?.host}`)
    );

    return global.mongoose.conn;
  } catch (error) {
    console.error(
      chalk.red.bold.underline(
        `Error: ${error instanceof Error ? error.message : error}`
      )
    );
    process.exit(1);
  }
};

export default connectDB;
