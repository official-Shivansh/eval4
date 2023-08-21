const express = require("express")
const bcrypt = require("bcrypt");
const { UserModel } = require("../model/userModel");
const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../model/blacklistmodel");
require("dotenv").config();


const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    const {email}=req.body
    try {
        const user = await UserModel.findOne({ email })
        if (user) {
            res.status(200).json({ msg: "Already Registered" })
        }
        else {
            bcrypt.hash(req.body.password, 14, async (error, hash) => {
                if (hash) {
                    const newUser = new UserModel({
                        ...req.body,
                        password:hash
                    })
                    await newUser.save();
                    res.status(200).json({msg:"registered"})
                }
            })
        }
    } catch (error) {
       res.status(400).json({error:error.message})
    }
})

userRouter.post("/login",async(req,res)=>{
  const {email,password} = req.body
     
    try {
        const user = await UserModel.findOne({email})
        if(user){
            bcrypt.compare(password,user.password,(error,result)=>{
                if(result){
                    let token = jwt.sign({userId:user.id},process.env.SECRETKEY)
                    res.status(200).json({msg:"user logged in successfully"},token)
                }
                else{
                    res.status(200).json({msg:"wrong password"})
                }
            })
        }
    } catch (error) {
        res.status(400).json({error:err.message})
    }
})

userRouter.post("/logout",async(req,res)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1]||null;
        if(token){
            await BlacklistModel.updateMany({},{$push: {blacklist: [token]}})
            res.status(200).json({msg:"logout successfully"})
        }
    } catch (error) {
        res.status(400).json({error:error.message})
        
    }
})
module.exports= {userRouter}