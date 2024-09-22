
import moment from "moment";

const ImageDetail = ({
  imageData,
  closeModal,
}: {
  imageData: {
    _id?: string;
    createdAt: Date;
    imagePath?: string;
    title?: string;
    orderIndex?: number;
  } | null;
  closeModal: () => void;
}) => {
  if (!imageData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
      <div className="relative p-6 bg-black bg-opacity-50 rounded-lg max-w-md w-full text-center shadow-2xl">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-white text-2xl hover:text-gray-300 transition"
        >
          &times;
        </button>

        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            {imageData.title || "Untitled"}
          </h2>

          <p className="text-gray-300 mb-2 text-sm">
            <span className="font-semibold text-white">Created At: </span>
            {moment(imageData.createdAt).format("MMMM Do, YYYY [at] h:mm A")}
          </p>

          {imageData._id && (
            <p className="text-sm text-gray-400">
              <span className="font-semibold text-white">Img Id: </span>
              {imageData._id}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageDetail;
