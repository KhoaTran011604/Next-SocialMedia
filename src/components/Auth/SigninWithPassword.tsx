"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import HyperFormWrapper from "../HyperFormWrapper";
import { loginSchema } from "@/shemas/loginSchema";
import HD_Input from "../common/HD_Input";
import { HD_Button } from "../common/HD_Button";
import { useAuth } from "@/context/auth";
import {
  GetAllTodo_WithoutPanigation,
  GetCompletedTodo_WithoutPanigation,
} from "@/api/todoService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const initData = {
  email: "khoa@gmail.com",
  password: "12345678",
};
export default function SigninWithPassword() {
  const auth = useAuth();
  const [data, setData] = useState(initData);

  const [loading, setLoading] = useState(false);

  const Login = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const res = await auth.login(data);

    if (!res.success) {
      toast.error("Login Fail !!", {
        position: "bottom-right",
      });
    } else {
      return res;
    }
    setLoading(false);
  };
  const GetAllTodo = async () => {
    const response = await GetAllTodo_WithoutPanigation({
      sortField: "createdAt",
      sortOrder: "desc",
    });
    return response.data;
  };
  const GetCompletedTodo = async () => {
    const response = await GetCompletedTodo_WithoutPanigation({
      sortField: "createdAt",
      sortOrder: "desc",
    });
    return response.data;
  };
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => Login(),
    onSuccess: async (dataLogin) => {
      if (dataLogin && dataLogin.success) {
        const [todos, completed] = await Promise.all([
          GetAllTodo(),
          GetCompletedTodo(),
        ]);
        queryClient.setQueryData(["#user"], dataLogin.data);
        queryClient.setQueryData(["#todoList"], todos);
        queryClient.setQueryData(["#todoList_Completed"], completed);
      }
    },
  });
  const handleSubmit = () => {
    mutation.mutate();
  };

  return (
    <HyperFormWrapper
      schema={loginSchema}
      defaultValues={initData}
      onSubmit={() => {
        handleSubmit();
      }}
      className="mx-auto max-w-md"
    >
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
      <HD_Button
        type={"submit"}
        title={"Sign In"}
        loading={loading}
        onClick={() => {}}
      />
    </HyperFormWrapper>
  );
}
