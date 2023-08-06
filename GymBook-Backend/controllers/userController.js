import UserModel from "../models/User.js";
import FeedbackModel from "../models/feedback.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

class UserController{
    
    static userRegistration = async (req,res)=>{

        const admin = req.user;
        if(0){
            res.send({status:"failed", message:"only admin can add members"})
        }else{
        const {name, email,mobileNo,address, password,role,gymPlan,salary} = req.body;
        const user = await UserModel.findOne({email:email});
        if(user){
            res.send({status:"failed", message:"Already registered with this email"})
        }else{
            if(name && email && mobileNo && address && password && role ){
                    try {
                        const salt = await bcrypt.genSalt(12)
                        const hashedPassword = await bcrypt.hash(password,salt);
                        const userInput = new UserModel({
                            name:name,
                            email:email,
                            mobileNo:mobileNo,
                            address:address,
                            role:role,
                            password:hashedPassword,
                            gymPlan:gymPlan,
                            salary:salary
                        })
                        await userInput.save()
                        //accessing  the data if the current registration was succesful 
                        const savedUser= await UserModel.findOne({email:email});
                        //generating token for the registered user
                        console.log(savedUser);
                        const token = jwt.sign({userID:savedUser._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'})
                        

                        res.send({status:'success',message:"successfully registered", "token":token})
                    } catch (error) {
                        console.log(error)
                        res.send({status:'failed', message:"Failed to register"})
                    }
            }else{
                console.log(name,email)
                res.send({status:"failed", message:"All the fields are required"})
            }

        }}
    }

    static userLogin  = async (req,res)=>{
        const {email, password} = req.body;
        try {
            if(email && password){
                const user = await UserModel.findOne({email});
                if(user){
                    const isMatch = await bcrypt.compare(password, user.password);
                    if((user.email === email) && isMatch ){
                        const token  = jwt.sign({userID: user._id}, process.env.JWT_SECRET_KEY, {expiresIn:'5d'});
                        res.send({status: "success", message:"Login Successful", "token":token});
                        
                    }else{
                        res.send({status: "failed", message:"wrong email or password, try again"})
                    }
                    
                }else{
                    res.send({status: "failed", message:"user not registered"})
                }
            }else{
                res.send({status: "failed", message:"all fields are required"})
            }
        } catch (error) {
            console.log(error);
            res.send({status: "failed", message:"login failed"})
        }
    }

    static getUserFeedBack = async (req,res)=>{
        const {userId} = req.user._id;
        try {
            if(!userId){
                return res.send({status: "failed", message:"Please provide user id."})
            }
            const user = await UserModel.findOne({_id:userId});
            if(!user){
                return res.send({status: "failed", message:"Invalid User Id."})
            }
            const feedBack = await FeedbackModel.findOne({userId});
            return res.send({status: "success", message:"Success", data : feedBack});

            
        } catch (error) {
            console.log(error);
            res.send({status: "failed", message:"Internal server error, please try after sometime."}) 
        }
    }

    static createUserFeedBack = async (req,res)=>{
        const {feedBack} = req.body;
        const userId = req.user._id;
    

        try {
            if(!userId){
                return res.send({status: "failed", message:"Please provide user id."})
            }
            const user = await UserModel.findOne({_id:userId});
            if(!user){
                return res.send({status: "failed", message:"Invalid User Id."})
            }

            const feedBackData = await feedBack.findOne({_id:userId});
            if(!feedBackData){
                return res.send({status: "failed", message:"feedBack Already Submitted."})
            }

            const feedbackInput = new FeedbackModel({
                userId,
                feedBack
                
            })
            await feedbackInput.save()
            return res.send({status: "success", message:"Success", });

        } catch (error) {
            console.log(error);
            res.send({status: "failed", message:"Internal server error, please try after sometime."}) 
        }
    }
    static changePassword = async (req, res) => {
        const { password, confirmPassword } = req.body
        if (password && confirmPassword) {
            if (password !== confirmPassword) {
                res.send({ status: "failed", message: "Password and confirm password do not match" })

            } else {
                const salt = await bcrypt.genSalt(12)
                const newHashedPassword = await bcrypt.hash(password, salt);
                await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashedPassword } })
            } res.send({ status: "success", message: "password changed successfully" })
        } else {
            res.send({ status: "failed", message: "Both fields are required" })
        }
    }

    static loggedUser = async (req, res) => {
        res.send({ "user": req.user });
    }

    static getAllUsers= async (req,res)=>{
        if(req.user.role === 'admin'){
        const allUser = await UserModel.find({role:{$ne:'admin'}}).select('-password -feedback -__v')
        res.send({allUser, status:"success", message:"users data fetched"} )}
        else{
            res.send({"status":"failed", message:"Unauthorized user"})
        }
    }
     static  DeleteUserById= async (request , response)=>{
        try {
            if(req.user.role === 'admin'){
                await  UserModel.findByIdAndRemove(request.body.id);
                // response.status(StatusCodes.NO_CONTENT).json();
                
                return response.send({status: "Success", message:"user deleted successfully."})
            }
            else{
                    res.send({"status":"failed", message:"Unauthorized user"})
                }
              

        } catch (error) {
            console.log(error);
            return response.send({status: "failed", message:"invalid ID"})
        }
    }
}
 
export default UserController;