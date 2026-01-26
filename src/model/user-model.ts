import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    family: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    age: {type: String }
})

const UserModel = mongoose.model("User",userSchema)

export default UserModel
