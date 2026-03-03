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
exports.AuthContoller = void 0;
const database_1 = require("../utils/database");
const User_1 = require("../entity/User");
const { log } = require("node:console");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_SECRET_EXPIRATION;
const REFRESH_EXPIRES_IN = process.env.REFRESH_SECRET_EXPIRATION;
class AuthContoller {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password } = req.body;
                const userRepository = database_1.AppDataSource.getRepository(User_1.User);
                const existingUser = yield userRepository.findOneBy({ email });
                if (existingUser) {
                    return res.status(400).json({ message: "User with this email already exists" });
                }
                else {
                    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                    const user = new User_1.User();
                    user.name = name;
                    user.email = email;
                    user.password = hashedPassword;
                    const savedUser = yield userRepository.save(user);
                    return res.status(201).json({ message: "User resgisterd successfully", user: savedUser });
                }
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Failed to register user" });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const userRepository = database_1.AppDataSource.getRepository(User_1.User);
                const user = yield userRepository.findOneBy({ email });
                if (!user) {
                    return res.status(400).json({ message: "Invalid email or password" });
                }
                else {
                    const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
                    if (!isPasswordValid) {
                        res.status(400).json({ message: "Invalid email or password" });
                    }
                    else {
                        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
                        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
                        user.refreshToken = refreshToken;
                        yield userRepository.save(user);
                        return res.status(200).json({ message: "Login successful", accessToken, refreshToken });
                    }
                }
            }
            catch (error) {
                logger.error("FAILED TO LOGIN USER:", error);
                return res.status(500).json({ message: "Failed to login" });
            }
        });
    }
    static refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.body;
                if (!refreshToken) {
                    return res.status(401).json({ message: "Refresh token required" });
                }
                const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_SECRET);
                const userRepository = database_1.AppDataSource.getRepository(User_1.User);
                const user = yield userRepository.findOne({
                    where: { id: decoded.userId },
                });
                if (!user || user.refreshToken !== refreshToken) {
                    return res.status(403).json({ message: "Invalid refresh token" });
                }
                const newAccessToken = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
                return res.json({ accessToken: newAccessToken });
            }
            catch (error) {
                return res.status(403).json({ message: "Invalid or expired refresh token" });
            }
        });
    }
}
exports.AuthContoller = AuthContoller;
