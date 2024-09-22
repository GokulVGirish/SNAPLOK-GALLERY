import ImageGallery from "../components/ImageGallery"
import Navbar from "../components/Navbar"
import useVerifyToken from "../hooks & functions/useVerify"



const GalleryPage=()=>{
    useVerifyToken()
    return (
        <>
        <Navbar/>
        <ImageGallery/>
        </>
    )
}
export default GalleryPage