import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProject extends Document {
    name: string;
    description?: string;
    ownerId: mongoose.Types.ObjectId;
    status: 'Planning' | 'Active' | 'Completed';
}

const projectSchema = new Schema<IProject>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ['Planning', 'Active', 'Completed'],
            default: 'Planning',
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete (ret as any).__v;
                return ret;
            },
        },
    }
);

const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;
