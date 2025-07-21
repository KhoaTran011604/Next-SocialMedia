import React from "react";
import PostList from "./PostList";
import NewPost from "./NewPost";

const page = () => {
  return (
    <div className="">
      <NewPost />
      <PostList />
    </div>
  );
};

export default page;
