
import express from "express"
import AuthControllers from "../../../interfaceAdapters/controllers/auth"
import AuthInteractor from "../../../useCases/auth"
import Repository from "../../../interfaceAdapters/repository/repo"
import authMiddleware from "../middlewares/authentication"
import isVerified from "../middlewares/isVerified"
import Mailer from "../../services/Mailer"

const authRouter=express.Router()

const repository=new Repository()
const mailer=new Mailer()
const interactor=new AuthInteractor(repository,mailer)
const controller=new AuthControllers(interactor)


authRouter.get('/token-verify',authMiddleware,isVerified,controller.verifyToken.bind(controller))
authRouter.delete('/token',controller.removeToken.bind(controller))
authRouter.post('/otp',controller.otpSignup.bind(controller))
authRouter.post('/otp/signup',authMiddleware,controller.otpValidateSignup.bind(controller))
authRouter.post('/login',controller.Login.bind(controller))
authRouter.post('/logout',controller.Logout.bind(controller))



export default authRouter