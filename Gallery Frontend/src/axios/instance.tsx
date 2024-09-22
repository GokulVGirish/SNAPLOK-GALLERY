import axios from "axios";
import { toast } from "sonner";
import { clearUser } from "../assets/redux/userSlice";

const API_URL = import.meta.env.VITE_BASE_URL;

let modifiedDispatch:any
export const setMyDispatch=(dispatch:any)=>{
  modifiedDispatch=dispatch

}

const instance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});
instance.defaults.withCredentials = true;

instance.interceptors.response.use(
  (Response) => {
   if (
     Response.data.success &&
     Response.data.message === "Valid Token" &&
     ["/login", "/signup", "/otp/verify"].includes(window.location.pathname)
   ) {
     window.location.href = "/";
   }
    return Response;
  },
  async (e) => {
    if (e.response && e.response.status === 401) {
      modifiedDispatch(clearUser)
      console.log("responsemess", e.response.data.message);

      if (e.response.data.message === "otp not verified") {
        if (window.location.pathname === "/otp/verify") return;
        return toast.error("Verify Otp", {
          richColors: true,
          duration: 1000,
          onAutoClose: () => {
            return (window.location.href = "/otp/verify");
          },
        });
      } else if (
        e.response.data.message ===
        ("Session expired, please log in again" || "Try Signing Up Again")
      ) {
        await instance.delete("/auth/token");
        return toast.error(e.response.data.message, {
          richColors: true,
          duration: 1000,
          onAutoClose: () => {
            return (window.location.href = "/login");
          },
        });
      }

      if (
        e.response.data.message === "No token provided" &&
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/signup"
      ) {
        console.log("innnnheree");
        return (window.location.href = "/login");
      }
    }
    return Promise.reject(e);
  }
);

export default instance;
