import express from 'express'
import { ExportController } from '../controller/ExportController'

const Router=express.Router()

Router.get('/',ExportController.exportEntriesToCSV)

export default Router