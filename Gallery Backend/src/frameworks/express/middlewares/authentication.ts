import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

interface CustomJwtPayload extends JwtPayload {
  userId: Types.ObjectId;
  email: string;
  isVerified: boolean;
}
export interface CustomRequest extends Request {
  user: {
    userId: Types.ObjectId;
    email: string;
    isVerified: boolean;
  };
}

const verifyToken = (token: string, type: "access" | "refresh") => {
  try {
    return jwt.verify(
      token,
      type === "access"
        ? (process.env.ACCESS_TOKEN_SECRET as string)
        : (process.env.REFRESH_TOKEN_SECRET as string)
    ) as CustomJwtPayload; 
  } catch (error) {
    return null;
  }
};

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken)
    return res.status(401).json({ message: "No token provided" });
  const decodedAccessToken = verifyToken(accessToken, "access");
  if (decodedAccessToken) {
    (req as CustomRequest).user=decodedAccessToken
    return next();
  }
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "No token provided" });
  const decodedRefreshToken = verifyToken(refreshToken, "refresh");
  if (decodedRefreshToken) {
    const { userId, email, isVerified } =
      decodedRefreshToken as CustomJwtPayload;
    const newAccessToken = jwt.sign(
      { userId, email, isVerified },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "1h" }
    );
    (req as CustomRequest).user = decodedRefreshToken;
    res.cookie("accessToken", newAccessToken, {
      path: "/",
      httpOnly: true,
    });
    return next()
  }
  res.clearCookie("refreshToken")
  res.clearCookie("refreshToken")
   res.status(401).json({ message: "Session expired, please log in again" });
};
export default authMiddleware
