import {Request,Response,NextFunction} from "express"

const errorHandler=(error:any,req:Request,res:Response,next:NextFunction)=>{
  console.log("error",error)

    const statusCode=error.statusCode||500
    res.status(statusCode).json({
      message: error.message || "An unexpected error occurred",
    });



}
export default errorHandler