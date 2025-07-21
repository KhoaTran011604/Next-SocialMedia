import {
  HeartIcon,
  MessageCircleIcon,
  MoreHorizontalIcon,
  ShareIcon,
} from "lucide-react";
import ActionButton from "./ActionButton";
import { imageProps, ItemPostProps } from "@/types/MainType";
import BoxImages from "./BoxImages";

const PostCard = ({
  userId,
  content,
  images,
  hashTags,
  likes,
  comments,
  createdAt,
}: ItemPostProps) => (
  <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
    <div className="p-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          {userId.images.length > 0 && (
            <img
              src={userId.images[0].imageAbsolutePath}
              alt={userId.fullName}
              className="h-10 w-10 rounded-full border border-gray-200 object-cover"
            />
          )}
          <div className="ml-3">
            <div className="text-sm font-semibold text-gray-900 dark:text-white/90">
              {userId.fullName}
            </div>
            {/* <div className="text-xs text-gray-500">{createdAt}</div> */}
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-500">
          <MoreHorizontalIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="mt-3 text-sm text-gray-800 dark:text-white/90">
        {content}
      </div>

      {/* Image (if available) */}

      <BoxImages images={images} />

      {/* Stats */}
      <div className="mt-3 flex justify-between border-t-2 border-gray-100 pt-2 text-xs text-gray-500 dark:border-gray-800">
        <span>{likes.length + 100} likes</span>
        <span>{comments.length + 100} comments</span>
      </div>

      {/* Actions */}
      <div className="mt-2 flex justify-between border-t-2 border-gray-100 pt-2 dark:border-gray-800">
        <ActionButton icon={<HeartIcon />} label="Like" />
        <ActionButton icon={<MessageCircleIcon />} label="Comment" />
        <ActionButton icon={<ShareIcon />} label="Share" />
      </div>
    </div>
  </div>
);

export default PostCard;
