import express from 'express';
import { SummariesController } from '../controller/SummariesController';

const Router=express.Router()

Router.get('/',SummariesController.getSummary)

export default Router