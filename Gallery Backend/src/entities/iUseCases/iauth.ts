

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
    user?:string
  }>;
  Login(data:{email:string,password:string}): Promise<{
    status: boolean;
    message: string;
    errorCode?: string;
    access?: string;
    refresh?: string;
    user?:string,
    img?:string
  }>;
  passwordResetLink(email:string):Promise<boolean>
  resetPassword(token:string,password:string):Promise<{status:boolean,message:string,errorCode?:string}>
}
export default IAuthInteractor