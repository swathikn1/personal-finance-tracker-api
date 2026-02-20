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
                    const accessToken=jwt.sign({userId:user.id},process.env.JWT_SECRET||"secretKey",{expiresIn:"2h"})
                    const refreshToken=jwt.sign({userId:user.id},process.env.REFRESH_SECRET||"refreshSecretKey",{expiresIn:"7d"})

                    user.refreshToken=refreshToken;
                    await userRepository.save(user);

                    return res.status(200).json({message:"Login successful",accessToken,refreshToken})
                }
                }
            }catch(error){
                return res.status(500).json({message:"Failed to login"})
            }
    }

    static async refreshToken(req:Request,res:Response) {
        try {
            const {refreshToken}=req.body;
            
            if (!refreshToken) {
                return res.status(401).json({message: "Refresh token required"});
            }
            
            const decoded=jwt.verify(refreshToken,process.env.REFRESH_SECRET!) as any;
            const userRepository=AppDataSource.getRepository(User);
            const user=await userRepository.findOne({
                where:{id:decoded.userId},
            });
            
            if (!user||user.refreshToken!==refreshToken) {
                return res.status(403).json({message:"Invalid refresh token"});
            }
            
            const newAccessToken=jwt.sign({userId:user.id},process.env.JWT_SECRET!,{expiresIn:"2h"});
                
                return res.json({accessToken:newAccessToken});
            }catch(error){
                return res.status(403).json({message:"Invalid or expired refresh token"});
            }
        }
    }