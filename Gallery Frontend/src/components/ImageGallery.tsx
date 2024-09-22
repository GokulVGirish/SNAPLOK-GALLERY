import { AxiosError } from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import instance from "../axios/instance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { globalContext } from "../context/userContext";
import ImageDetail from "./ImgDetailModal";
import Spinner from "./Spinner";

const ImageGallery = () => {
  const [images, setImages] = useState<
    {
      _id?: string;
      createdAt: Date;
      imagePath?: string;
      title?: string;
      orderIndex?: number;
    }[]
  >([]);
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [draggingImage, setDraggingImage] = useState<{
    _id?: string;
    createdAt: Date;
    imagePath?: string;
    title?: string;
    orderIndex?: number;
  } | null>(null);
  const [viewDetailModal,setViewDetailModal]=useState(false)
  const [selectedImg,setSelectedImg]=useState<{
      _id?: string;
      createdAt: Date;
      imagePath?: string;
      title?: string;
      orderIndex?: number;
    }|null>(null)
    const [isSelectMode, setIsSelectMode] = useState(false); 
const [selectedImages, setSelectedImages] = useState<string[]>([]); 
const [loading,setLoading]=useState(false)

  const context = useContext(globalContext);
  if (!context) throw new Error("context not provided");
  const { isUploaded } = context;

  const fetchImages = useCallback(async () => {
    try {
      const response = await instance.get("/photos");
      if (response.data.success) setImages(response.data.images);
    } catch (error) {
      if (error instanceof AxiosError)
        return toast.error(error.response?.data.message, {
          richColors: true,
          duration: 1500,
        });
    }
  }, [isUploaded]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
    setDraggingIndex(index);
    setDraggingImage(images[index]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (draggedIndex === index) return;

    const updatedImages = Array.from(images);
    const [removed] = updatedImages.splice(draggedIndex, 1);
    updatedImages.splice(index, 0, removed);

    setImages(updatedImages);
    updateImageOrder(updatedImages);
    setDraggingIndex(null); 
    setDraggingImage(null);
  };

  const updateImageOrder = async (updatedImages: any[]) => {
    const updates = updatedImages.map((image, index) => ({
      _id: image._id,
      orderIndex: index,
    }));

    try {
      const response = await instance.put("/photos", { images: updates });
      if (response.data.success) {
        toast.success("Image order updated successfully!", {
          richColors: true,
          duration: 1500,
        });
      }
    } catch (error) {
      toast.error("Failed to update image order!", {
        richColors: true,
        duration: 1500,
      });
    }
  };

  const handleEditClick = (img: any) => {
    setEditingImageId(img._id);
    setEditingTitle(img.title || "");
  };

  const handleSaveClick = async (img: any) => {
    if (!editingTitle.trim())
      return toast.error("Give a valid title", {
        richColors: true,
        duration: 1200,
      });

    try {
      const response = await instance.put(`/photos/edit/${img._id}`, {
        title: editingTitle,
      });
      if (response.data.success) {
        toast.success("Image title updated successfully!", {
          richColors: true,
          duration: 1500,
        });
        const updatedImages = images.map((image) =>
          image._id === img._id ? { ...image, title: editingTitle } : image
        );
        setImages(updatedImages);
        setEditingImageId(null);
      }
    } catch (error) {
      toast.error("Failed to update image title!", {
        richColors: true,
        duration: 1500,
      });
    }
  };

  const handleCancelClick = () => {
    setEditingImageId(null);
  };
  const toggleSelectMode = () => {
    setIsSelectMode((prevMode) => !prevMode);
    setSelectedImages([]); 
  };

  const handleImageSelect = (id: string) => {
    setSelectedImages((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((imgId) => imgId !== id); 
      } else {
        return [...prevSelected, id]; 
      }
    });
  };
  const deleteSelectedImages = async () => {
    try {
      setLoading(true)
      const response = await instance.delete("/photos", {
        data: selectedImages
      });
      if (response.data.success) {
        setImages((prevImages) =>
          prevImages.filter((img) => !selectedImages.includes(img._id as string))
        );
        setSelectedImages([]);
        toast.success("Selected images deleted successfully!", {
          richColors: true,
          duration: 1500,
        });
      }
    } catch (error) {
      toast.error("Failed to delete selected images!", {
        richColors: true,
        duration: 1500,
      });
    }finally{
      toggleSelectMode()
      setLoading(false)
    }
  };

  return (
    <>
      <div className="flex justify-end space-x-4 mt-28 mb-3 px-3">
      
        <button
          onClick={toggleSelectMode}
          className={`relative py-2 px-5 rounded-md font-medium text-gray-800 tracking-wide transition-all duration-300 ease-in-out shadow-sm ${
            isSelectMode
              ? "bg-gray-200 hover:bg-gray-300"
              : "bg-gray-100 hover:bg-gray-200"
          } transform hover:-translate-y-0.5 active:translate-y-0`}
        >
          <span className="relative z-10">
            {isSelectMode ? "Exit Select Mode" : "Select Images"}
          </span>
        </button>

     
        {isSelectMode && selectedImages.length > 0 && (
          <button
            onClick={deleteSelectedImages}
            className="relative py-2 px-5 rounded-md font-medium text-gray-800 tracking-wide bg-red-100 hover:bg-red-200 transition-all duration-300 ease-in-out shadow-sm transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="relative z-10">Delete Selected</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2  mx-4 md:grid-cols-3 gap-6">
        {images.map((img, index) => (
          <div
            key={img._id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`relative group bg-gray-900 rounded-lg overflow-hidden h-64 w-full flex items-center justify-center ${
              draggingIndex === index ? "opacity-50" : ""
            }`}
          >
            {draggingImage && draggingImage._id === img._id && (
              <div
                className="absolute top-0 left-0 w-full h-full bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center"
                style={{
                  zIndex: 1000,
                  pointerEvents: "none",
                  opacity: 0.7,
                }}
              >
                <img
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  src={draggingImage.imagePath}
                  alt={`Gallery image ${index + 1}`}
                />
              </div>
            )}
            {isSelectMode && (
              <div className="absolute top-2 left-2 z-10">
                <input
                  type="checkbox"
                  id={`checkbox-${img._id}`}
                  className="hidden"
                  checked={selectedImages.includes(img._id!)}
                  onChange={() => handleImageSelect(img._id!)}
                />
                <label
                  htmlFor={`checkbox-${img._id}`}
                  className="flex items-center justify-center w-6 h-6 bg-gray-800 border-2 border-white rounded-md cursor-pointer"
                >
                  {selectedImages.includes(img._id!) && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </label>
              </div>
            )}

            <img
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              src={img.imagePath}
              alt={`Gallery image ${index + 1}`}
            />
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 p-2 flex justify-between items-center">
              {editingImageId === img._id ? (
                <>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="text-white bg-transparent border border-white rounded p-1"
                  />
                  <button
                    className="text-white hover:bg-opacity-80 transition-all border-2 rounded-lg px-2 duration-200"
                    onClick={() => handleSaveClick(img)}
                  >
                    Save
                  </button>
                  <button
                    className="text-white hover:bg-opacity-80 transition-all duration-200"
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div className="flex gap-5">
                    <span className="text-white font-semibold text-sm">
                      {img.title}
                    </span>
                    <button
                      onClick={() => {
                        setViewDetailModal(true);
                        setSelectedImg(img);
                      }}
                    >
                      <FontAwesomeIcon
                        className="text-gray-100 hover:scale-105 hover:transition-transform top-3 right-3"
                        icon={faExclamationCircle}
                      />
                    </button>
                  </div>
                  <button
                    className="text-white hover:bg-opacity-80 transition-all duration-200"
                    onClick={() => handleEditClick(img)}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {viewDetailModal && (
          <ImageDetail
            imageData={selectedImg}
            closeModal={() => {
              setViewDetailModal(false);
              setSelectedImg(null);
            }}
          />
        )}
      </div>
      {loading && <Spinner/>}
    </>
  );
};

export default ImageGallery;