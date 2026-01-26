import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    userCreatore: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    forUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description : {type : String, required : false},
    status : {type : String, required : true, enum : ['pending', 'in-progress', 'completed'], default : 'pending'},
    urgent:{type:Boolean,default:false}

})



const TaskModel = mongoose.model("Task", taskSchema)

export default TaskModel
