"use client";

import { UpdateInfoByUser_UploadMulti } from "@/api/userService";
import HD_Input from "@/components/common/HD_Input";

import HyperFormWrapper from "@/components/HyperFormWrapper";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { userUpdateSchema } from "@/shemas/userUpdateSchema";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ChangeInfoProps {
  data: any;
  images: any;
  setImages: (data: any) => void;
}
const TYPE_OF_DATA_IMG_RETURN = "file";
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
const ChangeInfo = ({ data, images, setImages }: ChangeInfoProps) => {
  const auth = useAuth();

  const [isBusy, setIsBusy] = useState(false);
  const [request, setRequest] = useState(dataInit);

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
          images.map((img: any) => {
            if (!img.isNewUpload) return img;
          }),
        ),
      );
      request_v2 = formData;
    } else {
      request_v2 = {
        ...request,
        files: images.map((img: any) => {
          if (img.isNewUpload) return img.imageBase64String;
        }),
        oldImages: images.map((img: any) => {
          if (!img.isNewUpload) return img;
        }),
      };
    }

    UpdateInfoByUser_UploadMulti(auth?.user?.id, request_v2)
      .then((response) => {
        if (response.success) {
          toast.success("Update Success !", {
            position: "bottom-right",
          });
        } else {
          toast.error(response.message, {
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
      // Bỏ qua nếu là File
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

  useEffect(() => {
    if (data) setRequest(data);
  }, [data]);

  return (
    <HyperFormWrapper
      schema={userUpdateSchema}
      defaultValues={request}
      onSubmit={UpdateData}
      className="grid grid-cols-1 gap-6 md:grid-cols-4"
    >
      <div className="col-span-1 md:col-span-2">
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
          disabled={true}
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

      <div className="col-span-1 md:col-span-4">
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
          title="Old Password"
          name="old_password"
          type="password"
          placeholder=""
          isItemForm={true}
          initValue={request.old_password}
          onChange={(value) =>
            setRequest({
              ...request,
              old_password: value,
            })
          }
        />
      </div>
      <div>
        <HD_Input
          title="New Password"
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
        <HD_Input
          title="New Password Again"
          name="password_again"
          type="password"
          placeholder=""
          isItemForm={true}
          initValue={request.password_again}
          onChange={(value) =>
            setRequest({
              ...request,
              password_again: value,
            })
          }
        />
      </div>
      <div className="col-span-1 flex justify-end py-2 md:col-span-4">
        <div>
          <Button type="submit" loading={isBusy}>
            Save
          </Button>
        </div>
      </div>
    </HyperFormWrapper>
  );
};
export default ChangeInfo;
