import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";


export const globalContext = createContext<{
  isUploaded: boolean;
  setIsUploaded: Dispatch<SetStateAction<boolean>>;
} | null>(null);

const GlobalContextProvider=({children}:{children:ReactNode})=>{

    const [isUploaded, setIsUploaded] = useState(false);
    return (

        <globalContext.Provider value={{isUploaded,setIsUploaded}}>
            {children}

        </globalContext.Provider>

    )
}
export default GlobalContextProvider