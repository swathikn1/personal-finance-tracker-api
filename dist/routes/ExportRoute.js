"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ExportController_1 = require("../controller/ExportController");
const Router = express_1.default.Router();
Router.get('/', ExportController_1.ExportController.exportEntriesToCSV);
exports.default = Router;
