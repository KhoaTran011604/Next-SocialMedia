"use client";
import { useEffect, useState } from "react";
import PostList from "./PostList";
import QuickInfo from "./QuickInfo";
import { GetAllPost } from "@/api/postService";
import useStore from "@/zustand/store";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Filter, ItemPostProps } from "@/types/MainType";

const filterInit = {
  keySearch: "",
  sort: {},
  page: 1,
  pageSize: 10,
  sessionCode: Math.random().toString(),
  userId: "",
};
const MainPage = () => {
  const params = useParams();
  const userId = params?.id as string;

  const queryClient = useQueryClient();
  const cachedStore = queryClient.getQueryData(["#myselfPostList"]);
  const zustand = useStore();
  const { isLoading, setIsLoading, setHasDataChanged } = zustand;
  const [data, setData] = useState<ItemPostProps[]>([]);
  const [filterPage, setFilterPage] = useState<Filter>(filterInit);

  const LoadData = () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    const newRequest = { ...filterPage, userId };

    GetAllPost(newRequest)
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
  useEffect(() => {
    scrollTo(0, 0);
    if (userId) {
      LoadData();
    }
  }, [userId]);
  return (
    <>
      {/* <NewPost /> */}
      <QuickInfo data={data[0]} />
      <h3 className="py-8 text-center text-heading-5 font-bold text-primary dark:text-cyan-800">
        POSTS
      </h3>
      <PostList data={data} />
    </>
  );
};
export default MainPage;
