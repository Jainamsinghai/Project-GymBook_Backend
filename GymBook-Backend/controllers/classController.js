import classModel from "../models/class.js";
import UserModel from "../models/User.js";

class ClassController {
    static addClass = async (req, res) => {
        const currentUser = req.user
        if (currentUser.role === 'admin') {
            const { classTitle, description, trainerName, trainerId, time, date } = req.body;
            if (classTitle && trainerId && description && time && date && trainerName) {
                const classExist = await classModel.findOne({ classTitle: classTitle })
                if (!classExist) {

                    try {
                        const classInput = new classModel({
                            classTitle: classTitle,
                            trainerName: trainerName,
                            trainerId: trainerId,
                            description: description,
                            time: new Date(time),
                            date: new Date(date)
                        });

                        await classInput.save();
                        const savedClass = await classModel.findOne({ classTitle: classTitle });
                        const trainer = await UserModel.findOneAndUpdate({ _id: trainerId }, { $addToSet: { classId: savedClass._id } });
                        trainer.classId.push(savedClass._id)

                        res.send({ status: "success", message: "successfully added class" })
                    } catch (error) {
                        console.error(error)
                        res.send({ status: "failed", message: "failed to add class" })
                    }
                }
                else {
                    res.send({ status: "failed", message: "class already exists" })
                }
            }
            else {
                    res.send({ status: "failed", message: "all fields are required" })
                }
        }
        else {
            res.send({ status: "failed", message: "Not authorized to add the class" })
        }

    }

    static deleteClass = async (req, res) => {
        const currentUser = req.user
        if (currentUser.role === 'admin') {
            const { classTitle, _id} = req.body;
            if (classTitle && _id) {
                const classExist = await classModel.findOne({ _id:_id })
                if (classExist) {
                     try{   
                        const trainer = await UserModel.findOneAndUpdate({ _id:classExist.trainerId }, { $pull: { classId: classExist._id } });
                        trainer.classId.push(classExist._id)
                        classExist.deleteOne();
                        await trainer.save();
                        await classExist.save();
                        console.log(classExist.$isDeleted())
                        res.send({ status: "success", message: "successfully deleted class" })
                    } catch (error) {
                        console.error(error)
                        res.send({ status: "failed", message: "failed to delete class" })
                    }
                }
                else {
                    res.send({ status: "failed", message: "class does not exists" })
                }
            }
            else {
                    res.send({ status: "failed", message: "all fields are required" })
                }
        }
        else {
            res.send({ status: "failed", message: "Not authorized to delete classes" })
        }
    }

    static getAllClass = async (req,res)=>{
        try{
            const currentUser = req.user
            const allClass = await classModel.find({time:{$gt:Date.now()/1000}})
            res.send({status:"succes", message:"all classes successfully fetched", allClass})
        }
        catch(error){
            console.error();
            res.send({status:"failed", message:"classes can not be fetched"})
        }
       
    }

    static registerClasss = async (req,res)=>{
        const currentUser = req.user
        const {_id,classTitle} = req.body
        if(currentUser.role==='customer'){
            if(_id && classTitle){
                const classToBeregistered = await classModel.findById(_id);
                if(classToBeregistered){
                    const isRegistered = classToBeregistered.memberId.findIndex(member => member===currentUser._id)

                    if(isRegistered===-1){
                        try{
                            
                            const userUpdate = await UserModel.findOneAndUpdate({ _id: currentUser._id }, { $addToSet: { bookedClass: classToBeregistered._id } });
                            classToBeregistered.updateOne({ $addToSet: { memberId: userUpdate._id } })
                            await userUpdate.save();
                            await classToBeregistered.save();
                            res.send({status:"success", message:"You have been registered successfully"})
                        }catch(error){
                res.send({status:"failed", message:"Class cannot be registered"})
    
                        }

                    }else{
                res.send({status:"failed", message:"Class already registered"})

                    }
                }else{
            res.send({status:"failed", message:"No such class exist"})
                }
            }else{
            res.send({status:"failed", message:"All fields are required"})
            }
        }else{
            res.send({status:"failed", message:"Unauthorized for registering classes"})
        }
        
    }
   
    static cancelClass = async (req, res) => {
        const currentUser = req.user
        if (currentUser.role === 'customer') {
            const { classTitle, _id} = req.body;
            if (classTitle && _id) {
                const classExist = await classModel.findOne({ _id:_id })
                if (classExist) {
                     try{   
                        const customer = await classModel.findOneAndUpdate({ _id:classExist.customerId }, { $pull: { classId: classExist._id } });

                        res.send({ status: "success", message: "successfully cancel class" })
                    } catch (error) {
                        console.error(error)
                        res.send({ status: "failed", message: "failed to cancel class" })
                    }
                }
                else {
                    res.send({ status: "failed", message: "class does not exists" })
                }
            }
            else {
                    res.send({ status: "failed", message: "all fields are required" })
                }
        }
        else {
            res.send({ status: "failed", message: "Not authorized to delete classes" })
        }
    }


}

export default ClassController;