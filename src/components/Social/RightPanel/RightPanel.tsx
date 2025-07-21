import ActiveNowCard from "./ActiveNowCard";
import BirthdayCard from "./BirthdayCard";
import FriendRequest from "./FriendRequest";
import YouMayKnowCard from "./YouMayKnowCard";

const RightPanel = () => {
  return (
    <aside
      className={
        "sticky top-0 hidden h-screen w-full max-w-[290px] overflow-hidden bg-transparent p-0 transition-[width] duration-200 ease-linear dark:text-white/90 lg:block lg:p-4"
      }
    >
      <div className="flex h-full flex-col rounded-lg">
        <FriendRequest />
        <YouMayKnowCard />
        <BirthdayCard />
        <ActiveNowCard
          users={[
            { initials: "AM", name: "Alex Morgan" },
            { initials: "JL", name: "Jessica Lee" },
            { initials: "RT", name: "Ryan Thompson" },
          ]}
        />
      </div>
    </aside>
  );
};
export default RightPanel;
