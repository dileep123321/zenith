import mongoose, { Document, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { UserRole } from '../types/user';

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role: UserRole;
    isEmailVerified: boolean;
    refreshTokenVersion: number;
    isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUser> {
    isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser, IUserModel>(
    {
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
            validate(value: string) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email');
                }
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
            validate(value: string) {
                if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                    throw new Error('Password must contain at least one letter and one number');
                }
            },
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        refreshTokenVersion: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                if (ret.password) delete (ret as any).password;
                delete (ret as any).__v;
                return ret;
            },
        },
    }
);

userSchema.statics.isEmailTaken = async function (email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean> {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

userSchema.methods.isPasswordMatch = async function (password: string): Promise<boolean> {
    const user = this;
    if (!user.password) return false;
    return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function () {
    const user = this as IUser;
    if (user.isModified('password') && user.password) {
        user.password = await bcrypt.hash(user.password, 8);
    }
});

const User = mongoose.model<IUser, IUserModel>('User', userSchema);

export default User;
