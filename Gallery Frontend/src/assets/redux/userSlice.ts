import { createSlice } from "@reduxjs/toolkit";


const userSlice=createSlice({
    name:"user",
    initialState:{
        name:"",
        img:""
    },
    reducers:{

        addUser:(state,action)=>{
            state.name=action.payload.user
            state.img=action.payload.img

        },
        clearUser:(state)=>{
            state.name = ""
            state.img =""
            
        },
        changeProfilePicture:(state,action)=>{
            state.img=action.payload

        }

    }
    

})
 const userReducer=  userSlice.reducer
 export default userReducer
export const {addUser,clearUser,changeProfilePicture}=userSlice.actions