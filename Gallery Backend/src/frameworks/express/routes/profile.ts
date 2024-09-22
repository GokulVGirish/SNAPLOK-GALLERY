import express from "express"
import authMiddleware from "../middlewares/authentication"
import isVerified from "../middlewares/isVerified"
import ProfileControllers from "../../../interfaceAdapters/controllers/profile"
import ProfileInteractors from "../../../useCases/profile"
import Repository from "../../../interfaceAdapters/repository/repo"

const profileRouter=express.Router()

const repository=new Repository()
const interactor=new ProfileInteractors(repository)
const controller=new ProfileControllers(interactor)
profileRouter.get(`/`,authMiddleware,isVerified,controller.getProfile.bind(controller))
profileRouter.put(`/`,authMiddleware,isVerified,controller.updateProfile.bind(controller))
export default profileRouter