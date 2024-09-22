import {
  faCircleXmark,
  faCloudUploadAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDropzone } from "react-dropzone";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import instance from "../axios/instance";
import Spinner from "./Spinner";

interface ImageFile extends File {
  preview: string;
}
const ImageUploadModal = ({ closeModal,imageUploaded }: { closeModal: () => void;imageUploaded:()=>void }) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const onDrop = (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > 10)
      return toast.error(
        "You can only upload up to 10 images, no more paparazzi! 📸",
        { duration: 1500 }
      );
    if (acceptedFiles.length > 0) {
      const filesWithPreview = acceptedFiles.map((file: any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setImages((prevImages) => [...prevImages, ...filesWithPreview]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: true,
  });

  const removeImage = (indexToRemove: number) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  useEffect(() => {
    return () => {
      images.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [images]);
  console.log("images", images);
  const handleUpload = async () => {
    if (images.length === 0)
      return toast.error("Select Images To Upload", {
        richColors: true,
        duration: 1200,
      });
    try {
      const formData = new FormData();
      images.forEach((image) => formData.append("photos", image));
      setLoading(true);
      const response = await instance.post(`/photos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success)
        toast.success("Sucessfully Added", {
          richColors: true,
          duration: 1200,
          onAutoClose: () => {
            closeModal();
          },
        });
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message, {
          richColors: true,
          duration: 1200,
        });
    } finally {
      setLoading(false);
      imageUploaded()
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-6">
      <div className="relative bg-white w-full max-w-5xl h-auto p-10 rounded-3xl shadow-2xl overflow-auto backdrop-blur-xl bg-opacity-90 border border-gray-200">
        <button
          className="absolute top-6 right-6 text-gray-500 hover:text-red-600 transition duration-300"
          onClick={closeModal}
        >
          <FontAwesomeIcon icon={faCircleXmark} className="h-8 w-8" />
        </button>

        <div className="flex justify-center mb-4 items-center space-x-8">
          <h2 className="text-3xl font-extrabold  text-gray-700 bg-clip-text tracking-wide">
            Upload Your Awesome Images
          </h2>
          <button
            onClick={handleUpload}
            className="bg-gradient-to-r flex from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-full shadow-lg items-center space-x-3 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <FontAwesomeIcon icon={faCloudUploadAlt} className="h-5 w-5" />
            <span className="text-lg font-semibold">Upload Files</span>
          </button>
        </div>

        <div
          {...getRootProps({
            className:
              "border-dashed border-4 border-indigo-300 p-16 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-all duration-300 bg-white bg-opacity-60 shadow-inner",
          })}
        >
          <input {...getInputProps()} />
          <FontAwesomeIcon
            icon={faCloudUploadAlt}
            size="4x"
            className="text-indigo-400 mb-4"
          />
          <p className="text-lg text-gray-700 font-semibold">
            Drag & drop images here, or{" "}
            <span className="text-indigo-500 underline">click to browse</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">Maximum file size: 5MB</p>
        </div>

        {images.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Selected Images
            </h3>
            <div className="flex overflow-x-auto space-x-4 pb-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative w-36 h-36 flex-shrink-0 rounded-xl bg-gradient-to-r from-blue-100 to-indigo-100 shadow-lg hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={image.preview}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    className="absolute top-2 right-2  text-gray-500 rounded-full p-2 transition duration-300"
                    onClick={() => removeImage(index)}
                  >
                    <FontAwesomeIcon className="hover:scale-110" icon={faCircleXmark} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {loading && <Spinner />}
    </div>
  );
};
export default ImageUploadModal;
