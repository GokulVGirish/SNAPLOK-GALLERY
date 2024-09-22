import { configureStore,combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import userReducer from "./userSlice";
import { TypedUseSelectorHook, useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setMyDispatch } from "../../axios/instance";

const rootReducer=combineReducers({
    user:userReducer
})
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store=configureStore({
    reducer:persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),

})
export const persistor = persistStore(store);
setMyDispatch(store)

export default store;
 type AppDispatch=typeof store.dispatch;
 type RootState = ReturnType<typeof store.getState>;

 export const useAppDispatch=()=>useDispatch<AppDispatch>()
 export const useAppSelector:TypedUseSelectorHook<RootState>=useSelector



