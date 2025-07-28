"use client";
import {
  CommentPayload,
  CommentResponse,
  DataProps,
  fakeDataProps,
} from "@/types/MainType";
import { Dispatch, KeyboardEvent, SetStateAction, useState } from "react";
import { LuReply } from "react-icons/lu";
import { BiEditAlt } from "react-icons/bi";
import { LuSendHorizontal } from "react-icons/lu";
import { useAuth } from "@/context/auth";
import { formatMessageTime } from "@/lib/format-message-time";
import { toast } from "react-toastify";

const CommentItem = ({
  comment,
  handleComment,
  fakeDataPostCard,
  setFakeDataPostCard,
  fakeDataBoxComments,
  setFakeDataBoxComments,
}: {
  comment: CommentResponse;
  handleComment: (data: CommentPayload) => void;
  fakeDataPostCard: fakeDataProps;
  setFakeDataPostCard: Dispatch<SetStateAction<fakeDataProps>>;
  fakeDataBoxComments: DataProps;
  setFakeDataBoxComments: Dispatch<SetStateAction<DataProps>>;
}) => {
  const auth = useAuth();
  const justNow = new Date().toISOString();
  const initRequest = {
    userId: "",
    postId: comment.postId,
    content: "",
    parentId: comment._id,
    createdAt: justNow,
  };

  const [isRepply, setIsRepply] = useState<boolean>(false);
  const [request, setRequest] = useState<CommentPayload>(initRequest);

  const handleSubmit = () => {
    handleComment(request);
    toast.success("completed", {
      position: "bottom-right",
    });
    setFakeDataPostCard({
      ...fakeDataPostCard,
      fakeCommentNum: fakeDataPostCard.fakeCommentNum + 1,
    });
    const justNow = new Date().toISOString();
    setFakeDataBoxComments({
      ...fakeDataBoxComments,
      comments: [
        ...fakeDataBoxComments.comments,
        {
          _id: Math.random().toString(),
          content: request.content,
          createdAt: justNow,
          postId: request.postId,
          userId: {
            _id: auth?.user?.id,
            fullName: auth?.user?.fullName,
            images: [
              {
                imageAbsolutePath:
                  auth?.user?.profilePic || "/images/user/default-user.png",
                fileName: "",
                imageBase64String: "",
                imageFile: null,
                isNewUpload: false,
              },
            ],
          },
          ...(isRepply && {
            parentId: {
              _id: comment._id,
              content: comment.content,
              createdAt: comment.createdAt,
            },
          }),
        },
      ],
    });
    setRequest(initRequest);
    handleComment({
      ...request,
      userId: auth.user.id,
    });
    setIsRepply(false);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div>
      {comment.parentId && (
        <div className="flex items-center gap-4 pl-8">
          <LuReply className="scale-x-[-1]" />

          <h2 className="iliac max-w-[100px] overflow-x-hidden truncate rounded-md bg-amber-200 px-4 italic lg:max-w-[250px]">
            {`' ${comment.parentId.content} '`}
          </h2>
        </div>
      )}
      <div className="mt-2 flex justify-between gap-4">
        <img
          src={
            comment?.userId?.images.length > 0
              ? comment?.userId?.images[0].imageAbsolutePath
              : "/images/user/default-user.png"
          }
          alt="Current User"
          className="h-10 w-10 rounded-full border border-gray-200 object-cover"
        />
        <div className="flex w-[90%] items-start justify-between border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col">
            <h1 className="max-w-[150px] overflow-x-hidden truncate font-medium lg:max-w-[300px]">
              {`${comment.userId.fullName} - ${formatMessageTime(comment.createdAt)}`}
            </h1>
            <h1 className="max-w-[150px] overflow-x-hidden truncate lg:max-w-[300px]">
              {comment.content}
            </h1>
          </div>
          <button
            className="hover:text-primary"
            onClick={() => setIsRepply(!isRepply)}
          >
            <LuReply />
          </button>
        </div>
      </div>
      {isRepply && (
        <div className="mt-4 pl-4">
          <div className="flex items-center gap-4 rounded-xl border border-gray-200 p-2 px-4 dark:border-gray-800">
            <BiEditAlt />
            <input
              type="text"
              value={request.content}
              onChange={(e) =>
                setRequest({
                  ...request,
                  content: e.target.value,
                })
              }
              onKeyDown={handleKeyDown}
              placeholder="What's repply?"
              className="ml-3 flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none"
            />
            <button
              className={` ${request.content.length == 0 ? "cursor-not-allowed" : "hover:text-primary"}`}
              disabled={request.content.length == 0}
              onClick={() => {
                handleSubmit();
              }}
            >
              <LuSendHorizontal />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
