import mongoose from "mongoose";

const connectDB = async (DATABASE_URL)=>{
    try {
        await mongoose.connect(DATABASE_URL)
        console.log("connection established")
    } catch (error) {
        console.log(error)
        console.log("Could connect to MongoDb")
    }
}

export default connectDB;