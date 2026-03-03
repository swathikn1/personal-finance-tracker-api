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
exports.EntriesController = void 0;
const Entries_1 = require("../entity/Entries");
const database_1 = require("../utils/database");
const redis_1 = require("../config/redis");
const logger_1 = __importDefault(require("../utils/logger"));
class EntriesController {
    static createEntries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { amount, type, category, description, date } = req.body;
                const userId = req.user.userId;
                const entriesRepository = database_1.AppDataSource.getRepository(Entries_1.Entries);
                const entry = new Entries_1.Entries();
                entry.amount = amount;
                entry.type = type;
                entry.category = category;
                entry.description = description;
                entry.date = date;
                entry.userId = userId;
                yield entriesRepository.save(entry);
                yield redis_1.redisClient.del(`entries:${userId}:*`);
                logger_1.default.info("Entry created successfully", { userId });
                return res.status(201).json({ message: "Entry created successfully", entry });
            }
            catch (error) {
                logger_1.default.error("Failed to create entry", { error });
                return res.status(500).json({ message: "Failed to create entry" });
            }
        });
    }
    static getEntries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const { type, category, startDate, endDate } = req.query;
                const page = Number(req.query.page) || 1;
                const limit = Number(req.query.limit) || 10;
                const offset = (page - 1) * limit;
                const sortBy = req.query.sortBy || "date";
                const sortOrder = req.query.sortOrder || "DESC";
                const allowedSortFields = ["date", "amount", "category"];
                const safeSort = allowedSortFields.includes(sortBy) ? sortBy : "date";
                const cacheKey = `entries:${userId}:${JSON.stringify(req.query)}`;
                const cached = yield redis_1.redisClient.get(cacheKey);
                if (cached) {
                    logger_1.default.info("Cache hit for entries", { cacheKey });
                    return res.status(200).json({ message: "Entries (from cache)", entries: JSON.parse(cached) });
                }
                logger_1.default.info("Cache miss for entries", { cacheKey });
                const entriesRepository = database_1.AppDataSource.getRepository(Entries_1.Entries);
                const query = entriesRepository.createQueryBuilder("entries")
                    .where("entries.userId=:userId", { userId });
                if (type)
                    query.andWhere("entries.type = :type", { type });
                if (category)
                    query.andWhere("entries.category = :category", { category });
                if (startDate && endDate) {
                    query.andWhere("entries.date BETWEEN :startDate AND :endDate", {
                        startDate: startDate,
                        endDate: endDate,
                    });
                }
                const totalCount = yield query.getCount();
                const entries = yield query
                    .orderBy(`entries.${safeSort}`, sortOrder)
                    .take(limit)
                    .skip(offset)
                    .getMany();
                const totalPages = Math.ceil(totalCount / limit);
                const responseData = {
                    currentPage: page,
                    totalPages,
                    totalCount,
                    pageSize: limit,
                    entries,
                };
                yield redis_1.redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 20 });
                logger_1.default.info("Fetched entries successfully", { userId });
                return res.status(200).json(responseData);
            }
            catch (error) {
                logger_1.default.error("Failed to fetch entries", { error });
                return res.status(500).json({ message: "Failed to fetch entries" });
            }
        });
    }
    static getEntryById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const id = Number(req.params.id);
                const cacheKey = `entry:${userId}:${id}`;
                const cached = yield redis_1.redisClient.get(cacheKey);
                if (cached) {
                    logger_1.default.info("Cache hit for entry", { cacheKey });
                    return res.status(200).json({ message: "Entry (from cache)", entry: JSON.parse(cached) });
                }
                const entriesRepository = database_1.AppDataSource.getRepository(Entries_1.Entries);
                const entry = yield entriesRepository.findOne({
                    where: { id, userId }
                });
                if (!entry)
                    return res.status(404).json({ message: "Entry not found" });
                yield redis_1.redisClient.set(cacheKey, JSON.stringify(entry), { EX: 20 });
                logger_1.default.info("Fetched entry successfully", { userId, id });
                return res.status(200).json({ message: "Entry fetched successfully", entry });
            }
            catch (error) {
                logger_1.default.error("Failed to fetch entry", { error });
                return res.status(500).json({ message: "Failed to fetch entry" });
            }
        });
    }
    static updateEntry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const id = Number(req.params.id);
                const { amount, type, category, description, date } = req.body;
                const entriesRepository = database_1.AppDataSource.getRepository(Entries_1.Entries);
                const entry = yield entriesRepository.findOne({
                    where: { id, userId }
                });
                if (!entry)
                    return res.status(404).json({ message: "Entry not found" });
                entry.amount = amount;
                entry.type = type;
                entry.category = category;
                entry.description = description;
                entry.date = date;
                yield entriesRepository.save(entry);
                yield redis_1.redisClient.del(`entry:${userId}:${id}`);
                yield redis_1.redisClient.del(`entries:${userId}:*`);
                logger_1.default.info("Entry updated successfully", { userId, id });
                return res.status(200).json({ message: "Entry updated successfully", entry });
            }
            catch (error) {
                logger_1.default.error("Failed to update entry", { error });
                return res.status(500).json({ message: "Failed to update entry" });
            }
        });
    }
    static deleteEntry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const id = Number(req.params.id);
                const entriesRepository = database_1.AppDataSource.getRepository(Entries_1.Entries);
                const entry = yield entriesRepository.findOne({
                    where: { id, userId }
                });
                if (!entry)
                    return res.status(404).json({ message: "Entry not found" });
                yield entriesRepository.remove(entry);
                yield redis_1.redisClient.del(`entry:${userId}:${id}`);
                yield redis_1.redisClient.del(`entries:${userId}:*`);
                logger_1.default.info("Entry deleted successfully", { userId, id });
                return res.status(200).json({ message: "Entry deleted successfully" });
            }
            catch (error) {
                logger_1.default.error("Failed to delete entry", { error });
                return res.status(500).json({ message: "Failed to delete entry" });
            }
        });
    }
}
exports.EntriesController = EntriesController;
