"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("../middlewares/authentication"));
const isVerified_1 = __importDefault(require("../middlewares/isVerified"));
const profile_1 = __importDefault(require("../../../interfaceAdapters/controllers/profile"));
const profile_2 = __importDefault(require("../../../useCases/profile"));
const repo_1 = __importDefault(require("../../../interfaceAdapters/repository/repo"));
const profileRouter = express_1.default.Router();
const repository = new repo_1.default();
const interactor = new profile_2.default(repository);
const controller = new profile_1.default(interactor);
profileRouter.get(`/`, authentication_1.default, isVerified_1.default, controller.getProfile.bind(controller));
profileRouter.put(`/`, authentication_1.default, isVerified_1.default, controller.updateProfile.bind(controller));
exports.default = profileRouter;
