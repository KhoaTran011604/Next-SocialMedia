import { CommentPayload } from "@/types/MainType";
import { KeyboardEvent, useState } from "react";
import { IoSendOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { Dispatch, SetStateAction } from "react";
import { AuthContextType, useAuth } from "@/context/auth";

interface CommentInputProps {
  postId: string;
  setFakeData: Dispatch<SetStateAction<any>>;
  fakeData: any;
  handleComment: (data: CommentPayload) => void;
  auth: AuthContextType;
}

const CommentInput = ({
  postId,
  setFakeData,
  fakeData,
  handleComment,
  auth,
}: CommentInputProps) => {
  const initRequest: CommentPayload = {
    userId: auth.user.id,
    postId: postId,
    content: "",
  };
  const [request, setRequest] = useState<CommentPayload>(initRequest);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleComment(request);
      toast.success("completed", {
        position: "bottom-right",
      });
      setFakeData({
        ...fakeData,
        fakeCommentNum: fakeData.fakeCommentNum + 1,
      });
      setRequest(initRequest);
    }
  };
  return (
    <div className="mt-2 flex justify-between gap-4 border-t-2 border-gray-100 pt-2 dark:border-gray-800">
      <img
        src={
          auth?.user?.profilePic.length > 0
            ? auth?.user?.profilePic
            : "/images/user/default-user.png"
        }
        alt="Current User"
        className="h-10 w-10 rounded-full border border-gray-200 object-cover"
      />
      <input
        type="text"
        value={request.content}
        onChange={(e) => {
          setRequest({
            ...request,
            content: e.target.value,
          });
        }}
        onKeyDown={handleKeyDown}
        placeholder="..."
        className="ml-3 flex-1 rounded-md bg-gray-100 px-4 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
      />
      <button
        className={`${request.content.length === 0 ? "cursor-not-allowed" : "hover:text-primary"} `}
        disabled={request.content.length === 0}
        onClick={() => {
          handleComment(request);
          toast.success("completed", {
            position: "bottom-right",
          });
          setFakeData({
            ...fakeData,
            fakeCommentNum: fakeData.fakeCommentNum + 1,
          });
          setRequest(initRequest);
        }}
      >
        <IoSendOutline />
      </button>
    </div>
  );
};
export default CommentInput;
