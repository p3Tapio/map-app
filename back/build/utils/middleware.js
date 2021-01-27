"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unknownEndpoint = void 0;
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' });
    console.error(`Request failed with unknown endpoint error to ${req.path}`);
};
exports.unknownEndpoint = unknownEndpoint;
