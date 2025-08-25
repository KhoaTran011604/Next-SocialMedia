import { useDropzone } from "react-dropzone";
import React from "react";
import { imageProps } from "@/types/MainType";

type TypeDataReturn = "base64String" | "file";
interface DropzoneVideoComponentProps {
  title: string;
  name: string;
  typeDataReturn: TypeDataReturn;
  multiple?: boolean;
  readOnly?: boolean;
  imagesInit: imageProps[];
  onUpload: (data: imageProps[]) => void;
}

const DropzoneVideoComponent = ({
  title = "",
  name,
  typeDataReturn = "base64String",
  multiple = false,
  readOnly = false,
  imagesInit = [],
  onUpload,
}: DropzoneVideoComponentProps) => {
  const [datas, setDatas] = React.useState<imageProps[]>([]);

  // Hàm lấy thumbnail từ video
  const extractVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.src = url;
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.currentTime = 1; // lấy frame ở 1 giây

      video.addEventListener("loadeddata", () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnail = canvas.toDataURL("image/jpeg", 0.8);
          resolve(thumbnail);
        } else {
          resolve("");
        }
        URL.revokeObjectURL(url);
      });

      video.addEventListener("error", () => {
        resolve("");
        URL.revokeObjectURL(url);
      });
    });
  };

  // Xử lý khi chọn video
  const handleVideoUpload = async (file: File) => {
    if (file) {
      const thumbnailBase64 = await extractVideoThumbnail(file);

      const dataUpload: imageProps = {
        fileName: file.name,
        imageBase64String: thumbnailBase64 || "",
        imageAbsolutePath: "",
        imageFile: typeDataReturn === "file" ? file : null,
        isNewUpload: true,
      };

      const newDatas = multiple ? [...datas, dataUpload] : [dataUpload];
      setDatas(newDatas);
      onUpload(newDatas);
    }
  };

  const onDrop = (acceptedFiles: any) => {
    handleVideoUpload(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: {
      "video/mp4": [],
      "video/webm": [],
      "video/quicktime": [], // MOV
    },
  });

  React.useEffect(() => {
    setDatas(imagesInit);
  }, [imagesInit]);

  return (
    <div>
      {title && (
        <label
          htmlFor={name}
          className="mb-3 block text-sm font-medium text-gray-900 dark:text-white"
        >
          {title}
        </label>
      )}
      <div>
        {(multiple || (!multiple && datas.length === 0)) && (
          <div
            className={`dark:hover:border-brand-500 cursor-pointer rounded-xl border border-dashed border-gray-300 transition dark:border-gray-700 ${
              !readOnly ? "hover:border-brand-500" : ""
            }`}
          >
            <div
              {...(!readOnly ? getRootProps() : {})}
              className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10 ${
                isDragActive
                  ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                  : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
              }`}
              id="demo-upload"
            >
              {!readOnly && (
                <input
                  {...getInputProps()}
                  onChange={(e: any) => handleVideoUpload(e.target.files[0])}
                />
              )}

              <div className="dz-message m-0! flex flex-col items-center">
                <div className="mb-[22px] flex justify-center">
                  <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      width="32"
                      height="32"
                    >
                      <path d="M4 4h16v12H4z" opacity=".3" />
                      <path d="M2 2h20v16H2zM4 4v12h16V4H4zm18 14H2v2h20v-2z" />
                      <path d="M10 8v6l5-3z" />
                    </svg>
                  </div>
                </div>
                <h4 className="text-theme-xl mb-3 font-semibold text-gray-800 dark:text-white/90">
                  {isDragActive && !readOnly
                    ? "Drop Video Here"
                    : "Drag & Drop Video Here"}
                </h4>
                <span className="mb-5 block w-full max-w-[290px] text-center text-sm text-gray-700 dark:text-gray-400">
                  Drag and drop your MP4, WebM, MOV videos here or browse
                </span>
                <span className="text-theme-sm text-brand-500 font-medium underline">
                  Browse Video
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropzoneVideoComponent;
