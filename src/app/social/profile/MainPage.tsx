"use client";
import { useEffect, useState } from "react";
import PostList from "./PostList";
import QuickInfo from "./QuickInfo";
import { GetAllPostByUserId } from "@/api/postService";
import useStore from "@/zustand/store";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Filter, ItemPostProps } from "@/types/MainType";
import { useAuth } from "@/context/auth";

const filterInit = {
  keySearch: "",
  sort: {},
  page: 1,
  pageSize: 10,
  sessionCode: Math.random().toString(),
  userId: "",
};
const MainPage = () => {
  const auth = useAuth();

  const queryClient = useQueryClient();
  const cachedStore = queryClient.getQueryData(["#myselfPostList"]);
  const zustand = useStore();
  const { isLoading, setIsLoading, setHasDataChanged } = zustand;
  const [data, setData] = useState<ItemPostProps[]>([]);
  const [filterPage, setFilterPage] = useState<Filter>(filterInit);
  const LoadData = (userId: string) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    const newRequest = { ...filterPage, userId };

    GetAllPostByUserId(newRequest)
      .then((response) => {
        if (response.success) {
          setData(response.data);
          queryClient.setQueryData(["#myselfPostList"], () => {
            return response.data;
          });
          setHasDataChanged(false);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };
  console.log("auth", auth);

  useEffect(() => {
    scrollTo(0, 0);
    if (auth) {
      //setUserId(auth?.user?.id);
      LoadData(auth?.user?.id);
    }
  }, [auth]);
  return (
    <>
      {/* <NewPost /> */}
      <QuickInfo data={data[0]} />
      <h3 className="py-8 text-center text-heading-5 font-bold text-primary dark:text-cyan-800">
        MY POSTS
      </h3>
      <PostList data={data} />
    </>
  );
};
export default MainPage;
