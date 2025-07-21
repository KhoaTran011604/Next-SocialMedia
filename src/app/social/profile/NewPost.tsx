"use client";
import { SavePost } from "@/api/postService";
import { useAuth } from "@/context/auth";
import { PostStatus } from "@/enum/postEnum";
import useStore from "@/zustand/store";
import { useState } from "react";
import { toast } from "react-toastify";

const dataInit = {
  userId: "687b3b0ec73bbfbe7a30237f",
  content: "",
  status: PostStatus.disApprove,
  hashTags: [],
  images: [],
  likes: [],
  comments: [],
};
const NewPost = () => {
  const zustand = useStore();
  const auth = useAuth();
  console.log(auth);

  const { isLoading, setIsLoading, setHasDataChanged } = zustand;
  const [request, setRequest] = useState(dataInit);
  const handlePost = () => {
    if (isLoading) {
      return;
    }
    if (request.content.length == 0) {
      toast.warning("Typing anything !!", {
        position: "bottom-right",
      });
      return;
    }
    setIsLoading(true);
    SavePost({
      ...request,
      userId: auth.user.id,
    })
      .then((res) => {
        if (res.success) {
          toast.success("Post Success!", {
            position: "bottom-right",
          });
          //setOpen(false);
          //LoadData();
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Input Section */}
      <div className="mb-3 flex items-center">
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
          placeholder="What's on your mind?"
          className="ml-3 flex-1 rounded-full bg-gray-100 px-4 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      {/* Form Section */}
      <div>
        <div className="mt-3 flex flex-wrap items-center justify-between border-t-2 border-gray-200 pt-3 dark:border-gray-800">
          {/* Action Buttons */}
          <div className="mb-2 flex space-x-2 sm:mb-0">
            {/* Photo */}
            <button
              type="button"
              className="flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
            >
              <svg
                className="mr-1.5 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <span className="hidden sm:inline">Photo</span>
            </button>

            {/* Tag */}
            <button
              type="button"
              className="flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
            >
              <svg
                className="mr-1.5 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="hidden sm:inline">Tag</span>
            </button>

            {/* Feeling */}
            <button
              type="button"
              className="flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
            >
              <svg
                className="mr-1.5 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
              <span className="hidden sm:inline">Feeling</span>
            </button>

            {/* Location */}
            <button
              type="button"
              className="flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
            >
              <svg
                className="mr-1.5 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="hidden sm:inline">Location</span>
            </button>
          </div>

          {/* Post Button */}
          <button
            className="cursor-pointer rounded-lg bg-gray-200 px-4 py-1.5 text-sm font-medium text-gray-400"
            onClick={handlePost}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};
export default NewPost;
