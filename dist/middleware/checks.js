"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpErrors_1 = require("../utils/httpErrors");
exports.checkSignupParams = (req, res, next) => {
    const requiredParams = ['email', 'password'];
    const presentParams = Object.keys(req.body);
    const missingParams = requiredParams.filter(param => !presentParams.includes(param));
    if (missingParams.length > 0) {
        throw new httpErrors_1.HTTP400Error(`Missing required parameters: ${missingParams.join(', ')}`);
    }
    else {
        next();
    }
};
//# sourceMappingURL=checks.js.map