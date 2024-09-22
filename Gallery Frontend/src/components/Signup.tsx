import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import instance from "../axios/instance";
import Spinner from "./Spinner";
import logo from "@/assets/logo.png";

const Signup = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    cPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading,setLoading]=useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!userData.firstName.trim()) {
      return toast.error("First name is required", {
        richColors: true,
        duration: 1500,
      });
    } else if (!userData.firstName || !/^[A-Za-z]+$/.test(userData.firstName)) {
      toast.error("First name should only contain alphabetic characters.", {
        richColors: true,
        duration: 1500,
      });
      return;
    }
    if (!userData.lastName.trim()) {
      return toast.error("Last name is required", {
        richColors: true,
        duration: 1500,
      });
    } else if (!userData.lastName || !/^[A-Za-z]+$/.test(userData.lastName)) {
      toast.error("Last name should only contain alphabetic characters.", {
        richColors: true,
        duration: 1500,
      });
      return;
    }

    if (!emailRegex.test(userData.email)) {
      toast.error("Invalid email address.", {
        richColors: true,
        duration: 1500,
      });
      return;
    }

    if (!userData.password.trim()) {
      toast.error("Password is required", { richColors: true, duration: 1500 });
      return;
    } else if (!passwordRegex.test(userData.password)) {
      toast.error(
        "Password must be at least 8 characters long, with one uppercase, one lowercase, one number, and one symbol.",
        { richColors: true, duration: 1500 }
      );
      return;
    }
    if (!userData.cPassword.trim()) {
      toast.error("Confirm Password is required", {
        richColors: true,
        duration: 1500,
      });
      return;
    } else if (userData.password !== userData.cPassword) {
      toast.error("Passwords do not match.", {
        richColors: true,
        duration: 1500,
      });
      return;
    }
    console.log("user", userData);
    console.log("name")
   try{
    setLoading(true)
     const response = await instance.post("/auth/otp", {
       name: `${userData.firstName} ${userData.lastName}`,
       email: userData.email,
       password: userData.password,
     });
     if(response.data.success) return toast.success("Otp Sucessfully Sent",{richColors:true,duration:1300,onAutoClose:()=>{
      navigate("/otp/verify");
     }})

   }
   catch(error){
    console.log(error)

   }finally{
    setLoading(false)
   }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <section className=" min-h-screen flex box-border justify-center items-center">
      <div className="bg-[#dfa674] rounded-2xl flex max-w-3xl p-6 items-center">
        <div className="md:w-1/2 px-8">
          <h2 className="font-bold text-3xl text-[#002D74] flex flex-col items-center justify-center"><img className="h-20" src={logo} alt="logo"/>Sign Up</h2>
          <p className="text-sm mt-4 mb-2 text-[#002D74]">
            Create a new account to get started.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                className="p-2 rounded-xl border w-full"
                type="text"
                name="firstName"
                placeholder="First Name"
                value={userData.firstName}
                onChange={handleDataChange}
              />
              <input
                className="p-2 rounded-xl border w-full"
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={userData.lastName}
                onChange={handleDataChange}
              />
            </div>
            <input
              className="p-2 rounded-xl border w-full"
              type="text"
              name="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleDataChange}
            />
            <div className="relative">
              <input
                className="p-2 rounded-xl border w-full"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={userData.password}
                onChange={handleDataChange}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="gray"
                className={`bi bi-eye absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer ${
                  showPassword ? "hidden" : "block"
                }`}
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
                onClick={handleTogglePassword}
              >
                <path d="M10.79 12.912L9.176 11.298A3.5 3.5 0 0 1 4.7 6.824L2.639 4.764C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.089A7.028 7.028 0 0 1 8 2.5C13 2.5 16 8 16 8s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708l-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6L1.707 1.707l.707-.707 12 12-.707.707z" />
              </svg>
            </div>
            <input
              className="p-2 rounded-xl border w-full"
              type="password"
              name="cPassword"
              placeholder="Confirm Password"
              value={userData.cPassword}
              onChange={handleDataChange}
            />
            <button
              className="bg-[#002D74] text-white py-2 rounded-xl hover:scale-105 duration-300 hover:bg-[#206ab1] font-medium"
              type="submit"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-5 text-xs text-[#002D74]">Forgot your password?</p>
          <div className="flex justify-between items-center mt-3 text-xs text-[#002D74]">
            <p>Already have an account?</p>
            <button
              onClick={() => navigate("/login")}
              className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300 hover:bg-[#6dc1c64f]"
            >
              Login
            </button>
          </div>
        </div>

        <div className="w-1/2   hidden md:block">
          <img
            className="rounded-2xl  "
            src="https://fiverr-res.cloudinary.com/t_main1,q_auto,f_auto/gigs3/190140735/original/b11449a4c5122e2d653dd7c5dcb7d6b019ee19e9.png"
            alt="Signup illustration"
          />
        </div>
      </div>
      {loading && <Spinner />}
    </section>
  );
};
export default Signup;
