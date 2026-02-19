import express from 'express'
import { ExportController } from '../controller/ExportController'
import { authMiddleware } from '../middleware/AuthMiddleware'

const Router=express.Router()

Router.get('/',authMiddleware,ExportController.exportEntriesToCSV)

export default Router