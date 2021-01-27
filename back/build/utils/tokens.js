"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const createToken = (username, id) => {
    const forToken = { username, id };
    return jsonwebtoken_1.default.sign(forToken, config_1.SECRET);
};
exports.createToken = createToken;
const checkToken = (token) => {
    if (token) {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.SECRET);
        if (decoded) {
            return decoded.id;
        }
    }
    return undefined;
};
exports.checkToken = checkToken;
