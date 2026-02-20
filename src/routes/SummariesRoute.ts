import express from 'express';
import { SummariesController } from '../controller/SummariesController';
import { authMiddleware } from "../middleware/AuthMiddleware";
import rateLimit from 'express-rate-limit';

const Router=express.Router()

const getSummaryLimiter=rateLimit({
    windowMs:60*60*1000,
    max:20,
    message:{message:"Too many requests, please try again later"},
    standardHeaders:true,
    legacyHeaders:false,
})

Router.get('/',authMiddleware,getSummaryLimiter,SummariesController.getSummary)
export default Router