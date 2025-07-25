"use client";
import {
  SavePost,
  SavePost_UploadMutli,
  UpdatePost_UploadMutli,
} from "@/api/postService";
import { useAuth } from "@/context/auth";
import { PostStatus } from "@/enum/postEnum";
import useStore from "@/zustand/store";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import HyperFormWrapper from "@/components/HyperFormWrapper";
import { Button } from "@/components/ui/button";
import { postSchema } from "@/shemas/postSchema";
import { imageProps } from "@/types/MainType";
import { useParams } from "next/navigation";
import { CloseIcon } from "@/assets/icons";
import DropzoneComponentV2 from "@/components/common/DropZoneV2";
import HD_TextArea from "@/components/common/HD_TextArea";
import VariantModal from "@/components/Social/VariantModal";
import { useModal } from "@/context/modal";
import NewPostComponent from "./NewPostComponent";

const TYPE_OF_DATA_IMG_RETURN = "file";
const dataInit = {
  userId: "687b3b0ec73bbfbe7a30237f",
  content: "",
  status: PostStatus.disApprove,
  hashTags: [],
  images: [],
  likes: [],
  comments: [],
};
const NewPost = () => {
  const params = useParams();
  const id = params?.id as string;
  const zustand = useStore();
  const auth = useAuth();
  const dataModal = useModal();
  const { open, setOpen, customStyle, setCustomStyle, setContent } = dataModal;
  const [isBusy, setIsBusy] = useState(false);
  //const [open, setOpen] = useState(false);
  const { isLoading, setIsLoading, setHasDataChanged } = zustand;
  const [request, setRequest] = useState(dataInit);
  const [images, setImages] = useState<imageProps[]>([]);
  const [deleteImages, setDeleteImages] = useState<imageProps[]>([]);
  const [isEdit, setIsEdit] = useState(false);

  const handlePost = () => {
    if (isLoading) {
      return;
    }
    if (request.content.length == 0) {
      toast.warning("Typing anything !!", {
        position: "bottom-right",
      });
      return;
    }
    setIsLoading(true);

    return;
  };

  const SaveData = async () => {
    if (isBusy) {
      return;
    }
    setIsBusy(true);
    var request_v2 = null;
    if (TYPE_OF_DATA_IMG_RETURN === "file") {
      const formData = jsonToFormData({
        ...request,
      });
      for (let i = 0; i < images.length; i++) {
        formData.append("files", images[i].imageFile);
      }
      request_v2 = formData;
    } else {
      request_v2 = {
        ...request,
        files: images.map((img) => img.imageBase64String),
      };
    }

    SavePost_UploadMutli(request_v2)
      .then((response) => {
        if (response.success) {
          setHasDataChanged(true);
          toast.success("Create Success !", {
            position: "bottom-right",
          });
          setOpen(false);
        } else {
          toast.error("Create Fail !", {
            position: "bottom-right",
          });
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsBusy(false);
      });
  };
  const UpdateData = async () => {
    if (isBusy) {
      return;
    }
    setIsBusy(true);
    var request_v2 = null;
    if (TYPE_OF_DATA_IMG_RETURN === "file") {
      const formData = jsonToFormData(request);
      for (let i = 0; i < images.length; i++) {
        if (images[i].isNewUpload) {
          formData.append("files", images[i].imageFile);
        }
      }
      formData.append(
        "oldImages",
        JSON.stringify(
          images.map((img) => {
            if (!img.isNewUpload) return img;
          }),
        ),
      );
      formData.append("deleteImages", JSON.stringify(deleteImages));
      request_v2 = formData;
    } else {
      request_v2 = {
        ...request,
        files: images.map((img) => {
          if (img.isNewUpload) return img.imageBase64String;
        }),
        oldImages: images.map((img) => {
          if (!img.isNewUpload) return img;
        }),
        deleteImages: deleteImages,
      };
    }

    UpdatePost_UploadMutli(id, request_v2)
      .then((response) => {
        if (response.success) {
          setHasDataChanged(true);
          toast.success("Update Success !", {
            position: "bottom-right",
          });
          setOpen(false);
        } else {
          toast.error("Update Fail !", {
            position: "bottom-right",
          });
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsBusy(false);
      });
  };

  const jsonToFormData = (json: Record<string, any>): FormData => {
    const formData = new FormData();

    Object.entries(json).forEach(([key, value]) => {
      if (value instanceof File) return;

      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        // Với string, number, boolean thì append trực tiếp
        formData.append(key, String(value));
      } else {
        // Nếu là object (bao gồm array), stringify
        formData.append(key, JSON.stringify(value));
      }
    });

    return formData;
  };
  const handleDeleteImage = (img: any) => {
    var indexToRemove = images.indexOf(img);

    if (indexToRemove != -1) {
      var copyImages = [...images];
      setDeleteImages([...deleteImages, copyImages[indexToRemove]]);
      copyImages = copyImages.filter((_, index) => index !== indexToRemove);
      setImages(copyImages);
    }
  };
  useEffect(() => {
    if (auth) {
      setRequest({ ...request, userId: auth?.user?.id });
    }
  }, [auth]);

  return (
    <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Input Section */}
      <div className="mb-3 flex items-center">
        <img
          src="https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=150"
          alt="Current User"
          className="h-10 w-10 rounded-full border border-gray-200 object-cover"
        />
        <input
          type="text"
          value={request.content}
          onChange={(e) =>
            setRequest({
              ...request,
              content: e.target.value,
            })
          }
          placeholder="What's on your mind?"
          className="ml-3 flex-1 rounded-full bg-gray-100 px-4 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      {/* Form Section */}
      <div>
        <div className="mt-3 flex flex-wrap items-center justify-between border-t-2 border-gray-200 pt-3 dark:border-gray-800">
          {/* Action Buttons */}
          <div className="mb-2 flex space-x-2 sm:mb-0">
            {/* Photo */}
            <button
              onClick={() => {
                setOpen(true);
                setCustomStyle({
                  ...customStyle,
                  title: "New Post",
                  onConfirm: () => {},
                  hiddenButtomConfirm: true,
                  hiddenButtomClose: true,
                  textButtomClose: "Close",
                  variant: "",
                  textButtomConfirm: "",
                  size: "lg",
                });
                setContent(<NewPostComponent />);
              }}
              type="button"
              className="flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
            >
              <svg
                className="mr-1.5 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <span className="hidden sm:inline">Photo</span>
            </button>

            {/* Tag */}
            <button
              type="button"
              className="flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
            >
              <svg
                className="mr-1.5 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="hidden sm:inline">Tag</span>
            </button>

            {/* Feeling */}
            <button
              type="button"
              className="flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
            >
              <svg
                className="mr-1.5 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
              <span className="hidden sm:inline">Feeling</span>
            </button>

            {/* Location */}
            <button
              type="button"
              className="flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
            >
              <svg
                className="mr-1.5 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="hidden sm:inline">Location</span>
            </button>
          </div>

          {/* Post Button */}
          <button
            className="cursor-pointer rounded-lg bg-gray-200 px-4 py-1.5 text-sm font-medium text-gray-400"
            onClick={handlePost}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};
export default NewPost;
