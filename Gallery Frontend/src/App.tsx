import { BrowserRouter,Route,Routes } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import OtpPage from "./pages/OtpPage"
import { Toaster } from "sonner"
import GalleryPage from "./pages/GalleryPage."
import ProfilePage from "./pages/ProfilePage"
import GlobalContextProvider from "./context/userContext"
function App() {


  return (
    <>
      <GlobalContextProvider>
        <Toaster duration={1500} position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/otp/verify" element={<OtpPage />} />
            <Route path="/" element={<GalleryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </BrowserRouter>
      </GlobalContextProvider>
    </>
  );
}

export default App
