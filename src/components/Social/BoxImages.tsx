import { imageProps } from "@/types/MainType";
import { useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const BoxImages = ({ images }: { images: imageProps[] }) => {
  const checkImagesCount = () => {
    if (images?.length == 1) return "grid grid-cols-1";
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
            if (idx <= 3)
              return (
                <PhotoView key={Math.random()} src={img.imageAbsolutePath}>
                  {idx < 3 ? (
                    <img
                      src={img.imageAbsolutePath}
                      style={{ objectFit: "cover" }}
                      alt="Post"
                      className="h-auto max-h-[500px] w-full object-cover"
                    />
                  ) : (
                    <div className="relative max-h-[500px] w-full overflow-hidden">
                      {/* Overlay layer */}
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
                        <span className="text-2xl font-bold text-white">{`+${images.length - 3}`}</span>
                      </div>

                      {/* Image layer */}
                      <img
                        src={img.imageAbsolutePath}
                        alt="Post"
                        className="z-0 max-h-[500px] w-full object-cover"
                      />
                    </div>
                  )}
                </PhotoView>
              );
          })}
      </PhotoProvider>
    </div>
  );
};

export default BoxImages;
