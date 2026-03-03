"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummariesController = void 0;
const database_1 = require("../utils/database");
const logger_1 = __importDefault(require("../utils/logger"));
const DailySummary_1 = require("../entity/DailySummary");
class SummariesController {
    static getSummary(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const summaryRepository = database_1.AppDataSource.getRepository(DailySummary_1.DailySummary);
                const summary = yield summaryRepository.findOne({
                    where: { user: { id: userId }
                    },
                });
                if (!summary) {
                    return res.status(404).json({ message: "Summary not found yet" });
                }
                logger_1.default.info("Fetched summary from DailySummary table", { userId });
                return res.status(200).json({ userId: userId, Total_Imcome: summary.totalIncome,
                    Total_Expense: summary.totalExpense,
                    Balance: summary.balance });
            }
            catch (error) {
                logger_1.default.error("Failed to fetch summary", { error });
                return res.status(500).json({ message: "Failed to fetch summary" });
            }
        });
    }
}
exports.SummariesController = SummariesController;
