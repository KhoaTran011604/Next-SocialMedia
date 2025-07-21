"use client";
import { GetAllCategoryFK } from "@/api/categoryService";
import {
  SaveProduct_UploadMutli,
  SeachProduct,
  UpdateProduct_UploadMutli,
} from "@/api/productService";
import { CloseIcon } from "@/assets/icons";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DropzoneComponentV2 from "@/components/common/DropZoneV2";
import HD_Input from "@/components/common/HD_Input";
import HD_TextArea from "@/components/common/HD_TextArea";
import HyperFormWrapper from "@/components/HyperFormWrapper";
import LottieComponent from "@/components/lotties/lottie";
import AddVariantsProduct from "@/components/Product/AddVariantsProduct";
import Select from "@/components/Select";
import { Button } from "@/components/ui/button";
import { ProductStatus } from "@/enum/productEnum";
import { productSchema } from "@/shemas/productSchema";
import { imageProps } from "@/types/MainType";
import useStore from "@/zustand/store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const TYPE_OF_DATA_IMG_RETURN = "file";
const dataInit = {
  name: "",
  price: 0,
  discount: 0,
  status: "InStock", //OutOfStock
  categoryId: "",
  categoryName: "",
  description: "",
  brand: "",
  stock: 0,
  variants: [],
};
const ProductDetailPage = () => {
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

  const [categories, setCategories] = useState([
    {
      _id: "id-1",
      name: "Quần áo ",
    },
    {
      _id: "id-2",
      name: "Quần giày dép ",
    },
    {
      _id: "id-3",
      name: "Khác",
    },
  ]);
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

    SaveProduct_UploadMutli(request_v2)
      .then((response) => {
        if (response.success) {
          setHasDataChanged(true);
          toast.success("Create Success !", {
            position: "bottom-right",
          });
          router.push("/products");
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

    UpdateProduct_UploadMutli(id, request_v2)
      .then((response) => {
        if (response.success) {
          setHasDataChanged(true);
          router.push("/products");
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

  const LoadData = async () => {
    SeachProduct(id, {}).then((response) => {
      if (response.success) {
        setRequest(response.data);
        setImages(response.data.images);
      }
    });
  };
  const LoadDataFK = async () => {
    GetAllCategoryFK({})
      .then((res) => {
        if (res.success) {
          setCategories(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {});
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
    LoadDataFK();
    if (id !== undefined && id !== "add") {
      setIsEdit(true);
      LoadData();
    }
  }, [id]);
  return (
    <div>
      <Breadcrumb
        pageName={id !== "add" ? "Edit" : "Create"}
        prePageTitle="Products"
        preLink="/admin/products"
        hiddenGoBackBtn={false}
      />
      {isBusy ? (
        <LottieComponent />
      ) : (
        <div className="custom-scrollbar min-h-[calc(100vh-180px)] overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
          <HyperFormWrapper
            schema={productSchema}
            defaultValues={request}
            onSubmit={isEdit ? UpdateData : SaveData}
            className="grid grid-cols-1 gap-6 md:grid-cols-4"
          >
            <div className="col-span-1 md:col-span-2">
              <HD_Input
                title="Title"
                name="name"
                placeholder=""
                isItemForm={true}
                initValue={request.name}
                onChange={(value) =>
                  setRequest({
                    ...request,
                    name: value,
                  })
                }
              />
            </div>
            <div>
              <Select
                {...{
                  error: errors.includes("categoryName"),
                  hint: errors.includes("categoryName") ? "Required field" : "",
                }}
                title={"Category"}
                name={"categoryId"}
                defaultValue={request.categoryId}
                options={
                  categories?.length > 0
                    ? categories.map((item) => ({
                        label: item.name,
                        value: item._id,
                      }))
                    : []
                }
                placeholder="Select an option"
                onChange={(e) => {
                  setRequest({
                    ...request,
                    categoryId: e.value,
                    categoryName: e.label,
                  });
                }}
                className="dark:bg-dark-900"
              />
            </div>

            <div>
              <HD_Input
                title="Price"
                name="price"
                type="number"
                placeholder=""
                isItemForm={true}
                initValue={request.price.toString()}
                onChange={(value) =>
                  setRequest({
                    ...request,
                    price: parseInt(value),
                  })
                }
              />
            </div>
            <div>
              <HD_Input
                title="Brand"
                name="brand"
                placeholder=""
                isItemForm={true}
                initValue={request.brand}
                onChange={(value) =>
                  setRequest({
                    ...request,
                    brand: value,
                  })
                }
              />
            </div>
            <div>
              <HD_Input
                title="Discount"
                name="discount"
                type="text"
                placeholder=""
                isItemForm={true}
                initValue={request.discount.toString()}
                onChange={(value) =>
                  setRequest({
                    ...request,
                    discount: parseInt(value),
                  })
                }
              />
            </div>
            <div>
              <HD_Input
                title="Stock"
                name="stock"
                type="number"
                placeholder=""
                isItemForm={true}
                initValue={request.stock.toString()}
                onChange={(value) =>
                  setRequest({
                    ...request,
                    stock: parseInt(value),
                  })
                }
              />
            </div>
            {isEdit && (
              <div>
                <Select
                  {...{
                    error: errors.includes("status"),
                    hint: errors.includes("status") ? "Required field" : "",
                  }}
                  title={"Status"}
                  name={"status"}
                  defaultValue={request.status}
                  options={Object.values(ProductStatus).map((val) => ({
                    label: val,
                    value: val,
                  }))}
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
            )}
            <div className="col-span-1 md:col-span-4">
              <AddVariantsProduct
                isEdit={true}
                initData={request.variants}
                isConfirm={false}
                onChange={(res: any) => {
                  setRequest({
                    ...request,
                    variants: res,
                  });
                }}
              />
            </div>

            <div className="col-span-1 md:col-span-4">
              <HD_TextArea
                title="Description"
                name="description"
                placeholder=""
                isItemForm={true}
                initValue={request.description}
                onChange={(value: any) =>
                  setRequest({
                    ...request,
                    description: value,
                  })
                }
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
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
