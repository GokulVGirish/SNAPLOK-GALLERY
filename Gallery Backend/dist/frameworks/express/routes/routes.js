"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("./auth"));
const photo_1 = __importDefault(require("./photo"));
const profile_1 = __importDefault(require("./profile"));
const routes = (app) => {
    app.use('/api/auth', auth_1.default);
    app.use('/api/photos', photo_1.default);
    app.use('/api/profile', profile_1.default);
};
exports.default = routes;
