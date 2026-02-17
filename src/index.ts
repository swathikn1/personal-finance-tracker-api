import express from "express";
import { AppDataSource } from "./utils/database";
import EntriesRoute from "./routes/EntriesRoute"
import SummariesRoute from './routes/SummariesRoute'
import ExportRoute from './routes/ExportRoute'
import {connectRedis} from './config/redis'
import logger from "../src/utils/logger";

const app=express();
app.use(express.json());
app.use('/api/v1/entries',EntriesRoute)
app.use('/api/v1/summary',SummariesRoute)
app.use('/api/v1/export',ExportRoute)

const startServer=async()=>{
    try{
        await connectRedis();
        await AppDataSource.initialize();
        console.log("Database connected");

    app.listen(3000,() => {
      console.log("Server running on port 3000");
    });
}catch(error){
    logger.error("Failed to create entry",{error});
    console.error("Database connection failed", error);
}
}

startServer();