import React, {  useState } from "react";
import { toast } from "sonner";
import useVerifyToken from "../hooks & functions/useVerify";
import instance from "../axios/instance";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

const Otp=()=>{


   const [otp, setOtp] = useState(new Array(4).fill(""));
   const navigate=useNavigate()

   const handleInputChange = (element:any, index:any) => {
     if (/^[0-9]$/.test(element.value) || element.value === "") {
       let newOtp = [...otp];
       newOtp[index] = element.value;
       setOtp(newOtp);

      
       if (element.nextSibling && element.value !== "") {
         element.nextSibling.focus();
       }
     }else{
        return toast.error("Enter A Aalid Number",{richColors:true,duration:1500})
     }
   };

   const handleSubmit = async(e:React.FormEvent) => {
     e.preventDefault();
    try{
         const response = await instance.post("/auth/otp/signup", {
           otp: otp.join(""),
         });
         if (response.data.success) return toast.success("Signed Up Sucessfully",{richColors:true,duration:1200,onAutoClose:()=>{
            navigate("/");
         }})

    }catch(error){
        if(error instanceof AxiosError && error.response?.status!==401){
            toast.error(error.response?.data.message,{richColors:true,duration:1300})
        }

    }

   };
  useVerifyToken()

   return (
     <div className="relative font-inter antialiased">
       <main className="relative min-h-screen flex flex-col justify-center  overflow-hidden">
         <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
           <div className="flex justify-center">
             <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
               <header className="mb-8">
                 <h1 className="text-2xl font-bold mb-1">Email Verification</h1>
                 <p className="text-[15px] text-slate-500">
                   Enter the 4-digit verification code that was sent to your
                   email.
                 </p>
               </header>
               <form id="otp-form" onSubmit={handleSubmit}>
                 <div className="flex items-center justify-center gap-3">
                   {otp.map((data, index) => (
                     <input
                       key={index}
                       type="text"
                       className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                       maxLength={1}
                       value={data}
                       onChange={(e) => handleInputChange(e.target, index)}
                       onFocus={(e) => e.target.select()}
                     />
                   ))}
                 </div>
                 <div className="max-w-[260px] mx-auto mt-4">
                   <button
                     type="submit"
                     className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-[#002D74] hover:bg-[#206ab1] px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10  focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
                   >
                     Verify Account
                   </button>
                 </div>
               </form>
               <div className="text-sm text-slate-500 mt-4">
                 Didn't receive code?{" "}
                 <a
                   className="font-medium text-[#002D74] hover:text-[#206ab1]"
                   href="#0"
                 >
                   Resend
                 </a>
               </div>
             </div>
           </div>
         </div>
       </main>
     </div>
   );
}
export default Otp