"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = __importDefault(require("../middleware/validate"));
const auth_validator_1 = __importDefault(require("../validators/auth.validator"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const router = express_1.default.Router();
router.post('/register', (0, validate_1.default)(auth_validator_1.default.register), auth_controller_1.default.register);
router.post('/login', (0, validate_1.default)(auth_validator_1.default.login), auth_controller_1.default.login);
router.post('/logout', (0, validate_1.default)(auth_validator_1.default.logout), auth_controller_1.default.logout);
router.post('/refresh-tokens', (0, validate_1.default)(auth_validator_1.default.refreshTokens), auth_controller_1.default.refreshTokens);
exports.default = router;
