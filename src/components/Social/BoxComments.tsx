"use client";

import { GetAllCommentsByPost } from "@/api/socialService";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import { DataProps, fakeDataProps } from "@/types/MainType";

const BoxComments = ({
  _id,
  handleComment,
  fakeDataPostCard,
  setFakeDataPostCard,
}: {
  _id: string;
  handleComment: any;
  fakeDataPostCard: fakeDataProps;
  setFakeDataPostCard: Dispatch<SetStateAction<fakeDataProps>>;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<DataProps>({
    likes: [],
    comments: [],
  });

  const LoadComments = () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    GetAllCommentsByPost(_id)
      .then((response) => {
        if (response.success) {
          setData({
            ...data,
            comments: response.data,
          });
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };
  useEffect(() => {
    LoadComments();
  }, [_id]);
  return (
    <div className="max-h-[200px] space-y-8 overflow-y-auto p-8">
      {data.comments?.length > 0 ? (
        data.comments.map((comment) => (
          <CommentItem
            comment={comment}
            key={comment._id}
            handleComment={handleComment}
            fakeDataPostCard={fakeDataPostCard}
            setFakeDataPostCard={setFakeDataPostCard}
            fakeDataBoxComments={data}
            setFakeDataBoxComments={setData}
          />
        ))
      ) : (
        <div>No comments on this post.</div>
      )}
    </div>
  );
};
export default BoxComments;
