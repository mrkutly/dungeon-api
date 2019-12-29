"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpErrors_1 = require("../utils/httpErrors");
const Logger_1 = __importDefault(require("../utils/Logger"));
exports.notFoundError = () => {
    throw new httpErrors_1.HTTP404Error("Method not found.");
};
exports.clientError = (err, res, next) => {
    if (err instanceof httpErrors_1.HTTPClientError) {
        Logger_1.default.warn(`api.request.error.client - ${err}`);
        res.status(err.statusCode).send(err.message);
    }
    else {
        next(err);
    }
};
exports.serverError = (err, res, next) => {
    Logger_1.default.warn(`api.request.error.server - ${err}`);
    if (process.env.NODE_ENV === "production") {
        res.status(500).send("Internal Server Error");
    }
    else {
        res.status(500).send(err.stack);
    }
};
//# sourceMappingURL=ErrorHandler.js.map