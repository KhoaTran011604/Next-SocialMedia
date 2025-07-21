import { PropsWithChildren } from "react";

const NestedLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <aside>Nested Sidebar</aside>
      <section>{children}</section>
    </div>
  );
};

export default NestedLayout;
