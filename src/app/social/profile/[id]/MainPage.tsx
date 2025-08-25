"use client";
import PostList from "./PostList";
import QuickInfo from "./QuickInfo";
const MainPage = () => {
  return (
    <>
      {/* <NewPost /> */}
      <QuickInfo />
      <h3 className="py-8 text-center text-heading-5 font-bold text-primary dark:text-cyan-800">
        POSTS
      </h3>
      <PostList />
    </>
  );
};
export default MainPage;
