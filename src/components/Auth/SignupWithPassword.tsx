"use client";

import { useEffect, useState } from "react";
import HyperFormWrapper from "../HyperFormWrapper";

import HD_Input from "../common/HD_Input";

import { HD_Button } from "../common/HD_Button";
import { registerSchema } from "@/shemas/registerSchema";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import { useAuth } from "@/context/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const initData = {
  fullName: "",
  job: "",
  email: "",
  password: "",
  password_again: "",
  remember: false,
};
export default function SignupWithPassword() {
  const auth = useAuth();
  const router = useRouter();
  const [data, setData] = useState(initData);
  const [loading, setLoading] = useState(false);

  const Register = async () => {
    if (loading) {
      return;
    }
    if (data.password !== data.password_again) {
      toast.error("Password and pasword again don't match !!", {
        position: "bottom-right",
      });
      return;
    }
    setLoading(true);
    const res = await auth.register(data);
    setLoading(false);
    if (!res) {
      toast.error("Register Fail !!", {
        position: "bottom-right",
      });
    } else {
      toast.success(
        <div onClick={() => router.push("/auth/sign-in")}>
          <span className="cursor-pointer">
            Register Success, Sign In now !!
          </span>
        </div>,
        {
          autoClose: 5000,
          position: "bottom-right",
        },
      );
      setData(initData);
      return res;
    }
  };

  return (
    <HyperFormWrapper
      schema={registerSchema}
      defaultValues={initData}
      onSubmit={() => {
        Register();
      }}
      className="mx-auto max-w-md"
    >
      <HD_Input
        title="Full name"
        name="fullName"
        placeholder="Press your name"
        isItemForm={true}
        initValue={data.fullName}
        onChange={(value) =>
          setData({
            ...data,
            fullName: value,
          })
        }
      />
      <HD_Input
        title="Job"
        name="job"
        placeholder="Press your job"
        isItemForm={true}
        initValue={data.job}
        onChange={(value) =>
          setData({
            ...data,
            job: value,
          })
        }
      />
      <HD_Input
        title="Email"
        name="email"
        placeholder="Press your email"
        isItemForm={true}
        initValue={data.email}
        onChange={(value) =>
          setData({
            ...data,
            email: value,
          })
        }
        icon={<EmailIcon />}
      />
      <HD_Input
        title="Password"
        name="password"
        placeholder="Press your pasword"
        type="password"
        isItemForm={true}
        initValue={data.password}
        onChange={(value) =>
          setData({
            ...data,
            password: value,
          })
        }
        icon={<PasswordIcon />}
      />
      <HD_Input
        title="Password Again"
        name="password_again"
        placeholder="Press your pasword"
        type="password"
        isItemForm={true}
        initValue={data.password_again}
        onChange={(value) =>
          setData({
            ...data,
            password_again: value,
          })
        }
        icon={<PasswordIcon />}
      />
      <HD_Button
        type={"submit"}
        title={"Sign Up"}
        loading={loading}
        onClick={() => {}}
      />
    </HyperFormWrapper>
  );
}
