import { imageProps } from "@/types/MainType";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const BoxImages_V2 = ({ images }: { images: imageProps[] }) => {
  console.log(images);

  const checkImagesCount = () => {
    if (images?.length === 1) return "grid grid-cols-1";
    else if (images?.length > 1 && images?.length <= 4) {
      return "grid grid-cols-2 gap-4";
    } else {
      return "grid grid-cols-4 gap-2";
    }
  };

  return (
    <div className={checkImagesCount()}>
      <PhotoProvider>
        {images?.length > 0 &&
          images.map((img, idx) => {
            // Nếu là video -> không dùng PhotoView
            const isVideo = img.isVideo;

            const content =
              idx < 3 ? (
                isVideo ? (
                  <video
                    src={
                      img.isNewUpload
                        ? img.imageBase64String
                        : img.imageAbsolutePath
                    }
                    controls
                    className="h-auto max-h-[500px] w-full object-cover"
                  />
                ) : (
                  <img
                    src={
                      img.isNewUpload
                        ? img.imageBase64String
                        : img.imageAbsolutePath
                    }
                    style={{ objectFit: "cover" }}
                    alt="Post"
                    className="h-auto max-h-[500px] w-full object-cover"
                  />
                )
              ) : (
                <div className="relative max-h-[500px] w-full overflow-hidden">
                  {images.length > 4 && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
                      <span className="text-2xl font-bold text-white">{`+${images.length - 4}`}</span>
                    </div>
                  )}
                  {isVideo ? (
                    <video
                      src={
                        img.isNewUpload
                          ? img.imageBase64String
                          : img.imageAbsolutePath
                      }
                      controls
                      className={`z-0 max-h-[500px] w-full object-cover ${
                        idx >= 4 && "hidden"
                      }`}
                    />
                  ) : (
                    <img
                      src={
                        img.isNewUpload
                          ? img.imageBase64String
                          : img.imageAbsolutePath
                      }
                      alt="Post"
                      className={`z-0 max-h-[500px] w-full object-cover ${
                        idx >= 4 && "hidden"
                      }`}
                    />
                  )}
                </div>
              );

            return isVideo ? (
              // Video không bọc PhotoView
              <div key={idx}>{content}</div>
            ) : (
              // Ảnh bọc PhotoView để phóng to
              <PhotoView key={idx} src={img.imageAbsolutePath}>
                {content}
              </PhotoView>
            );
          })}
      </PhotoProvider>
    </div>
  );
};

export default BoxImages_V2;
