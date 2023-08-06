import express from "express";
import ClassController from "../controllers/classController.js";
const router = express.Router();
import UserController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";



//route level middleware
router.use('/addclass',checkUserAuth)
router.use('/changepassword', checkUserAuth)
router.use('/loggeduser',checkUserAuth)
router.use('/register',checkUserAuth)
router.use('/feedback', checkUserAuth)
router.use('/getalluser', checkUserAuth)
router.use('/deleteclass', checkUserAuth)
router.use('/getallclass', checkUserAuth)
router.use('/registerclass', checkUserAuth)
router.use('/deleteuser', checkUserAuth)

//public routes
router.post('/login', UserController.userLogin);

//private routes 

router.post('/register', UserController.userRegistration);
router.get('/getalluser', UserController.getAllUsers)
router.post('/changepassword', UserController.changePassword )
router.get('/loggeduser', UserController.loggedUser)
router.post('/feedback', UserController.createUserFeedBack);
router.get('/feedback', UserController.getUserFeedBack);
router.post('/addclass', ClassController.addClass)
router.post('/deleteclass', ClassController.deleteClass)
router.get('/getallclass', ClassController.getAllClass);
router.post('/registerclass', ClassController.registerClasss)
router.delete('/deleteuser', UserController.DeleteUserById)


export default router;