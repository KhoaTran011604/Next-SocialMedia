"use client";

import { SeachUser } from "@/api/userService";

import { useAuth } from "@/context/auth";

import { imageProps } from "@/types/MainType";
import { useEffect, useState } from "react";

import ChangeInfo from "./components/ChangeInfoComponent";
import { Camera } from "lucide-react";

const dataInit = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  status: "Active",
  role: "User",
  old_password: "",
  password_again: "",
};
const MainPage = () => {
  const Header = () => {
    return (
      <div>
        <div className="relative h-52 bg-gray-100">
          <img
            src="https://res.cloudinary.com/df4dqpvoz/image/upload/v1752753846/cld-sample-2.jpg"
            alt="Cover"
            className="h-full w-full object-cover"
          />

          <div className="absolute -bottom-16 left-6">
            <img
              src={
                images?.length > 0
                  ? images[0].isNewUpload
                    ? images[0].imageBase64String
                    : images[0].imageAbsolutePath
                  : "/images/user/default-user.png"
              }
              alt="Avatar"
              className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-md"
            />
            <label
              htmlFor="upload-avatar"
              className="absolute bottom-1 right-1 cursor-pointer rounded-full bg-white p-1 shadow-md"
            >
              <Camera className="h-5 w-5 text-gray-600" />
            </label>
            <input
              type="file"
              id="upload-avatar"
              accept="image/*"
              className="hidden"
              onChange={(e: any) => handleImageUpload(e.target.files[0])}
            />
          </div>
        </div>

        <div className="px-6 pb-6 pt-20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {request.fullName}
              </h1>
              <p className="text-sm text-gray-600">1.234 friends</p>
              <div className="mt-1 flex -space-x-2">
                <img
                  className="h-8 w-8 rounded-full border border-white"
                  src="https://randomuser.me/api/portraits/women/65.jpg"
                  alt=""
                />
                <img
                  className="h-8 w-8 rounded-full border border-white"
                  src="https://randomuser.me/api/portraits/men/76.jpg"
                  alt=""
                />
                <img
                  className="h-8 w-8 rounded-full border border-white"
                  src="https://randomuser.me/api/portraits/women/21.jpg"
                  alt=""
                />
                <img
                  className="h-8 w-8 rounded-full border border-white"
                  src="https://randomuser.me/api/portraits/men/90.jpg"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const auth = useAuth();

  const [images, setImages] = useState<imageProps[]>([]);

  const [request, setRequest] = useState(dataInit);

  const LoadData = async () => {
    SeachUser(auth?.user?.id, {}).then((response) => {
      if (response.success) {
        setRequest({ ...request, ...response.data });
        setImages(response.data.images);
      }
    });
  };

  const handleImageUpload = (file: any) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        var dataUpload: imageProps = {
          fileName: file.name,
          imageBase64String: e.target.result,
          imageAbsolutePath: "",
          imageFile: file,
          isNewUpload: true,
        };

        setImages([dataUpload]);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (auth?.user) {
      LoadData();
    }
  }, [auth?.user]);

  return (
    <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <Header />
      <div className="mt-8">
        <ChangeInfo data={request} images={images} setImages={setImages} />
      </div>
    </div>
  );
};
export default MainPage;
