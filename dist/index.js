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
const express_1 = __importDefault(require("express"));
const database_1 = require("./utils/database");
const EntriesRoute_1 = __importDefault(require("./routes/EntriesRoute"));
const SummariesRoute_1 = __importDefault(require("./routes/SummariesRoute"));
const ExportRoute_1 = __importDefault(require("./routes/ExportRoute"));
const redis_1 = require("./config/redis");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/v1/entries', EntriesRoute_1.default);
app.use('/api/v1/summary', SummariesRoute_1.default);
app.use('/api/v1/export', ExportRoute_1.default);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, redis_1.connectRedis)();
        yield database_1.AppDataSource.initialize();
        console.log("Database connected");
        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    }
    catch (error) {
        console.error("Database connection failed", error);
    }
});
startServer();
