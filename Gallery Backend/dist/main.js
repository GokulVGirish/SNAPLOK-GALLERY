"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./frameworks/Db/db"));
const app_1 = __importDefault(require("./frameworks/express/app"));
(0, db_1.default)();
app_1.default.listen(4000, () => {
    console.log("server listening");
});
