"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const validate_1 = __importDefault(require("../middleware/validate"));
const project_validator_1 = __importDefault(require("../validators/project.validator"));
const project_controller_1 = __importDefault(require("../controllers/project.controller"));
const router = express_1.default.Router();
router
    .route('/')
    .post((0, auth_1.default)(), (0, validate_1.default)(project_validator_1.default.createProject), project_controller_1.default.createProject)
    .get((0, auth_1.default)(), (0, validate_1.default)(project_validator_1.default.getProjects), project_controller_1.default.getProjects);
router
    .route('/:projectId')
    .get((0, auth_1.default)(), (0, validate_1.default)(project_validator_1.default.getProject), project_controller_1.default.getProject)
    .patch((0, auth_1.default)(), (0, validate_1.default)(project_validator_1.default.updateProject), project_controller_1.default.updateProject)
    .delete((0, auth_1.default)(), (0, validate_1.default)(project_validator_1.default.deleteProject), project_controller_1.default.deleteProject);
exports.default = router;
