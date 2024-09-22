
import express from "express"
import AuthControllers from "../../../interfaceAdapters/controllers/auth"
import AuthInteractor from "../../../useCases/auth"
import Repository from "../../../interfaceAdapters/repository/repo"
import authMiddleware from "../middlewares/authentication"
import isVerified from "../middlewares/isVerified"
import Mailer from "../../services/Mailer"
import AwsS3 from "../../services/awsS3"

const authRouter=express.Router()

const repository=new Repository()
const mailer=new Mailer()
const awsS3=new AwsS3()
const interactor=new AuthInteractor(repository,mailer,awsS3)
const controller=new AuthControllers(interactor)


authRouter.get('/token-verify',authMiddleware,isVerified,controller.verifyToken.bind(controller))
authRouter.delete('/token',controller.removeToken.bind(controller))
authRouter.post('/otp',controller.otpSignup.bind(controller))
authRouter.post('/otp/signup',authMiddleware,controller.otpValidateSignup.bind(controller))
authRouter.post('/password/reset-request',controller.PasswordResetLink.bind(controller));
authRouter.post("/password/reset/:token",controller.resetPassword.bind(controller));
authRouter.post('/login',controller.login.bind(controller))
authRouter.post('/logout',controller.logout.bind(controller))



export default authRouter