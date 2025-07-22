"use client";
import { LikeResponse } from "@/types/MainType";

const LikeItem = ({ like }: { like: LikeResponse }) => {
  console.log("like", like);

  return (
    <div>
      <div className="mt-2 flex justify-between gap-4">
        <img
          src="https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=150"
          alt="Current User"
          className="h-10 w-10 rounded-full border border-gray-200 object-cover"
        />
        <div className="flex w-[90%] flex-col">
          <h1 className="max-w-[150px] overflow-x-hidden truncate font-medium lg:max-w-[300px]">
            {like.userId.fullName}
          </h1>
          <div className="text-sm">11:59</div>
        </div>
      </div>
    </div>
  );
};

export default LikeItem;
