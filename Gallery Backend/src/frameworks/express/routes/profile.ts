import express from "express"
import authMiddleware from "../middlewares/authentication"
import isVerified from "../middlewares/isVerified"
import ProfileControllers from "../../../interfaceAdapters/controllers/profile"
import ProfileInteractors from "../../../useCases/profile"
import Repository from "../../../interfaceAdapters/repository/repo"
import upload from "../../services/multer"
import AwsS3 from "../../services/awsS3"

const profileRouter=express.Router()

const repository=new Repository()
const awsS3=new AwsS3()
const interactor=new ProfileInteractors(repository,awsS3)
const controller=new ProfileControllers(interactor)
profileRouter.get(`/`,authMiddleware,isVerified,controller.getProfile.bind(controller))
profileRouter.put(`/`,authMiddleware,isVerified,controller.updateProfile.bind(controller))
profileRouter.put(`/picture`,authMiddleware,isVerified,upload.single("image"),controller.updateProfilePicture.bind(controller))
export default profileRouter