import mongoose from "mongoose";

let isConnected = false // Track the connection

export const connectToDB = async () => {
    mongoose.set('strictQuery', true)

    if (isConnected) {
        console.log("MongoDB is connected successfully!")
        return
    }

    try {
        await mongoose.connect(process.env.DB_URL || "", {
            dbName: "VoiceGenDb",
        })

        isConnected = true

        console.log("MongoDB connected")
    } catch (err) {
        console.log(err)
    }
}