"use client";
import { formatMessageTime } from "@/lib/format-message-time";
import { LikeResponse } from "@/types/MainType";

const LikeItem = ({ like }: { like: LikeResponse }) => {
  return (
    <div>
      <div className="mt-2 flex justify-between gap-4">
        <img
          src={
            like?.userId?.images.length > 0
              ? like?.userId?.images[0].imageAbsolutePath
              : "/images/user/default-user.png"
          }
          alt="Current User"
          className="h-10 w-10 rounded-full border border-gray-200 object-cover"
        />
        <div className="flex w-[90%] flex-col">
          <h1 className="max-w-[150px] overflow-x-hidden truncate font-medium lg:max-w-[300px]">
            {like.userId.fullName}
          </h1>
          <div className="text-sm">{formatMessageTime(like.createdAt)}</div>
        </div>
      </div>
    </div>
  );
};

export default LikeItem;
