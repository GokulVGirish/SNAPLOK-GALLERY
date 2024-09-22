import IPhotoManagementInteractor from "../../entities/iUseCases/iPhoto";
import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../../frameworks/express/middlewares/authentication";

class PhotoManagementControllers {
  constructor(private readonly Interactor: IPhotoManagementInteractor) {}
  async photoUpload(req: Request, res: Response, next: NextFunction) {
    try {
      const email = (req as CustomRequest).user.email;
      const response = await this.Interactor.uploadPhotos(
        email,
        req.files as Express.Multer.File[]
      );
      if (response)
        return res
          .status(201)
          .json({ success: true, message: "Sucessfully Added" });
      res.status(500).json({ success: false, message: "Something Went Wrong" });
    } catch (error) {
      next(error);
    }
  }
  async getPhotos(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as CustomRequest).user.userId;
      const response = await this.Interactor.fetchPhotos(userId);
      if (response.success)
        return res.status(200).json({
          success: true,
          message: response.message,
          images: response.images,
        });
      res.status(404).json({ success: false, message: response.message });
    } catch (error) {
      next(error);
    }
  }
  async changePhotosOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as CustomRequest).user.userId;
      const response = await this.Interactor.changePhotoOrder(
        userId,
        req.body.images
      );
      if (response) res.status(200).json({ message: "Success" });
    } catch (error) {
      next(error);
    }
  }
  async photoTitleEdit(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as CustomRequest).user.userId;
      const imgId = req.params.imgId;
      const newTitle = req.body.title;
      const response = await this.Interactor.photoTitleEdit(userId,imgId,newTitle);
      if(response) return res.status(200).json({success:true})
        res.status(500).json({success:false})
    } catch (error) {
      next(error);
    }
  }
}
export default PhotoManagementControllers;
