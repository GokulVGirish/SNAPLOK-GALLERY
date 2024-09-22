import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import instance from "../axios/instance";
import Spinner from "./Spinner";
import logo from "@/assets/logo.png";
import { addUser } from "../assets/redux/userSlice";
import { useAppDispatch } from "../assets/redux/store";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch=useAppDispatch()
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      return toast.error("Enter Email", { richColors: true, duration: 1500 });
    } else if (!emailRegex.test(email)) {
      return toast.error("Enter Valid Email", {
        richColors: true,
        duration: 1500,
      });
    }
    if (!password.trim()) {
      return toast.error("Enter Password", {
        richColors: true,
        duration: 1500,
      });
    }

    try {
      setLoading(true);
      const response = await instance.post("/auth/login", {
        email: email,
        password: password,
      });
      if (response.data.success) {
        console.log("response",response)      
            dispatch(
            addUser({ user: response.data.user, img: response.data.img })
          );
        return toast.success(response.data.message,{richColors:true,duration:1200,onAutoClose:()=>navigate("/")})}
    } catch (error) {
      
      if (error instanceof AxiosError && error.response?.status !== 401) {
        toast.error(error.response?.data.message, {
          richColors: true,
          duration: 1300,
        });
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className=" min-h-screen flex box-border justify-center items-center">
      <div className="bg-[#dfa674] rounded-2xl flex max-w-3xl p-5 items-center">
        <div className="md:w-1/2 px-8">
          <h2 className="font-bold text-3xl text-[#002D74] flex items-center flex-col"><img className="h-20" src={logo} alt="logo"/>Login</h2>
          <p className="text-sm mt-4 text-[#002D74]">
            If you already a member, easily log in now.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              className="p-2 mt-8 rounded-xl border"
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <input
                className="p-2 rounded-xl border w-full"
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="gray"
                id="togglePassword"
                className={`bi bi-eye absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer z-20 opacity-100 ${
                  showPassword ? "hidden" : "block"
                }`}
                viewBox="0 0 16 16"
                onClick={handleTogglePassword}
              >
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className={`bi bi-eye-slash-fill absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer ${
                  showPassword ? "block" : "hidden"
                }`}
                id="mama"
                viewBox="0 0 16 16"
                onClick={handleTogglePassword}
              >
                <path d="M10.79 12.912L9.176 11.298A3.5 3.5 0 0 1 4.7 6.824L2.639 4.764C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.089A7.028 7.028 0 0 1 8 2.5C13 2.5 16 8 16 8s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708l-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6L1.707 1.707l.707-.707 12 12-.707.707z" />
              </svg>
            </div>
            <button
              className="bg-[#002D74] text-white py-2 rounded-xl hover:scale-105 duration-300 hover:bg-[#206ab1] font-medium"
              type="submit"
            >
              Login
            </button>
          </form>

          <p className="mt-5 text-xs text-[#002D74]">Forgot your password?</p>
          <div className="flex justify-between items-center mt-3 text-xs text-[#002D74]">
            <p>Don’t have an account?</p>
            <button
              onClick={() => navigate("/signup")}
              className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300 hover:bg-[#6dc1c64f]"
            >
              Register
            </button>
          </div>
        </div>

        <div className="w-1/2 hidden md:block">
          <img
            className="rounded-2xl"
            src="https://media.takealot.com/covers_images/0a0173183a9644e7966ebb232fa8951b/s-pdpxl.file"
            alt="Login illustration"
          />
        </div>
      </div>
      {loading && <Spinner />}
    </section>
  );
};
export default Login;
