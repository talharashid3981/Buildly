import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const isAuth = async (req,res,next)=>{
    try{
        const token = req.cookies.token
        if(!token){
            return res.status(400).json({
                message : "token not found"
            })
        }
        const  decoded  = await jwt.verify(token,process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id)
        console.log("user is" , req.user)
        next()
    }
    catch(error){
        return res.status(500).json({
                message : "invalid token"
            })
        console.log("invalid token",error)
    }

}

export default isAuth