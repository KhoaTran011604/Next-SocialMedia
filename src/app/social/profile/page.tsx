import React from "react";
import PostList from "./PostList";
import NewPost from "./NewPost";
import QuickInfo from "./QuickInfo";

const page = () => {
  return (
    <div className="">
      {/* <NewPost /> */}
      <QuickInfo />
      <h3 className="py-8 text-center text-heading-5 font-bold text-primary dark:text-cyan-800">
        MY POSTS
      </h3>
      <PostList />
    </div>
  );
};

export default page;
