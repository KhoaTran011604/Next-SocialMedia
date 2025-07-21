import React from "react";
import PostList from "./PostList";
import NewPost from "./NewPost";
import QuickInfo from "./QuickInfo";

const page = () => {
  return (
    <div className="">
      {/* <NewPost /> */}
      <QuickInfo />
      <PostList />
    </div>
  );
};

export default page;
