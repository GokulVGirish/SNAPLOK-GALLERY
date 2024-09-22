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
const multer_1 = __importDefault(require("../../services/multer"));
const awsS3_1 = __importDefault(require("../../services/awsS3"));
const profileRouter = express_1.default.Router();
const repository = new repo_1.default();
const awsS3 = new awsS3_1.default();
const interactor = new profile_2.default(repository, awsS3);
const controller = new profile_1.default(interactor);
profileRouter.get(`/`, authentication_1.default, isVerified_1.default, controller.getProfile.bind(controller));
profileRouter.put(`/`, authentication_1.default, isVerified_1.default, controller.updateProfile.bind(controller));
profileRouter.put(`/picture`, authentication_1.default, isVerified_1.default, multer_1.default.single("image"), controller.updateProfilePicture.bind(controller));
exports.default = profileRouter;
