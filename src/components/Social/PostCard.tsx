"use client";
import {
  HeartIcon,
  MessageCircleIcon,
  MoreHorizontalIcon,
  ShareIcon,
} from "lucide-react";
import ActionButton from "./ActionButton";
import {
  CommentPayload,
  CommentResponse,
  imageProps,
  ItemPostProps,
  LikeResponse,
} from "@/types/MainType";
import BoxImages from "./BoxImages";
import { useEffect, useState } from "react";
import VariantModal from "./VariantModal";
import { GetAllCommentsByPost, GetAllLikesByPost } from "@/api/socialService";
import CommentItem from "./CommentItem";
import LikeItem from "./LikeItem";
import { useAuth } from "@/context/auth";
import Link from "next/link";
import { formatMessageTime } from "@/lib/format-message-time";
import { IoSendOutline } from "react-icons/io5";
interface DataProps {
  likes: LikeResponse[];
  comments: CommentResponse[];
}

const PostCard = ({
  userId,
  _id,
  content,
  images,
  hashTags,
  likes,
  comments,
  likeCount,
  commentCount,
  createdAt,
  handleLike,
  handleComment,
  handleDeleteComment,
  isLike,
}: ItemPostProps) => {
  const initRequest = {
    userId: userId._id,
    postId: _id,
    content: "",
  };
  const auth = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [post, setPost] = useState<ItemPostProps>();
  const [openModalLike, setOpenModalLike] = useState<boolean>(false);
  const [request, setRequest] = useState<CommentPayload>(initRequest);
  const [openCmtInput, setOpenCmtInput] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLikePost, setIsLikePost] = useState<boolean>(false);
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
    if (open) {
      LoadComments();
    }
  }, [open]);
  useEffect(() => {
    if (openModalLike) {
      LoadLikes();
    }
  }, [openModalLike]);
  useEffect(() => {
    setIsLikePost(isLike);
  }, []);
  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {userId.images.length > 0 && (
              <img
                src={userId.images[0].imageAbsolutePath}
                alt={userId.fullName}
                className="h-10 w-10 rounded-full border border-gray-200 object-cover"
              />
            )}
            <Link href={`/social/profile/${userId._id}`}>
              <div className="text-sm font-semibold text-gray-900 dark:text-white/90">
                {userId.fullName}
              </div>
              <div className="text-xs text-gray-500">
                {formatMessageTime(createdAt)}
              </div>
            </Link>
          </div>
          {userId._id === auth?.user.id && (
            <button className="text-gray-400 hover:text-gray-500">
              <MoreHorizontalIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="mb-2 mt-4 text-sm text-gray-800 dark:text-white/90">
          {content}
        </div>

        {/* Image (if available) */}

        <BoxImages images={images} />

        {/* Stats */}
        <div className="mt-3 flex justify-between border-t-2 border-gray-100 pt-2 text-xs text-gray-500 dark:border-gray-800">
          <span
            className="cursor-pointer"
            onClick={() => {
              setOpenModalLike(true);
            }}
          >
            {likeCount || ""} likes
          </span>
          <span
            className="cursor-pointer"
            onClick={() => {
              setOpen(true);
            }}
          >
            {commentCount || ""} comments
          </span>
        </div>

        {/* Actions */}
        <div className="mt-2 flex justify-between border-t-2 border-gray-100 pt-2 dark:border-gray-800">
          <ActionButton
            onClick={() => {
              handleLike({ userId: auth.user.id, postId: _id, isLike: true });
              setIsLikePost(!isLikePost);
            }}
            icon={
              <HeartIcon className={`${isLikePost ? "text-red-500" : ""}`} />
            }
            label="Like"
          />
          <ActionButton
            onClick={() => {
              setOpenCmtInput(!openCmtInput);
            }}
            icon={<MessageCircleIcon />}
            label="Comment"
          />
          <ActionButton icon={<ShareIcon />} label="Share" />
        </div>

        {openCmtInput && (
          <div className="mt-2 flex justify-between gap-4 border-t-2 border-gray-100 pt-2 dark:border-gray-800">
            <img
              src="https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=150"
              alt="Current User"
              className="h-10 w-10 rounded-full border border-gray-200 object-cover"
            />
            <input
              type="text"
              value={request.content}
              onChange={(e) =>
                setRequest({
                  ...request,
                  content: e.target.value,
                })
              }
              placeholder="..."
              className="ml-3 flex-1 rounded-md bg-gray-100 px-4 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            />
            <button
              className={`${request.content.length === 0 ? "cursor-not-allowed" : "hover:text-primary"} `}
              disabled={request.content.length === 0}
              onClick={() => {
                handleComment(request);
                setRequest(initRequest);
              }}
            >
              <IoSendOutline />
            </button>
          </div>
        )}
      </div>

      <VariantModal
        open={open}
        setOpen={setOpen}
        onClose={() => {
          setOpen(false);
        }}
        title={"List Comment"}
        onConfirm={() => {}}
        hiddenButtomConfirm={true}
        textButtomClose="Close"
        variant=""
        textButtomConfirm=""
      >
        <div className="max-h-[200px] space-y-8 overflow-y-auto p-8">
          {data.comments?.length > 0 ? (
            data.comments.map((comment) => (
              <CommentItem
                comment={comment}
                key={comment._id}
                handleComment={handleComment}
              />
            ))
          ) : (
            <div>No comments on this post.</div>
          )}
        </div>
      </VariantModal>

      <VariantModal
        open={openModalLike}
        setOpen={setOpenModalLike}
        onClose={() => {
          setOpenModalLike(false);
        }}
        title={"List Like"}
        onConfirm={() => {}}
        hiddenButtomConfirm={true}
        textButtomClose="Close"
        variant=""
        textButtomConfirm=""
      >
        <div className="max-h-[200px] space-y-8 overflow-y-auto p-8">
          {data.likes?.length > 0 ? (
            data.likes.map((like) => <LikeItem like={like} key={like._id} />)
          ) : (
            <div>No one likes this post. </div>
          )}
        </div>
      </VariantModal>
    </div>
  );
};

export default PostCard;
