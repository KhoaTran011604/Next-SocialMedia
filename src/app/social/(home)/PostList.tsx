"use client";
import { GetAllPost } from "@/api/postService";
import PostCard from "@/components/Social/PostCard";
import { Filter, ItemPostProps } from "@/types/MainType";
import useStore from "@/zustand/store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const filterInit = {
  keySearch: "",
  sort: {},
  page: 1,
  pageSize: 10,
  sessionCode: Math.random().toString(),
};
const PostList = () => {
  const queryClient = useQueryClient();
  const cachedStore = queryClient.getQueryData(["#postList"]);
  const zustand = useStore();
  const { isLoading, setIsLoading, setHasDataChanged } = zustand;
  const [data, setData] = useState<ItemPostProps[]>([]);
  const [filterPage, setFilterPage] = useState<Filter>(filterInit);
  const LoadData = () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    GetAllPost(filterPage)
      .then((response) => {
        if (response.success) {
          setData(response.data);
          queryClient.setQueryData(["#postList"], () => {
            return response.data;
          });
          setHasDataChanged(false);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };
  useEffect(() => {
    LoadData();
  }, []);

  return (
    <div>
      <div className="space-y-4">
        {data.map((item, idx) => (
          <PostCard key={idx} {...item} />
        ))}
      </div>
    </div>
  );
};

export default PostList;
