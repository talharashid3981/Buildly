import mongoose
 from "mongoose"

const connectDb = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("atlas db connected")
    }
    catch(error){
        console.log("mongo db connection error : ",error)

    }
}

export default connectDb