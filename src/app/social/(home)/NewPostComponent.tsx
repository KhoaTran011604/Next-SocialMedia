"use client";
import {
  SavePost_UploadMutli,
  UpdatePost_UploadMutli,
} from "@/api/postService";
import { useAuth } from "@/context/auth";
import { PostStatus } from "@/enum/postEnum";
import useStore from "@/zustand/store";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import HyperFormWrapper from "@/components/HyperFormWrapper";
import { Button } from "@/components/ui/button";
import { postSchema } from "@/shemas/postSchema";
import { imageProps, ItemPostProps } from "@/types/MainType";
import { useParams } from "next/navigation";
import { CloseIcon } from "@/assets/icons";
import DropzoneComponentV2 from "@/components/common/DropZoneV2";
import HD_TextArea from "@/components/common/HD_TextArea";
import VariantModal from "@/components/Social/VariantModal";
import { useModal } from "@/context/modal";

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
const NewPostComponent = ({
  data,
  setData,
}: {
  data: ItemPostProps[];
  setData: Dispatch<SetStateAction<ItemPostProps[]>>;
}) => {
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

  const SaveData = async () => {
    if (isBusy) {
      return;
    }
    if (request.content.length == 0) {
      toast.warning("Typing anything !!", {
        position: "bottom-right",
      });
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
          setData([response.data, ...data]);
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
    <HyperFormWrapper
      schema={postSchema}
      defaultValues={request}
      onSubmit={isEdit ? UpdateData : SaveData}
      className="grid grid-cols-1 gap-6 md:grid-cols-4"
    >
      <div className="col-span-1 md:col-span-4">
        <HD_TextArea
          title="Content"
          name="content"
          placeholder=""
          isItemForm={true}
          initValue={request.content}
          onChange={(value: any) =>
            setRequest({
              ...request,
              content: value,
            })
          }
        />
      </div>

      <div className="col-span-1 md:col-span-4">
        <div className="grid md:grid-cols-2 gap-4 grid-cols-1">
          <div className="">
            <DropzoneComponentV2
              title={"Images"}
              name={"images-upload"}
              multiple={true}
              typeDataReturn={TYPE_OF_DATA_IMG_RETURN}
              imagesInit={images}
              onUpload={(dataReturn: any) => {
                setImages(dataReturn);
              }}
            />
          </div>
          <div className="mt-4">
            {images?.length > 0 &&
              images.map((itemImg) => (
                <div key={Math.random()}>
                  {(itemImg.imageBase64String != "" ||
                    itemImg.imageAbsolutePath != "") && (
                    <div className="relative my-4 flex items-center space-x-4 rounded-lg border border-gray-300 p-2 dark:border-gray-700">
                      <div className="h-[100px] w-[100px]">
                        <img
                          src={
                            itemImg.isNewUpload
                              ? itemImg.imageBase64String
                              : itemImg.imageAbsolutePath
                          }
                          className="h-full w-full rounded-sm"
                          style={{ objectFit: "cover" }}
                        />
                        <div
                          className="absolute right-0 top-0 -translate-y-2 translate-x-2 rounded-lg bg-gray-800 p-2 text-white hover:bg-red-500 dark:bg-white dark:text-black"
                          onClick={() => {
                            handleDeleteImage(itemImg);
                          }}
                        >
                          <CloseIcon className="size-5" />
                        </div>
                      </div>
                      <h3 className="flex-1 truncate text-lg">
                        {itemImg.fileName}
                      </h3>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="col-span-1 flex justify-end py-2 md:col-span-4">
        <div>
          <Button type="submit" loading={isBusy}>
            Post
          </Button>
        </div>
      </div>
    </HyperFormWrapper>
  );
};
export default NewPostComponent;
