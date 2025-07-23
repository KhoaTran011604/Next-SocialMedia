import { ItemPostProps } from "@/types/MainType";
import Link from "next/link";

const QuickInfo = ({ data }: { data: ItemPostProps }) => {
  return (
    <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="relative h-52 bg-gray-100">
        <img
          src="https://res.cloudinary.com/df4dqpvoz/image/upload/v1752753846/cld-sample-2.jpg"
          alt="Cover"
          className="h-full w-full object-cover"
        />

        <div className="absolute -bottom-16 left-6">
          <img
            src={
              data?.userId?.images.length > 0
                ? data.userId.images[0].imageAbsolutePath
                : "/images/user/default-user.png"
            }
            alt="Avatar"
            className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-md"
          />
        </div>
      </div>

      <div className="px-6 pb-6 pt-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {data?.userId?.fullName}
            </h1>
            <p className="text-sm text-gray-600">1.234 friends</p>
            <div className="mt-1 flex -space-x-2">
              <img
                className="h-8 w-8 rounded-full border border-white"
                src="https://randomuser.me/api/portraits/women/65.jpg"
                alt=""
              />
              <img
                className="h-8 w-8 rounded-full border border-white"
                src="https://randomuser.me/api/portraits/men/76.jpg"
                alt=""
              />
              <img
                className="h-8 w-8 rounded-full border border-white"
                src="https://randomuser.me/api/portraits/women/21.jpg"
                alt=""
              />
              <img
                className="h-8 w-8 rounded-full border border-white"
                src="https://randomuser.me/api/portraits/men/90.jpg"
                alt=""
              />
            </div>
          </div>

          <div className="space-x-2">
            <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
              Add Friend
            </button>
            <Link
              href={"/social/message"}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300"
            >
              Message
            </Link>

            <button className="rounded-full bg-gray-100 p-2 hover:bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 12h.01M12 12h.01M18 12h.01"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default QuickInfo;
