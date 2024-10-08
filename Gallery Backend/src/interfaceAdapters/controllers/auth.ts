import IAuthInteractor from "../../entities/iUseCases/iauth";
import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../../frameworks/express/middlewares/authentication";

class AuthControllers {
  constructor(private readonly Interactor: IAuthInteractor) {}
  async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({ success: true, message: "Valid Token" });
    } catch (error) {
      next(error);
    }
  }
  async removeToken(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(200).json({ success: true });
    } catch (error) {
      throw error;
    }
  }

  async otpSignup(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("request body", req.body);
      const response = await this.Interactor.otpSignup(req.body);
      if (response.status) {
        res.cookie("accessToken", response.token, { httpOnly: true });
        return res
          .status(201)
          .json({ success: true, message: response.message });
      }
      switch (response.errorCode) {
        case "Already_Exist":
          return res
            .status(409)
            .json({ success: false, message: response.message });
        default:
          return res
            .status(500)
            .json({ success: false, message: response.message });
      }
    } catch (error) {
      next(error);
    }
  }
  async otpValidateSignup(req: Request, res: Response, next: NextFunction) {
    try {
      const otp = req.body.otp;
      const email = (req as CustomRequest).user.email;
      const response = await this.Interactor.otpValidateSignup(email, otp);
      if (response.status) {
        res.cookie("accessToken", response.access);
        res.cookie("refreshToken", response.refresh);
        return res
          .status(201)
          .json({ success: true, message: response.message,user:response.user });
      }
      switch (response.errorCode) {
        case "Invalid_User":
          return res
            .status(401)
            .json({ success: false, message: response.message });
        case "Expired":
          return res
            .status(400)
            .json({ success: false, message: response.message });
        case "Wrong":
          return res
            .status(500)
            .json({ success: false, message: response.message });
        default:
          return res
            .status(500)
            .json({ success: false, message: response.message });
      }
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.Interactor.Login(req.body);

      if (response.status) {
        res.cookie("accessToken", response.access);
        res.cookie("refreshToken", response.refresh);
        return res
          .status(200)
          .json({ success: true, message: response.message,img:response.img ,user:response.user});
      }
      switch (response.errorCode) {
        case "No_User":
          return res
            .status(404)
            .json({ success: false, message: response.message });
        case "Wrong_Pass":
          return res
            .status(403)
            .json({ success: false, message: response.message });
      }
    } catch (error) {
      next(error);
    }
  }
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }
  async PasswordResetLink(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;
      const response = await this.Interactor.passwordResetLink(email);

      if (response)
        return res
          .status(200)
          .json({ success: true, message: "Sucessfully Sent" });
      res
        .status(500)
        .json({ success: false, message: "Error sending Reset Link" });
    } catch (error) {
      next(error);
    }
  }
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const token=req.params.token
      const password=req.body.password
      const response=await this.Interactor.resetPassword(token,password)
      if(response.status) return res.status(200).json({success:true,message:response.message})
        switch (response.errorCode) {
          case "USER_NOT_FOUND":return res.status(404).json({success:false,message:response.message})
          case "LINK_EXPIRED":return res.status(403).json({success:false,message:response.message})
          default:return res
            .status(500)
            .json({ success: false, message: response.message });
        }

    } catch (error) {
      next(error);
    }
  }
}
export default AuthControllers;
