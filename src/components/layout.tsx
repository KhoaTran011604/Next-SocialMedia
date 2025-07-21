import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <header>Main Header</header>
      <main>{children}</main>
      <footer>Footer</footer>
    </div>
  );
};

export default Layout;
