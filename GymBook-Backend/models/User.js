import mongoose, { Schema } from "mongoose";

//defining schema
const userSchema = new mongoose.Schema({
    name:{type:String, required:true, trim:true},
    email:{type:String, required:true, trim:true},
    mobileNo:{type:Number, required:true, trim:true},
    address:{type:String, required:true, trim:true},
    password:{type:String, required:true, trim:true},
    role:{type:String, required:true,trim:true },
    gymPlan:{type:String, required:false, trim:true},//customer
    classId:{type:Array, required:false, ref:'class'},//for trainer
    salary:{type:Number, required:false, trim:true},//for trainer
    bookedClass:[{type:Schema.Types.ObjectId, ref:'class'}]
})

const UserModel = mongoose.model("user",userSchema )

export default UserModel;