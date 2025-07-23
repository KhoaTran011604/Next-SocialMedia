"use client";
import { useEffect, useState } from "react";

import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { useAuth } from "@/context/auth";

const UserOnlineSidebar = () => {
  const auth = useAuth();
  const { getUsers, users, selectedUser, isUsersLoading } = auth.dataSocketIO;
  const { setSelectedUser } = auth;

  const onlineUsers = auth.dataSocketIO.onlineUsers;
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="border-base-300 flex h-full w-20 flex-col border-r transition-all duration-200 lg:w-72">
      <div className="border-base-300 w-full border-b p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="hidden font-medium lg:block">Contacts</span>
        </div>
        {/* TODO: Online filter toggle */}
        <div className="mt-3 hidden items-center gap-2 lg:flex">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      <div className="w-full overflow-y-auto py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
            }}
            className={`hover:bg-base-300 flex w-full items-center gap-3 p-3 transition-colors ${selectedUser?._id === user._id ? "bg-base-300 ring-base-300 ring-1" : ""} `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={
                  user.images.length > 0
                    ? user.images[0].imageAbsolutePath
                    : "/images/user/default-user.png"
                }
                alt={user.name}
                className="size-12 rounded-full object-cover"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 ring-2 ring-zinc-900" />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden min-w-0 text-left lg:block">
              <div className="truncate font-medium">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="py-4 text-center text-zinc-500">No online users</div>
        )}
      </div>
    </aside>
  );
};
export default UserOnlineSidebar;
