import { AppDataSource } from "../utils/database";
import type {Request,Response} from 'express'
import logger from "../utils/logger";
import { DailySummary } from "../entity/DailySummary";

export class SummariesController{
    static async getSummary(req:Request,res:Response){
  try {
    const userId=(req as any).user.userId;
    const summaryRepository=AppDataSource.getRepository(DailySummary);

    const summary=await summaryRepository.findOne({
      where:{user:{id:userId }
      },
    });

    if(!summary){
      return res.status(404).json({message: "Summary not found yet"});
    }

    logger.info("Fetched summary from DailySummary table",{userId});

    return res.status(200).json({userId:userId,Total_Imcome:summary.totalIncome,
        Total_Expense:summary.totalExpense,
        Balance:summary.balance});

  } catch(error){
    logger.error("Failed to fetch summary",{error});
    return res.status(500).json({ message: "Failed to fetch summary" });
  }
}
}