import { imageProps } from "@/types/MainType";

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
      {images?.length > 0 &&
        images.map((img, idx) => (
          <img
            key={Math.random()}
            src={img.imageAbsolutePath}
            style={{ objectFit: "cover" }}
            alt="Post"
            className="h-auto max-h-[500px] w-full object-cover"
          />
        ))}
    </div>
  );
};

export default BoxImages;
