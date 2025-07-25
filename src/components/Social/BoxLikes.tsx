"use client";

import { GetAllCommentsByPost, GetAllLikesByPost } from "@/api/socialService";

import { useEffect, useState } from "react";

import LikeItem from "./LikeItem";
import { DataProps } from "@/types/MainType";

const BoxLikes = ({ _id }: { _id: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<DataProps>({
    likes: [],
    comments: [],
  });

  const LoadLikes = () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    GetAllLikesByPost(_id)
      .then((response) => {
        if (response.success) {
          setData({
            ...data,
            likes: response.data,
          });
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };
  useEffect(() => {
    LoadLikes();
  }, [_id]);
  return (
    <div className="max-h-[200px] space-y-8 overflow-y-auto p-8">
      {data.likes?.length > 0 ? (
        data.likes.map((like) => <LikeItem like={like} key={like._id} />)
      ) : (
        <div>No one likes this post. </div>
      )}
    </div>
  );
};
export default BoxLikes;
