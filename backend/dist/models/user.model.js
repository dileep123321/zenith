"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../types/user");
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator_1.default.isEmail(value)) {
                throw new Error('Invalid email');
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value) {
            if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                throw new Error('Password must contain at least one letter and one number');
            }
        },
    },
    role: {
        type: String,
        enum: Object.values(user_1.UserRole),
        default: user_1.UserRole.USER,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    refreshTokenVersion: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            if (ret.password)
                delete ret.password;
            delete ret.__v;
            return ret;
        },
    },
});
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};
userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    if (!user.password)
        return false;
    return bcrypt_1.default.compare(password, user.password);
};
userSchema.pre('save', async function () {
    const user = this;
    if (user.isModified('password') && user.password) {
        user.password = await bcrypt_1.default.hash(user.password, 8);
    }
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
