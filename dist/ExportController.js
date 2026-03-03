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
exports.ExportController = void 0;
const database_1 = require("../utils/database");
const Entries_1 = require("../entity/Entries");
const json2csv_1 = require("json2csv");
const logger_1 = __importDefault(require("../utils/logger"));
class ExportController {
    static exportEntriesToCSV(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entriesRepository = database_1.AppDataSource.getRepository(Entries_1.Entries);
                const userId = req.user.userId;
                const entries = yield entriesRepository.find({
                    where: { userId }
                });
                if (!entries.length) {
                    return res.status(404).json({ message: "No entries found for this user" });
                }
                const fields = ["id", "amount", "type", "category", "description", "date"];
                const json2csv = new json2csv_1.Parser({ fields });
                const csv = json2csv.parse(entries);
                res.header("Content-Type", "text/csv");
                res.attachment("entries.csv");
                logger_1.default.info("Exported to CSV Successfully", { userId });
                return res.send(csv);
            }
            catch (error) {
                logger_1.default.error("Failed to export entry", { error });
                return res.status(500).json({ message: "Error exporting data" });
            }
        });
    }
    ;
}
exports.ExportController = ExportController;
