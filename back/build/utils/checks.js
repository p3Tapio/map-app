"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUpdatedValues = exports.checkNewLocationValues = exports.checkUserValues = void 0;
const types_1 = require("./types");
const isString = (text) => typeof text === 'string' || text instanceof String;
const isNumeric = (no) => !isNaN(Number(no));
const isCategory = (cat) => Object.values(types_1.Category).includes(cat);
function parseInputString(input) {
    if (!input || !isString(input)) {
        throw new Error('input missing or in wrong format');
    }
    return input;
}
const parseInputNumber = (input) => {
    if (!input || !isNumeric(input)) {
        throw new Error('input missing or in wrong format');
    }
    return input;
};
const parseCategory = (input) => {
    if (!input || !isCategory(input)) {
        throw new Error('input missing or in wrong format');
    }
    return input;
};
const parseImageLink = (input) => {
    if (!input) {
        return undefined;
    }
    else if (!isString(input)) {
        throw new Error('input in wrong format');
    }
    return input;
};
const parseCoordinates = (input) => {
    if (!input)
        throw new Error('input missing or in wrong format');
    const coordinates = {
        lat: parseInputNumber(input.lat),
        lng: parseInputNumber(input.lng),
    };
    return coordinates;
};
const parseId = (input) => {
    if (!input) {
        throw new Error('input missing or in wrong format');
    }
    return input;
};
const parseUser = (input) => {
    if (!input) {
        throw new Error('input missing or in wrong format');
    }
    return input;
};
const checkUserValues = (object) => {
    const newUser = {
        username: parseInputString(object.username),
        password: parseInputString(object.password),
    };
    return newUser;
};
exports.checkUserValues = checkUserValues;
const checkNewLocationValues = (object) => {
    const newLocation = {
        name: parseInputString(object.name),
        address: parseInputString(object.address),
        coordinates: parseCoordinates(object.coordinates),
        description: parseInputString(object.description),
        category: parseCategory(object.category),
        imageLink: parseImageLink(object.imageLink)
    };
    return newLocation;
};
exports.checkNewLocationValues = checkNewLocationValues;
const checkUpdatedValues = (object) => {
    const updated = {
        _id: parseId(object._id),
        name: parseInputString(object.name),
        address: parseInputString(object.address),
        coordinates: parseCoordinates(object.coordinates),
        description: parseInputString(object.description),
        category: parseCategory(object.category),
        imageLink: parseImageLink(object.imageLink),
        createdBy: parseUser(object.createdBy),
    };
    return updated;
};
exports.checkUpdatedValues = checkUpdatedValues;
