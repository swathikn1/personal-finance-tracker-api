import type { Request,Response } from "express";
import { Entries } from "../entity/Entries";
import { AppDataSource } from "../utils/database";
import { redisClient } from "../config/redis";
import logger from "../utils/logger";

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

            const entriesRepository=AppDataSource.getRepository(Entries)
            const savedEntries=await entriesRepository.save(entries)

            logger.info("Entry created successfully")

            return res.status(201).json({message:"created entry successfully",entries:savedEntries})
        }catch(error){
            logger.error("Failed to create entry",{error});
            return res.status(500).json({message:"Failed to create entry"})
        }
    }

   static async getEntries(req: Request, res: Response) {
    try {
        const { type, category, startDate, endDate } = req.query;
        const cacheKey=`entries:${JSON.stringify(req.query)}`;

        const cached= await redisClient.get(cacheKey)

        if(cached){
            logger.info("Cache hit for entries",{cacheKey});
            return res.status(200).json({message:"Entries(from cache)", entries:JSON.parse(cached)})
        }

        logger.error('Cache miss for entries',{cacheKey})

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
        EX: 20,
    });

    logger.info("Fetched data sucessfully")

    return res.status(200).json({message: "entries",entries});
}catch(error) {
    logger.error("Failed to fetch entry",{error});
    return res.status(500).json({message: "Failed to fetch entries",});
  }
}

    static async getEntriesById(req:Request,res:Response){
        try{
            const id=Number(req.params.id);
            const cacheKey=`entry:${id}`

            const cached=await redisClient.get(cacheKey)

            if(cached){
                console.log('Cache Hit')
                res.status(200).json({message:'Entry (from cache)',cached})
            }

            console.log('Cache Miss')
            // debug, info, warn, error

            const entriesRepository=AppDataSource.getRepository(Entries)
            const entries= await entriesRepository.findOne({
                where:{id}
            })

            logger.info("Fetched data sucessfully")

            return res.status(200).json({message:"Entries successfully fetched",entries})
        }catch(error){
            logger.error("Failed to fetch entry",{error});
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

        await redisClient.del(`entry:${id}`);  
        await redisClient.del("entries");

        logger.info("Entry updated successfully",{id});

          return res.status(201).json({message:"Upadated Entries Successfully"})
    }catch(error){
        logger.error("Failed to update entry",{error});
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

        return res.status(200).json({message:"Entries Deleted Successfully"})
    }catch(error){
        logger.error("Failed to delete entry",{error});
         return res.status(500).json({message:"Failed to delete entries"})
    }
}


}