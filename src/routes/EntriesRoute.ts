import express from 'express'
import { EntriesController } from '../controller/EntriesController'

const Router=express.Router()

Router.post('/',EntriesController.createEntries)
Router.get('/',EntriesController.getEntries)
Router.get('/:id',EntriesController.getEntriesById)



export default Router

