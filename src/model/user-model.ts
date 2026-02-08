import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    family: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    level: { type: String, enum: ['senior', 'midlevel', 'junior'], default: 'junior' },
    githubId: { type: String, unique: true, sparse: true },
    githubUsername: { type: String },
    profilePicture: { type: String },
    authProvider: { type: String, enum: ['local', 'github'], default: 'local' }
})

const UserModel = mongoose.model("User", userSchema)

export default UserModel
