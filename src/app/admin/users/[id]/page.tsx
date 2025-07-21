"use client";
import { GetAllCategoryFK } from "@/api/categoryService";
import {
  SaveUser_UploadMutli,
  SeachUser,
  UpdateUser_UploadMutli,
} from "@/api/userService";
import { CloseIcon } from "@/assets/icons";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DropzoneComponentV2 from "@/components/common/DropZoneV2";
import HD_Input from "@/components/common/HD_Input";
import HD_TextArea from "@/components/common/HD_TextArea";
import HyperFormWrapper from "@/components/HyperFormWrapper";
import LottieComponent from "@/components/lotties/lottie";

import Select from "@/components/Select";
import { Button } from "@/components/ui/button";
import { UserStatus } from "@/enum/userEnum";
import { userSchema } from "@/shemas/userSchema";
import { userUpdateSchema } from "@/shemas/userUpdateSchema";
import { imageProps } from "@/types/MainType";
import useStore from "@/zustand/store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const TYPE_OF_DATA_IMG_RETURN = "file";
const dataInit = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  status: "Active",
  role: "User",
};
const UserDetailPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const zustand = useStore();
  const { setHasDataChanged } = zustand;
  const [isBusy, setIsBusy] = useState(false);
  const [images, setImages] = useState<imageProps[]>([]);
  const [deleteImages, setDeleteImages] = useState<imageProps[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [request, setRequest] = useState(dataInit);

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

    SaveUser_UploadMutli(request_v2)
      .then((response) => {
        if (response.success) {
          setHasDataChanged(true);
          toast.success("Create Success !", {
            position: "bottom-right",
          });
          router.push("/users");
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

    UpdateUser_UploadMutli(id, request_v2)
      .then((response) => {
        if (response.success) {
          setHasDataChanged(true);
          router.push("/users");
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

  // const jsonToFormData = (json) => {
  //   const formData = new FormData();
  //   Object.entries(json).forEach(([key, value]) => {
  //     formData.append(
  //       key,
  //       value instanceof Object && !(value instanceof File)
  //         ? JSON.stringify(value)
  //         : value
  //     );
  //   });
  //   return formData;
  // };
  const jsonToFormData = (json: Record<string, any>): FormData => {
    const formData = new FormData();

    Object.entries(json).forEach(([key, value]) => {
      // Bỏ qua nếu là File
      if (value instanceof File) return;

      // // Nếu là object (bao gồm array), stringify
      // if (value !== null && typeof value === "object") {
      //   formData.append(key, JSON.stringify(value));
      // } else {
      //   // Với string, number, boolean thì append trực tiếp
      //   formData.append(key, String(value));
      // }

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

  const LoadData = async () => {
    SeachUser(id, {}).then((response) => {
      if (response.success) {
        setRequest(response.data);
        setImages(response.data.images);
      }
    });
  };

  const handleDeleteImage = (img: imageProps) => {
    var indexToRemove = images.indexOf(img);

    if (indexToRemove != -1) {
      var copyImages = [...images];
      setDeleteImages([...deleteImages, copyImages[indexToRemove]]);
      copyImages = copyImages.filter((_, index) => index !== indexToRemove);
      setImages(copyImages);
    }
  };
  useEffect(() => {
    if (id !== undefined && id !== "add") {
      setIsEdit(true);
      LoadData();
    }
  }, [id]);
  return (
    <div>
      <Breadcrumb
        pageName={id !== "add" ? "Edit" : "Create"}
        prePageTitle="Users"
        preLink="/admin/users"
        hiddenGoBackBtn={false}
      />
      {isBusy ? (
        <LottieComponent />
      ) : (
        <div className="custom-scrollbar min-h-[calc(100vh-180px)] overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
          <HyperFormWrapper
            schema={isEdit ? userUpdateSchema : userSchema}
            defaultValues={request}
            onSubmit={isEdit ? UpdateData : SaveData}
            className="grid grid-cols-1 gap-6 md:grid-cols-4"
          >
            <div>
              <HD_Input
                title="Full Name"
                name="fullName"
                placeholder=""
                isItemForm={true}
                initValue={request.fullName}
                onChange={(value) =>
                  setRequest({
                    ...request,
                    fullName: value,
                  })
                }
              />
            </div>

            <div>
              <HD_Input
                title="Phone"
                name="phone"
                placeholder=""
                isItemForm={true}
                initValue={request.phone}
                onChange={(value) =>
                  setRequest({
                    ...request,
                    phone: value,
                  })
                }
              />
            </div>
            <div>
              <HD_Input
                title="Email"
                name="email"
                placeholder=""
                isItemForm={true}
                initValue={request.email}
                onChange={(value) =>
                  setRequest({
                    ...request,
                    email: value,
                  })
                }
              />
            </div>
            <div>
              <Select
                {...{
                  error: errors.includes("role"),
                  hint: errors.includes("role") ? "Required field" : "",
                }}
                title={"Role"}
                name={"role"}
                defaultValue={request.role}
                options={[
                  {
                    label: "User",
                    value: "User",
                  },
                  {
                    label: "Admin",
                    value: "Admin",
                  },
                ]}
                placeholder="Select an option"
                onChange={(e) => {
                  setRequest({
                    ...request,
                    role: e.value,
                  });
                }}
                className="dark:bg-dark-900"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <HD_Input
                title="Address"
                name="address"
                placeholder=""
                isItemForm={true}
                initValue={request.address}
                onChange={(value) =>
                  setRequest({
                    ...request,
                    address: value,
                  })
                }
              />
            </div>
            <div>
              <HD_Input
                title="Change Password"
                name="password"
                type="password"
                placeholder=""
                isItemForm={true}
                initValue={request.password}
                onChange={(value) =>
                  setRequest({
                    ...request,
                    password: value,
                  })
                }
              />
            </div>
            <div>
              <Select
                {...{
                  error: errors.includes("status"),
                  hint: errors.includes("status") ? "Required field" : "",
                }}
                title={"Status"}
                name={"status"}
                defaultValue={request.status}
                options={[
                  {
                    label: "Active",
                    value: "Active",
                  },
                  {
                    label: "UnActive",
                    value: "UnActive",
                  },
                ]}
                placeholder="Select an option"
                onChange={(e) => {
                  setRequest({
                    ...request,
                    status: e.value,
                  });
                }}
                className="dark:bg-dark-900"
              />
            </div>
            <div className="col-span-1 md:col-span-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="">
                  <DropzoneComponentV2
                    title={"Images"}
                    name={"images-upload"}
                    multiple={true}
                    typeDataReturn={TYPE_OF_DATA_IMG_RETURN}
                    imagesInit={images}
                    onUpload={(dataReturn) => {
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
        </div>
      )}
    </div>
  );
};

export default UserDetailPage;
