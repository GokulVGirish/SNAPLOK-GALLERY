import Otp from "../components/Otp"
import bg from "@/assets/bg2.jpg";


const OtpPage=()=>{
    return (
      <div className="relative min-h-screen">
      
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "blur(5px)",
            zIndex: "-1",
          }}
        />

      
        <div className="relative z-10">
          <Otp />
        </div>
      </div>
    );
}
export default OtpPage