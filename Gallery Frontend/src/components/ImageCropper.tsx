import React, { useRef } from "react";
import { useState } from "react";
import ReactCrop,{centerCrop,convertToPixelCrop,makeAspectCrop,Crop} from "react-image-crop";
import setCanvasPreview from "./setCanvasPreview";
const MIN_DIMENSION = 150;
const ASPECT_RATIO = 1;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
import instance from "../axios/instance";
import { toast } from "sonner";
import Spinner from "./Spinner";
import { useAppDispatch } from "../assets/redux/store";
import { changeProfilePicture } from "../assets/redux/userSlice";
import "react-image-crop/dist/ReactCrop.css";


const ImageCropper = ({
  setAvatar,
  closeModal,
}: {
  setAvatar(url: string): void;
  closeModal(): void;
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [error, setError] = useState("");
  const [spinner, setSpinner] = useState(false);
  const dispatch=useAppDispatch()
  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(file.type)) {
        setError(
          "Unsupported image format. Please upload a JPEG, PNG, or GIF image."
        );
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(
          "File size is too large. Please upload an image smaller than 5MB."
        );
        return;
      }
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const imageEement = new Image();
        const ImageUrl = reader.result?.toString() || "";
        imageEement.src = ImageUrl;
        imageEement.addEventListener("load", (e: Event) => {
          const { naturalWidth, naturalHeight } =
            e.currentTarget as HTMLImageElement;
          if (error) setError("");
          if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
            setError("Image must be at least 150 x 150 pixels.");
            return setImageUrl("");
          }

          setImageUrl(ImageUrl);
        });
      });
      reader.readAsDataURL(file);
    }
  };
  const OnImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercentage = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercentage,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
 
    

    setCrop(centeredCrop);
  };
  console.log("imageurl",imageUrl)
  console.log('crop',crop,ASPECT_RATIO)


  return (
    <>
      <label className="block mb-3 w-fit">
        <span className="sr-only">Choose profile photo</span>
        <input
          type="file"
          onChange={onSelectFile}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-gray-700 file:text-sky-300 hover:file:bg-gray-600"
        />
      </label>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {imageUrl && (
        <div className="flex flex-col items-center">
          <ReactCrop
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            crop={crop}
            circularCrop
            keepSelection
            aspect={ASPECT_RATIO}
            minWidth={25}
          >
            <img
              ref={imgRef}
              src={imageUrl}
              alt="upload"
              style={{ maxHeight: "70vh" }}
              onLoad={OnImageLoad}
            />
          </ReactCrop>
          <button
            onClick={() => {
              const canvas = setCanvasPreview(
                imgRef?.current as HTMLImageElement,
                previewCanvasRef?.current as HTMLCanvasElement,
                convertToPixelCrop(
                  crop as Partial<Crop>,
                  imgRef?.current?.width as number,
                  imgRef?.current?.height as number
                )
              );

              canvas.toBlob(async (blob) => {
                if (blob) {
                  setSpinner(true);

                  const formData = new FormData();
                  formData.append("image", blob);
                  let response = await instance.put(
                      "/profile/picture",
                      formData,
                      { headers: { "Content-Type": "multipart/form-data" } }
                    );
                

                  if (response?.data && response.data.success) {
                    dispatch(changeProfilePicture(response.data.url))

                    setSpinner(false);
                    const dataurl = previewCanvasRef.current?.toDataURL();
                    setAvatar(dataurl as string);
                    closeModal();
                    toast.success("Profile updated successfully!", {
                      richColors: true,
                      duration: 1500,
                    });
                  }
                }
              });
            }}
            className="text-white font-mono text-xs py-2 px-4 rounded-2xl mt-4 bg-sky-500 hover:bg-sky-600"
          >
            Crop Image
          </button>
          {spinner && <Spinner />}
        </div>
      )}
      {crop && (
        <canvas
          ref={previewCanvasRef}
          className="mt-4"
          style={{
            display: "none",
            border: "1px solid black",
            objectFit: "contain",
            width: 150,
            height: 150,
          }}
        ></canvas>
      )}
    </>
  );
};
export default ImageCropper;
