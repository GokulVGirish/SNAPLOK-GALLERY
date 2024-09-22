import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import routes from "./routes/routes"
import errorHandler from "./middlewares/errorHandler"

dotenv.config()


const app=express()
app.use(cookieParser())
app.use(express.json({limit:"10mb"}))
app.use(express.urlencoded({extended:true,limit:"10mb"}))
app.use(
  cors({
    origin: process.env.Origin,
    methods: "GET,POST,PUT,DELETE,OPTIONS,PATCH",
    allowedHeaders:"Content-Type,Authorization",
    credentials:true
  })
);

routes(app)
app.use(errorHandler)



export default app


