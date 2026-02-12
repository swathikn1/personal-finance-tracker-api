import type { Request,Response } from "express";
import { Entries } from "../entity/Entries";
import { AppDataSource } from "../utils/database";

export class EntriesController{
    static async createEntries(req:Request,res:Response){
        try{
            const{id,amount,type,category,description,date}=req.body

            const entries=new Entries()
            entries.id=id;
            entries.amount=amount;
            entries.type=type;
            entries.category=category;
            entries.description=description;
            entries.date=date;

            const entriesRepository=AppDataSource.getRepository(Entries)
            const savedEntries=await entriesRepository.save(entries)
            return res.status(201).json({message:"created entries successfully",entries:savedEntries})
        }catch(error){
            return res.status(500).json({message:"Failed to create entries"})
        }
    }

    static async getEntries(_req:Request,res:Response){
        try{
            const entriesRepository=AppDataSource.getRepository(Entries)

            const entries=await entriesRepository.find()

            return res.status(200).json({message:"All entries",entries})
        }catch(error){
            return res.status(500).json({message:"Failed to fetch all entries"})
        }
    }

    static async getEntriesById(req:Request,res:Response){
        try{
            const id=Number(req.params.id);
            const entriesRepository=AppDataSource.getRepository(Entries)
            const entries= await entriesRepository.findOne({
                where:{id}
            })
            return res.status(200).json({message:"Entries successfully fetched",entries})
        }catch(error){
            return res.status(500).json({message:"Failed to fetch entries"})
        }
    }

    
}