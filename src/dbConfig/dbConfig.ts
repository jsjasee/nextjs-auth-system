// this file is responsible for connecting to mongoDB, the name can be named whatever
// every time we fetch data from mongoDB, we MUST connect.
import mongoose, { mongo } from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URL!); // use ! to denote that it is always available..??? do we need to install dotenv here?? how do i get the .env file using file paths if im at dbConfig folder which is nested in src folder. and .env is in the same level as src folder? (outside src folder)??
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected successfully!");
    }); // listen to the connection event?

    connection.on("error", (err) => {
      console.log("MongoDB connection error. Ensure MongoDB is running " + err);
      process.exit();
    });
  } catch (error) {
    console.log("Something went wrong!");
    console.log(error);
  }
}
