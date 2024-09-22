
import { AxiosError } from "axios";
import React, { useState ,useEffect,useCallback} from "react";
import { toast } from "sonner";
import instance from "../axios/instance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";


const Profile = () => {
  const [userData, setUserData] = useState({firstName:"",lastName:"",email:"",profilePhoto:""});
  const [isDataChanged,setIsDataChanged]=useState(false)


  const fetchProfileDetails=useCallback(async()=>{
    try{
        const response=await instance.get(`/profile`)
        if(response.data.success){
            setUserData({
              firstName: response.data.user.name.split(" ")[0],
              lastName: response.data.user.name.split(" ")[1],
              ...response.data.user
            });
        }

    }
    catch(error){
        if(error instanceof AxiosError) toast.error(error.response?.data.message,{richColors:true,duration:1200})
    }

  },[])
  useEffect(()=>{
    fetchProfileDetails()

  },[fetchProfileDetails])

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();

  };

  const handleProfileUpdate=async()=>{
    try{
        const response=await instance.put('/profile',{name:`${userData.firstName} ${userData.lastName}`})
        if(response.data.success) {
            toast.success(response.data.message,{richColors:true,duration:800,onAutoClose:()=>{
                setIsDataChanged(false)
            }})
        }

    }
    catch(error){
       if(error instanceof AxiosError) toast.error(error.response?.data.message,{richColors:true,duration:1200});
    }

  }


  return (
    <main className="w-full min-h-screen flex justify-center items-center bg-gray-50 py-12">
      <div className="w-full md:w-2/3 lg:w-1/2 bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center space-y-6">
          <h2 className="text-3xl font-extrabold text-gray-800">Profile</h2>

          <div className="flex flex-col items-center space-y-6">
            <img
              className="w-32 h-32 object-cover rounded-full ring-4 ring-[#002D74] "
              src={
                userData.profilePhoto ||
                "https://photosbull.com/wp-content/uploads/2024/05/no-dp_16.webp"
              }
              alt="Profile"
            />
            <div className="flex space-x-4">
              <button
                type="button"
                className="py-2 px-5 bg-[#002D74] hover:bg-[#206ab1]  text-white rounded-lg transition focus:ring-4 focus:ring-indigo-300"
              >
                Change Picture
              </button>
              <button
                type="button"
                className="py-2 px-5 bg-white border border-[#002D74] text-[#002D74] rounded-lg hover:bg-gray-100 transition focus:ring-4 focus:ring-indigo-300"
              >
                Delete Picture
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-6">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="w-full">
                <label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your first name"
                  value={userData.firstName}
                  onChange={(e) => {
                    setIsDataChanged(true);
                    setUserData({ ...userData, firstName: e.target.value });
                  }}
                  required
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="last_name"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  value={userData.lastName}
                  onChange={(e) => {
                    setIsDataChanged(true);
                    setUserData({ ...userData, lastName: e.target.value });
                  }}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your last name"
                  required
                />
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                readOnly
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="your.email@mail.com"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="profession"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your password"
                  value={"***************"}
                  readOnly
                  required
                />
                <FontAwesomeIcon className="absolute top-4 hover:scale-105 cursor-pointer right-2" icon={faPenToSquare}/>
              </div>
            </div>

            {isDataChanged && (
              <div className="flex justify-end">
                <button
                  onClick={handleProfileUpdate}
                  type="submit"
                  className="py-2.5 px-6 bg-[#002D74] hover:bg-[#206ab1]   text-white rounded-lg  transition focus:ring-4 focus:ring-indigo-300"
                >
                  Save
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
};

export default Profile
