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
exports.EntriesController = void 0;
const Entries_1 = require("../entity/Entries");
const database_1 = require("../utils/database");
const redis_1 = require("../config/redis");
class EntriesController {
    static createEntries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, amount, type, category, description, date } = req.body;
                const entries = new Entries_1.Entries();
                entries.id = id;
                entries.amount = amount;
                entries.type = type;
                entries.category = category;
                entries.description = description;
                entries.date = date;
                yield redis_1.redisClient.del("entries");
                const entriesRepository = database_1.AppDataSource.getRepository(Entries_1.Entries);
                const savedEntries = yield entriesRepository.save(entries);
                return res.status(201).json({ message: "created entries successfully", entries: savedEntries });
            }
            catch (error) {
                return res.status(500).json({ message: "Failed to create entries" });
            }
        });
    }
    static getEntries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { type, category, startDate, endDate } = req.query;
                const cacheKey = `entries:${JSON.stringify(req.query)}`;
                const cached = yield redis_1.redisClient.get(cacheKey);
                if (cached) {
                    console.log('cache hit');
                    return res.status(200).json({ message: "Entries(from cache)", entries: JSON.parse(cached) });
                }
                console.log('cache miss');
                const entriesRepository = database_1.AppDataSource.getRepository(Entries_1.Entries);
                const query = entriesRepository.createQueryBuilder("entry");
                if (type) {
                    query.andWhere("entry.type=:type", { type });
                }
                if (category) {
                    query.andWhere("entry.category=:category", { category });
                }
                if (startDate && endDate) {
                    query.andWhere("entry.date BETWEEN :startDate AND :endDate", {
                        startDate: new Date(startDate),
                        endDate: new Date(endDate),
                    });
                }
                const entries = yield query.getMany();
                yield redis_1.redisClient.set(cacheKey, JSON.stringify(entries), {
                    EX: 20,
                });
                return res.status(200).json({ message: "entries", entries });
            }
            catch (error) {
                return res.status(500).json({ message: "Failed to fetch entries", });
            }
        });
    }
    static getEntriesById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const cacheKey = `entry:${id}`;
                const cached = yield redis_1.redisClient.get(cacheKey);
                if (cached) {
                    console.log('Cache Hit');
                    res.status(200).json({ message: 'Entry (from cache)', cached });
                }
                console.log('Cache Miss');
                // debug, info, warn, error
                const entriesRepository = database_1.AppDataSource.getRepository(Entries_1.Entries);
                const entries = yield entriesRepository.findOne({
                    where: { id }
                });
                return res.status(200).json({ message: "Entries successfully fetched", entries });
            }
            catch (error) {
                return res.status(500).json({ message: "Failed to fetch entries" });
            }
        });
    }
    static updateEntries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const { amount, type, category, description, date } = req.body;
                const entriesRepository = database_1.AppDataSource.getRepository(Entries_1.Entries);
                const entries = (yield entriesRepository.findOne({
                    where: { id },
                }));
                entries.id = id;
                entries.amount = amount;
                entries.type = type;
                entries.category = category;
                entries.description = description;
                entries.date = date;
                yield entriesRepository.save(entries);
                yield redis_1.redisClient.del(`entry:${id}`);
                yield redis_1.redisClient.del("entries");
                return res.status(201).json({ message: "Upadated Entries Successfully" });
            }
            catch (error) {
                return res.status(500).json({ message: "Failed to update Entries" });
            }
        });
    }
    static deleteEntries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const entriesRepository = database_1.AppDataSource.getRepository(Entries_1.Entries);
                const entries = (yield entriesRepository.findOne({
                    where: { id },
                }));
                yield entriesRepository.remove(entries);
                yield redis_1.redisClient.del("entries");
                return res.status(200).json({ message: "Entries Deleted Successfully" });
            }
            catch (error) {
                return res.status(500).json({ message: "Failed to delete entries" });
            }
        });
    }
}
exports.EntriesController = EntriesController;
