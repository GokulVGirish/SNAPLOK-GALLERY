import Login from "../components/Login"
import bg from "@/assets/bg1.jpg";
import useVerifyToken from "../hooks & functions/useVerify";

const LoginPage=()=>{
  useVerifyToken()
    return (
      <div className="relative overflow-hidden h-screen">
        <div className="absolute inset-0">
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
        </div>
        <div className="relative z-10">
          <Login />
        </div>
      </div>
    );
}
export default LoginPage