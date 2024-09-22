import { AxiosError } from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import instance from "../axios/instance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { globalContext } from "../context/userContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
    e.preventDefault(); // Prevent default to allow drop
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (draggedIndex === index) return;

    const updatedImages = Array.from(images);
    const [removed] = updatedImages.splice(draggedIndex, 1);
    updatedImages.splice(index, 0, removed);

    setImages(updatedImages);
    updateImageOrder(updatedImages);
    setDraggingIndex(null); // Reset dragging index after drop
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

  return (
    <div className="grid grid-cols-2 mt-28 mx-4 md:grid-cols-3 gap-6">
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
                <span className="text-white font-semibold text-sm">
                  {img.title}
                </span>
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
    </div>
    //
  );
};

export default ImageGallery;