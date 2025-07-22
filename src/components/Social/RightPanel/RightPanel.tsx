import ActiveNowCard from "./ActiveNowCard";
import BirthdayCard from "./BirthdayCard";
import FriendRequest from "./FriendRequest";
import YouMayKnowCard from "./YouMayKnowCard";

const RightPanel = () => {
  return (
    <aside
      className={
        "sticky top-0 -z-[1] hidden h-screen w-full max-w-[290px] overflow-hidden bg-transparent p-0 transition-[width] duration-200 ease-linear dark:text-white/90 lg:block lg:p-4"
      }
    >
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
    </aside>
  );
};
export default RightPanel;
