import { Application } from "express";
import authRouter from "./auth";
import photoRouter from "./photo";
import profileRouter from "./profile";


const routes:Function=(app:Application)=>{

    app.use('/api/auth',authRouter)
    app.use('/api/photos',photoRouter)
    app.use('/api/profile',profileRouter)

}
export default routes