"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("./config/index");
const app = express_1.default();
app.get('/', (req, res) => res.send('hello'));
app.listen(index_1.PORT, () => console.log(`Running on port ${index_1.PORT}`));
//# sourceMappingURL=index.js.map