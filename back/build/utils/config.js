"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET = exports.PORT = exports.MONGODB_URI = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: '.env' });
const { SECRET } = process.env;
exports.SECRET = SECRET;
const PORT = process.env.PORT || 3001;
exports.PORT = PORT;
let MONGODB_URI = process.env.MONGODB_URI;
exports.MONGODB_URI = MONGODB_URI;
if (process.env.NODE_ENV === 'test') {
    exports.MONGODB_URI = MONGODB_URI = process.env.TEST_MONGODB_URI;
}
