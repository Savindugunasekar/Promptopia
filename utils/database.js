import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "Promptopia",
      useNewUrlParser: true,        // Use the new URL string parser
      useUnifiedTopology: true,     // Use the new server discovery and monitoring engine
    });

    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;  // Optional: rethrow to handle it in other parts of your app
  }
};
