import { AppDataSource } from "../utils/database";
import { Entries, EntryType } from "../entity/Entries";
import type {Request,Response} from 'express'
import logger from "../utils/logger";

export class SummariesController{
    static async getSummary(_req:Request,res:Response){
        try{
        const entriesRepository=AppDataSource.getRepository(Entries);
         const totalIncome = (await entriesRepository.sum("amount",
             {type: EntryType.INCOME,}))||0;

        const totalExpense=(await entriesRepository.sum("amount",
        {type:EntryType.EXPENSE,}))||0;

         const balance = totalIncome - totalExpense;

         logger.info("Feched summary successfully")
         return res.status(200).json({Total_Income:totalIncome,Total_Expense:totalExpense,Balance:balance})
    }catch(error){
        logger.error("Failed to fetch summary",{error});
        return res.status(500).json({message:"Failed to fetch summary"})
    }
}
}