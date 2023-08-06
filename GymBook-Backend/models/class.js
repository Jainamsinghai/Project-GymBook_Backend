import mongoose, { Schema } from "mongoose";

//defining schema
const classSchema = new mongoose.Schema({
    classTitle:{type:String, required:true, trim:true},
    description:{type:String, required:true, trim:true},
    time:{type:mongoose.SchemaTypes.Date, required:false, trim:true},
    trainerName:{type:String, required:true, trim:true},
    trainerId:{type: Schema.Types.ObjectId, ref:'user'},
    date:{type:Date, required:false, trim:true},
    memberId:[{type:Schema.Types.ObjectId, ref:'user'}]
})

const classModel = mongoose.model("class",classSchema )

export default classModel;

//userdelete 
//class delete done
//add class done, class booking half done
//mybooking delete from customer