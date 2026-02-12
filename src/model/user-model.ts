import mongoose from "mongoose";

interface UserInterface extends Document {
    name: string,
    family: string,
    email: string,
    password: string,
    level: 'senior' | 'midlevel' | 'junior',
    githubId: string,
    githubUsername: string,
    authProvider: 'local' | 'github'
}

const userSchema = new mongoose.Schema<UserInterface>({
    name: { type: String, required: true },
    family: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    level: { type: String, enum: ['senior', 'midlevel', 'junior'], default: 'junior' },
    githubId: { type: String, unique: true, sparse: true },
    githubUsername: { type: String },
    authProvider: { type: String, enum: ['local', 'github'], default: 'local' }
}, { timestamps: true })

const UserModel = mongoose.model<UserInterface>("User", userSchema)

export default UserModel
