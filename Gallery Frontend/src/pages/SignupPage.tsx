import Signup from "../components/Signup"
import bg from "@/assets/bg1.jpg";
import useVerifyToken from "../hooks & functions/useVerify";

const SignupPage=()=>{
  useVerifyToken()
    return (
      <div className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "100%",
            filter: "blur(5px)", 
            zIndex: "-1",
          }}
        ></div>
        <div className="relative z-10 flex justify-center items-center h-full">
          <Signup />
        </div>
      </div>
    );
}
export default SignupPage