import cron from "node-cron";
import { AppDataSource } from "../utils/database";
import { Entries, EntryType } from "../entity/Entries";
import { User } from "../entity/User";
import { DailySummary } from "../entity/DailySummary";
import logger from "../utils/logger";

export const DailySummaryCron = () => {
  cron.schedule("*/10 * * * *",async () => {
    try {
      logger.info("Running Daily Summary Cron Job...");

      const userRepository=AppDataSource.getRepository(User);
      const entriesRepository=AppDataSource.getRepository(Entries);
      const summaryRepository=AppDataSource.getRepository(DailySummary);

      const users=await userRepository.find();

      for(const user of users){

        const totalIncome=(await entriesRepository.sum("amount", 
            {type:EntryType.INCOME,userId:user.id,}))||0;

        const totalExpense=(await entriesRepository.sum("amount",
            {type:EntryType.EXPENSE,userId:user.id,})) || 0;

        const balance=totalIncome-totalExpense;

        const summary=new DailySummary();
        summary.totalIncome=totalIncome;
        summary.totalExpense=totalExpense;
        summary.balance=balance;
        summary.date=new Date().toISOString().split("T")[0];
        summary.user=user;

        await summaryRepository.save(summary);
      }

      logger.info("Daily Summary Cron Completed", new Date());
    } catch (error) {
      logger.error("Daily Summary Cron Failed",{error});
    }
  });
};