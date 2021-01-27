"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./utils/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const middleware_1 = require("./utils/middleware");
const testingRoute_1 = __importDefault(require("./routes/testingRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const locationRoute_1 = __importDefault(require("./routes/locationRoute"));
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.static('build'));
mongoose_1.default.connect(config_1.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => console.log('Connected to MongoDB: ', config_1.MONGODB_URI))
    .catch((error) => console.error('Failed to connect: ', error));
app.use(express_1.default.json());
app.use('/api/user', userRoute_1.default);
app.use('/api/location', locationRoute_1.default);
if (process.env.NODE_ENV === 'test') {
    app.use('/api/testing', testingRoute_1.default);
}
app.use(middleware_1.unknownEndpoint);
exports.default = app;
