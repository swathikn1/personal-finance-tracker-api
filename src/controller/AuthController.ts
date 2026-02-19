import type { Request,Response } from "express";
import { AppDataSource } from "../utils/database";
import { User } from "../entity/User";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


export class AuthContoller{
    static async register(req:Request,res:Response){
        try{
            const {name,email,password}=req.body

            const userRepository=AppDataSource.getRepository(User)
            const existingUser=await userRepository.findOneBy({email})

            if(existingUser){
                return res.status(400).json({message:"User with this email already exists"})

            }else{
                const hashedPassword=await bcrypt.hash(password,10)

                const user=new User()
                user.name=name;
                user.email=email;
                user.password=hashedPassword;

                const savedUser=await userRepository.save(user)
                return res.status(201).json({message:"User resgisterd successfully",user:savedUser})
            }
        }catch(error){
            console.error(error);
            return res.status(500).json({message:"Failed to register user"})
        }
    }

    static async login(req:Request,res:Response){
        try{
            const {email,password}=req.body
            const userRepository=AppDataSource.getRepository(User)
            const user=await userRepository.findOneBy({email})
            if(!user){
                return res.status(400).json({message:"Invalid email or password"})
            }else{
                const isPasswordValid=await bcrypt.compare(password,user.password)

                if(!isPasswordValid){
                    res.status(400).json({message:"Invalid email or password"})
                }else{
                    const token=jwt.sign({userId:user.id},process.env.JWT_SECRET||"secretKey",{expiresIn:"6h"})
                    return res.status(200).json({message:"Login successful",token})
                }
                }
            }catch(error){
                return res.status(500).json({message:"Failed to login"})
            }
    }
}