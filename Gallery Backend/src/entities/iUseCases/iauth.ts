

interface IAuthInteractor {
  otpSignup(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<{
    status: boolean;
    message: string;
    errorCode?: string;
    token?: string;
  }>;
  otpValidateSignup(
    email: string,
    otp: string
  ): Promise<{
    status: boolean;
    message: string;
    errorCode?: string;
    access?: string;
    refresh?: string;
  }>;
  Login(data:{email:string,password:string}): Promise<{
    status: boolean;
    message: string;
    errorCode?: string;
    access?: string;
    refresh?: string;
  }>;
}
export default IAuthInteractor