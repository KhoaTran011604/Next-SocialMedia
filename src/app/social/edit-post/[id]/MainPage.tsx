"use client";
import { useEffect, useState } from "react";
import {
  GetAllPostByUserId,
  SavePost_UploadMutli,
  SeachPost,
  UpdatePost_UploadMutli,
} from "@/api/postService";
import useStore from "@/zustand/store";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Filter, imageProps, ItemPostProps } from "@/types/MainType";
import { toast } from "react-toastify";
import { PostStatus } from "@/enum/postEnum";
import { PostDetailProps } from "@/app/admin/posts/[id]/page";
import { formatMessageTime } from "@/lib/format-message-time";
import HyperFormWrapper from "@/components/HyperFormWrapper";
import { postSchema } from "@/shemas/postSchema";
import Select from "@/components/Select";
import HD_TextArea from "@/components/common/HD_TextArea";
import DropzoneComponentV2 from "@/components/common/DropZoneV2";
import { CloseIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import BoxImages from "@/components/Social/BoxImages";
import { useAuth } from "@/context/auth";

const filterInit = {
  keySearch: "",
  sort: {},
  page: 1,
  pageSize: 10,
  sessionCode: Math.random().toString(),
  userId: "",
};
const TYPE_OF_DATA_IMG_RETURN = "file";
const dataInit = {
  userId: "",
  content: "",
  status: PostStatus.disApprove,
  hashTags: [],
  images: [],
  likes: [],
  comments: [],
  userName: "",
  userImages: [],
  createdAt: new Date().toISOString(),
};
const MainPage = () => {
  const auth = useAuth();
  const router = useRouter();
  const params = useParams();
  const postId = params?.id as string;

  const queryClient = useQueryClient();
  const zustand = useStore();
  const { isLoading, setIsLoading, setHasDataChanged } = zustand;
  const [data, setData] = useState<ItemPostProps[]>([]);
  const [filterPage, setFilterPage] = useState<Filter>(filterInit);
  const [isBusy, setIsBusy] = useState(false);
  const [request, setRequest] = useState<PostDetailProps>(dataInit);
  const [images, setImages] = useState<imageProps[]>([]);
  const [deleteImages, setDeleteImages] = useState<imageProps[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [preview, setPreview] = useState<boolean>(false);
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
          router.push("/social");
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

    UpdatePost_UploadMutli(postId, request_v2)
      .then((response) => {
        if (response.success) {
          setHasDataChanged(true);
          toast.success("Update Success !", {
            position: "bottom-right",
          });
          router.push("/social");
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

  const LoadData = async () => {
    SeachPost(postId, {}).then((response) => {
      if (response.success) {
        setRequest(response.data);
        setImages(response.data.images);
      }
    });
  };
  useEffect(() => {
    scrollTo(0, 0);
    LoadData();
    if (auth) {
      setRequest({
        ...request,
        userId: auth.user.id,
      });
    }
  }, [postId, auth]);

  return (
    <>
      <Breadcrumb
        pageName={postId !== "add" ? "Edit Post" : "Create Post"}
        prePageTitle="Social"
        preLink="/social"
        hiddenGoBackBtn={false}
      />
      <div className="custom-scrollbar min-h-[calc(100vh-180px)] overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex items-start justify-between py-4">
          <div className="flex items-center">
            <img
              src={
                request.userImages?.length > 0
                  ? request.userImages[0]?.imageAbsolutePath
                  : "/images/user/default-user.png"
              }
              alt={`Avatar ${request?.userName}`}
              className="h-10 w-10 rounded-full border border-gray-200 object-cover"
            />
            <div className="ml-3">
              <div className="text-sm font-semibold text-gray-900 dark:text-white/90">
                {request?.userName}
              </div>
              <div className="text-xs text-gray-500">
                {formatMessageTime(
                  request?.createdAt
                    ? request?.createdAt
                    : new Date().toISOString(),
                )}
              </div>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => setPreview(!preview)}
            className="min-w-[6rem]"
          >
            {preview ? "Back" : "Preview"}
          </Button>
        </div>
        {!preview ? (
          <HyperFormWrapper
            schema={postSchema}
            defaultValues={request}
            onSubmit={postId !== "add" ? UpdateData : SaveData}
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
            {/* <div className="col-span-1 md:col-span-4">
              <HD_TextArea
                title="Hash Tags"
                name="hashTags"
                placeholder=""
                isItemForm={true}
                initValue={request.hashTags}
                onChange={(value: any) =>
                  setRequest({
                    ...request,
                    hashTags: value,
                  })
                }
              />
            </div> */}
            <div className="col-span-1 md:col-span-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                <Button type="submit">Save</Button>
              </div>
            </div>
          </HyperFormWrapper>
        ) : (
          <div>
            <div className="mb-2 mt-4 text-sm text-gray-800 dark:text-white/90">
              {request.content}
            </div>
            <BoxImages images={images} />
          </div>
        )}
      </div>
    </>
  );
};
export default MainPage;
