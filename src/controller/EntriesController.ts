import type { Request,Response } from "express";
import { Entries } from "../entity/Entries";
import { AppDataSource } from "../utils/database";
import { redisClient } from "../config/redis";

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
            
            await redisClient.del("entries");
            await redisClient.del("summary");

            const entriesRepository=AppDataSource.getRepository(Entries)
            const savedEntries=await entriesRepository.save(entries)

            return res.status(201).json({message:"created entries successfully",entries:savedEntries})
        }catch(error){
            return res.status(500).json({message:"Failed to create entries"})
        }
    }

   static async getEntries(req: Request, res: Response) {
    try {
        const { type, category, startDate, endDate } = req.query;
        const cacheKey=`entries:${JSON.stringify(req.query)}`;

        const cached= await redisClient.get(cacheKey)

        if(cached){
            console.log('cache hit')
            return res.status(200).json({message:"Entries(from cache)", entries:JSON.parse(cached)})
        }

        console.log('cache miss')

        const entriesRepository = AppDataSource.getRepository(Entries);
        const query = entriesRepository.createQueryBuilder("entry");
        
        if(type) {
            query.andWhere("entry.type=:type", { type });
        }
        
        if(category) {
            query.andWhere("entry.category=:category", { category });
        }
        
        if (startDate && endDate) {
            query.andWhere("entry.date BETWEEN :startDate AND :endDate", {
                startDate: new Date(startDate as string),
                endDate: new Date(endDate as string),
      });
    }
    const entries = await query.getMany();
    await redisClient.set(cacheKey, JSON.stringify(entries), {
        EX: 60,
    });

    return res.status(200).json({message: "entries",entries});
}catch(error) {
    return res.status(500).json({message: "Failed to fetch entries",});
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

    static async updateEntries(req:Request,res:Response){
       try{
        const id=Number(req.params.id);
        const {amount,type,category,description,date}=req.body;
        const entriesRepository=AppDataSource.getRepository(Entries)
        const entries=(await entriesRepository.findOne({
            where:{id},
        }))!;
        
          entries.id=id;
          entries.amount=amount;
          entries.type=type;
          entries.category=category;
          entries.description=description;
          entries.date=date;
          await entriesRepository.save(entries)

        await redisClient.del("entries");
        await redisClient.del("summary");

          return res.status(201).json({message:"Upadated Entries Successfully"})
    }catch(error){
             return res.status(500).json({message:"Failed to update Entries"})
        }
    }

    static async deleteEntries(req:Request,res:Response){
        try{
        const id=Number(req.params.id);
        const entriesRepository=AppDataSource.getRepository(Entries);
        const entries=(await entriesRepository.findOne({
            where:{id},
        }))!;
        await entriesRepository.remove(entries);

        await redisClient.del("entries");
        await redisClient.del("summary");
        
        return res.status(200).json({message:"Entries Deleted Successfully"})
    }catch(error){
         return res.status(500).json({message:"Failed to delete entries"})
    }
}


}