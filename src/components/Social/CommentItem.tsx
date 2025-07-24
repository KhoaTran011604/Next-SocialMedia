"use client";
import { CommentPayload, CommentResponse } from "@/types/MainType";
import { useState } from "react";
import { LuReply } from "react-icons/lu";
import { BiEditAlt } from "react-icons/bi";
import { LuSendHorizontal } from "react-icons/lu";
import { useAuth } from "@/context/auth";
import { formatMessageTime } from "@/lib/format-message-time";

const CommentItem = ({
  comment,
  handleComment,
}: {
  comment: CommentResponse;
  handleComment: (data: CommentPayload) => void;
}) => {
  const initRequest = {
    userId: "",
    postId: comment.postId,
    content: "",
    parentId: comment._id,
  };
  const auth = useAuth();
  const [isRepply, setIsRepply] = useState<boolean>(false);
  const [request, setRequest] = useState<CommentPayload>(initRequest);
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
          src="https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=150"
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
              placeholder="What's repply?"
              className="ml-3 flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none"
            />
            <button
              className={` ${request.content.length == 0 ? "cursor-not-allowed" : "hover:text-primary"}`}
              disabled={request.content.length == 0}
              onClick={() => {
                setRequest(initRequest);
                handleComment({
                  ...request,
                  userId: auth.user.id,
                });
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
