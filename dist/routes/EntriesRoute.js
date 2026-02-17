"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EntriesController_1 = require("../controller/EntriesController");
const Router = express_1.default.Router();
Router.post('/', EntriesController_1.EntriesController.createEntries);
Router.get('/', EntriesController_1.EntriesController.getEntries);
Router.get('/:id', EntriesController_1.EntriesController.getEntriesById);
Router.put('/:id', EntriesController_1.EntriesController.updateEntries);
Router.delete('/:id', EntriesController_1.EntriesController.deleteEntries);
exports.default = Router;
