import { Blocks } from "react-loader-spinner";

const Spinner = () => {
  return (
    <div
      className="relative z-30"
      aria-labelledby="crop-image-dialog"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-transparent bg-opacity-85 transition-all backdrop-blur-sm"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full justify-center px-2 py-12 text-center">
          <div className="relative w-[95%] flex items-center justify-center sm:w-[80%] min-h-[60vh] rounded-2xl  text-slate-100 text-left  transition-all">
            <Blocks
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              visible={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Spinner;
