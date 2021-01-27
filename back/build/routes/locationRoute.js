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
const mongoose_1 = __importDefault(require("mongoose"));
const locationModel_1 = __importDefault(require("../models/locationModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const checks_1 = require("../utils/checks");
const tokens_1 = require("../utils/tokens");
const router = express_1.default.Router();
router.get('/all', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const locations = yield locationModel_1.default.find({});
    res.json(locations);
}));
router.get('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.header('token') && tokens_1.checkToken(req.header('token'))) {
            const userId = tokens_1.checkToken(req.header('token'));
            const locsinDb = yield locationModel_1.default.find({});
            const locations = locsinDb.filter(x => x.createdBy.toString() === userId);
            res.json(locations);
        }
        else {
            res.status(401).json({ error: 'unauthorized' });
        }
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
router.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.header('token')) {
            const userId = tokens_1.checkToken(req.header('token'));
            const newLocation = checks_1.checkNewLocationValues(req.body);
            const user = yield userModel_1.default.findById(userId);
            const location = new locationModel_1.default({
                _id: new mongoose_1.default.Types.ObjectId,
                name: newLocation.name,
                address: newLocation.address,
                coordinates: {
                    lat: newLocation.coordinates.lat,
                    lng: newLocation.coordinates.lng,
                },
                description: newLocation.description,
                category: newLocation.category,
                imageLink: newLocation.imageLink ? newLocation.imageLink : '-',
                createdBy: userId
            });
            const savedLocation = yield location.save();
            user.locations = user.locations.concat(savedLocation);
            yield user.save();
            res.status(200).json(savedLocation);
        }
        else
            throw new Error('No token');
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
router.put('/update/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.header('token') && tokens_1.checkToken(req.header('token'))) {
            const userId = tokens_1.checkToken(req.header('token'));
            const body = checks_1.checkUpdatedValues(req.body);
            const location = yield locationModel_1.default.findById(req.params.id);
            if (!location)
                throw new Error('No location found');
            else if (location.createdBy.toString() === userId) {
                const updated = yield locationModel_1.default.findByIdAndUpdate({ _id: req.params.id }, body, { new: true });
                res.json(updated);
            }
            else
                res.status(401).send({ error: 'unauthorized' });
        }
        else
            throw new Error('No token');
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
router.delete('/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.header('token') && tokens_1.checkToken(req.header('token'))) {
            const userId = tokens_1.checkToken(req.header('token'));
            const location = yield locationModel_1.default.findById(req.params.id);
            if (!location)
                throw new Error('No location found');
            if (location.createdBy.toString() === userId) {
                yield locationModel_1.default.findOneAndRemove({ _id: req.params.id });
                res.status(204).end();
                return;
            }
        }
        res.status(401).send({ error: 'unauthorized' });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
exports.default = router;
