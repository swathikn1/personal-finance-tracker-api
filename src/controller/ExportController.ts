import type { Request,Response } from "express";
import { AppDataSource} from "../utils/database";
import { Entries } from "../entity/Entries";
import { Parser } from 'json2csv';

export class ExportController{
    static async exportEntriesToCSV(req:Request,res:Response){
        try{
            const entriesRepository=AppDataSource.getRepository(Entries)
            const entries=await entriesRepository.find()

            const fields=["id","amount","type","category","description","date"];
            const json2csv=new Parser({fields});
            const csv=json2csv.parse(entries)

            res.header("Content-Type", "text/csv");
            res.attachment("entries.csv");
            return res.send(csv);
        } catch(error) {
            return res.status(500).json({ message:"Error exporting data"});
  }
};
}