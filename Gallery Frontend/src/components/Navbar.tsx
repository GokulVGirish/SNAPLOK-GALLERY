import { faChevronDown, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import logo from "@/assets/logo.png";
import { useNavigate } from "react-router-dom";
import instance from "../axios/instance";
import { AxiosError } from "axios";
import { toast } from "sonner";
import ImageUploadModal from "./ImageUploadModal";
import { useContext } from "react";
import { globalContext } from "../context/userContext";
 import {useAppDispatch, useAppSelector } from "../assets/redux/store";
import { clearUser } from "../assets/redux/userSlice";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isUploadOpen,setIsUploadOpen]=useState(false)
  const {name,img}=useAppSelector((state)=>state.user)
  const dispatch=useAppDispatch()
  const context= useContext(globalContext);

 
  if(!context) throw new Error("context not provided")

  
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setIsNavOpen(!isNavOpen);
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleLogout = async () => {

    try {
      dispatch(clearUser())
      const response = await instance.post("/auth/logout");
      if (response.data.success) navigate("/login");
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message, {
          richColors: true,
          duration: 1200,
        });
    }
  };
  console.log("stat", isDropdownOpen);
  return (
    <nav
      style={{ zIndex: 60 }}
      className="border-gray-200 fixed w-full left-0 top-0 bg-[#dfa674] shadow-lg"
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <span className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            <img src={logo} alt="logo" className="h-16" />
          </span>
        </span>

        <button
          onClick={toggleNavbar}
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isNavOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        <div
          className={`${
            isNavOpen ? "block" : "hidden"
          } w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col justify-center md:flex-row p-4 md:p-0 mt-4 md:mt-0 space-y-4 md:space-y-0 md:space-x-8 border border-gray-100 rounded-lg md:border-0 bg-white md:bg-transparent shadow-lg md:shadow-none">
            <li className="flex items-center">
              <button
                onClick={() => setIsUploadOpen(true)}
                className="flex items-center justify-center py-2 px-4 bg-[#002D74] hover:bg-[#206ab1] text-white rounded-md shadow-md transition-all duration-300"
              >
                <FontAwesomeIcon icon={faUpload} className="mr-2" />
                Upload
              </button>
            </li>

            <li className="relative flex items-center">
              <div
                className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 cursor-pointer"
                onClick={toggleDropdown}
              >
                <img
                  src={img || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <span
                className="text-sm font-semibold text-gray-700 ml-2 cursor-pointer"
                onClick={toggleDropdown}
              >
                {name} &nbsp; <FontAwesomeIcon icon={faChevronDown} />
              </span>

              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0  mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                >
                  <ul className="py-1">
                    <li>
                      <span
                        onClick={() => navigate("/profile")}
                        className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                      >
                        Profile
                      </span>
                    </li>
                    <li>
                      <span
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm cursor-pointer text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
      {isUploadOpen && (
        <ImageUploadModal
          imageUploaded={() =>
            context?.setIsUploaded((prevState) => !prevState)
          }
          closeModal={() => setIsUploadOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
