"use client";
import { GetAllPost } from "@/api/postService";
import PostCard from "@/components/Social/PostCard";
import { useAuth } from "@/context/auth";
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
  userId: "",
};
const PostList = () => {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const cachedStore = queryClient.getQueryData(["#myselfPostList"]);
  const zustand = useStore();
  const { isLoading, setIsLoading, setHasDataChanged } = zustand;
  const [data, setData] = useState<ItemPostProps[]>([]);
  const [filterPage, setFilterPage] = useState<Filter>(filterInit);
  const [userId, setUserId] = useState<string>("");
  console.log("auth", auth);

  const LoadData = () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    const newRequest = { ...filterPage, userId };
    console.log("newRequest", newRequest);

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
    if (auth) {
      setUserId(auth.user.id);
      LoadData();
    }
  }, [auth]);

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
