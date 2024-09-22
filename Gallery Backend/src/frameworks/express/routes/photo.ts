import express from "express"
import authMiddleware from "../middlewares/authentication"
import isVerified from "../middlewares/isVerified"
import PhotoManagementControllers from "../../../interfaceAdapters/controllers/photo"
import PhotoManagementInteractor from "../../../useCases/photo"
import Repository from "../../../interfaceAdapters/repository/repo"
import AwsS3 from "../../services/awsS3"
import upload from "../../services/Multer"

const photoRouter=express.Router()

const awsS3=new AwsS3()
const repository=new Repository()
const interactor=new PhotoManagementInteractor(repository,awsS3)
const controller=new PhotoManagementControllers(interactor)

photoRouter.post('/',authMiddleware,isVerified,upload.array("photos"),controller.photoUpload.bind(controller))
photoRouter.get('/',authMiddleware,isVerified,controller.getPhotos.bind(controller))
photoRouter.put('/',authMiddleware,isVerified,controller.changePhotosOrder.bind(controller))
photoRouter.put('/edit/:imgId',authMiddleware,isVerified,controller.photoTitleEdit.bind(controller))


export default photoRouter