"use client";
import { GetAllPostByUserId } from "@/api/postService";
import { CreateComment, DeleteComment, LikeToggle } from "@/api/socialService";
import PostCard from "@/components/Social/PostCard";
import {
  CommentPayload,
  Filter,
  ItemPostProps,
  LikePayload,
} from "@/types/MainType";
import useStore from "@/zustand/store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import NewPost from "./NewPost";

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
    GetAllPostByUserId(filterPage)
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
  const handleComment = (comment: CommentPayload) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    CreateComment(comment)
      .then((response) => {})
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };
  const handleDeleteComment = (id: string) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    DeleteComment(id)
      .then((response) => {})
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };
  const handleLike = (comment: LikePayload) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    LikeToggle(comment)
      .then((response) => {})
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };
  useEffect(() => {
    scrollTo(0, 0);
    LoadData();
  }, []);
  console.log(data);

  return (
    <div>
      <NewPost data={data} setData={setData} />
      <div className="space-y-4">
        {data.map((item, idx) => (
          <PostCard
            key={idx}
            {...item}
            handleComment={handleComment}
            handleDeleteComment={handleDeleteComment}
            handleLike={handleLike}
          />
        ))}
      </div>
    </div>
  );
};

export default PostList;
