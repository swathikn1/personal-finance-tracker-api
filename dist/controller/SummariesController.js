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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummariesController = void 0;
const database_1 = require("../utils/database");
const Entries_1 = require("../entity/Entries");
class SummariesController {
    static getSummary(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entriesRepository = database_1.AppDataSource.getRepository(Entries_1.Entries);
                const totalIncome = (yield entriesRepository.sum("amount", { type: Entries_1.EntryType.INCOME, })) || 0;
                const totalExpense = (yield entriesRepository.sum("amount", { type: Entries_1.EntryType.EXPENSE, })) || 0;
                const balance = totalIncome - totalExpense;
                return res.status(200).json({ Total_Income: totalIncome, Total_Expense: totalExpense, Balance: balance });
            }
            catch (error) {
                return res.status(500).json({ message: "Failed to fetch summary" });
            }
        });
    }
}
exports.SummariesController = SummariesController;
