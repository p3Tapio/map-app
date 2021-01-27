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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const checks_1 = require("../utils/checks");
const tokens_1 = require("../utils/tokens");
const userModel_1 = __importDefault(require("../models/userModel"));
const router = express_1.default.Router();
router.post('/register', (req, res) => {
    try {
        const newUser = checks_1.checkUserValues(req.body);
        const { username, password } = newUser;
        const hashed = bcryptjs_1.default.hashSync(password, 10);
        const user = new userModel_1.default({
            _id: new mongoose_1.default.Types.ObjectId,
            username, password: hashed
        });
        user.save().then((result) => {
            const token = tokens_1.createToken(result.username, result.id);
            res.json({ id: result.id, username: result.username, token: token });
        }).catch((e) => {
            const errMsg = e.message;
            res.status(400).json({ error: errMsg });
        });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = checks_1.checkUserValues(req.body);
        const user = yield userModel_1.default.findOne({ username: body.username });
        const passCorrect = user === null ? false : yield bcryptjs_1.default.compare(body.password, user.password);
        if (passCorrect) {
            const token = tokens_1.createToken(user.username, user._id.toString());
            res.json({ id: user.id, username: user.username, token: token });
        }
        else
            res.status(401).json({ error: 'wrong username or password' });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
exports.default = router;
