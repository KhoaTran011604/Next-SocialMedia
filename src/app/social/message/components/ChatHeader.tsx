import { useAuth } from "@/context/auth";
import { useAuthStore } from "@/zustand/useAuthStore";
import { useChatStore } from "@/zustand/useChatStore";
import { X } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const dataAuthStore = useAuthStore();
  const { onlineUsers } = dataAuthStore;

  return (
    <div className="border-base-300 border-b p-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="relative size-10 rounded-full">
              <img
                src={
                  selectedUser && selectedUser.images.length > 0
                    ? selectedUser.images[0].imageAbsolutePath
                    : "/images/user/default-user.png"
                }
                alt={selectedUser?.fullName}
                className="rounded-full"
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser?.fullName}</h3>
            <p className="text-base-content/70 text-sm">
              {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
