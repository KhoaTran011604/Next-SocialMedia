"use client";
import { useEffect, useState } from "react";

import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { useChatStore } from "@/zustand/useChatStore";
import { useAuthStore } from "@/zustand/useAuthStore";

const UserOnlineSidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const dataAuthStore = useAuthStore();
  const { onlineUsers } = dataAuthStore;
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user: any) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="flex h-full w-full flex-col transition-all duration-200">
      <div className="w-full border-b border-gray-200 p-5 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium">Contacts</span>
        </div>

        {/* Online filter toggle */}
        <div className="mt-3 flex items-center gap-2">
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
        {filteredUsers.map((user: any) => (
          <button
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
              dataAuthStore.setSelectedUser({ ...user, id: user._id });
            }}
            className={`hover:bg-base-300 flex w-full items-center gap-3 p-3 transition-colors ${
              selectedUser?._id === user._id
                ? "bg-base-300 ring-base-300 ring-1"
                : ""
            }`}
          >
            <div className="relative size-12 flex-shrink-0">
              <img
                src={
                  user.images.length > 0
                    ? user.images[0].imageAbsolutePath
                    : "/images/user/default-user.png"
                }
                alt={user.fullName}
                className="size-12 overflow-hidden rounded-full object-cover"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 ring-2 ring-zinc-900" />
              )}
            </div>

            <div className="min-w-0 flex-1 text-left">
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
