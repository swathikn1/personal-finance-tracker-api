import express from 'express'
import { EntriesController } from '../controller/EntriesController'

const Router=express.Router()

Router.post('/',EntriesController.createEntries)
Router.get('/',EntriesController.getEntries)
Router.get('/:id',EntriesController.getEntriesById)
Router.put('/:id',EntriesController.updateEntries)
Router.delete('/:id',EntriesController.deleteEntries)



export default Router

