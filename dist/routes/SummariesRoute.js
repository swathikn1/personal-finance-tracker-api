"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SummariesController_1 = require("../controller/SummariesController");
const Router = express_1.default.Router();
Router.get('/', SummariesController_1.SummariesController.getSummary);
exports.default = Router;
