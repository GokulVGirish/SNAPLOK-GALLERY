import { useEffect } from "react";
import instance from "../axios/instance";
import { useNavigate } from "react-router-dom";

const useVerifyToken = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await instance.get("/auth/token-verify");
        console.log("response",response)
        if (response.data.status) return navigate("/");
      } catch (error) {
        console.log(error);
      }
    };

    verifyToken();
  }, [navigate]);
};
export default useVerifyToken;
