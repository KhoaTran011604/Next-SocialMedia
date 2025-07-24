"use client";

import PostCard from "@/components/Social/PostCard";

import { ItemPostProps } from "@/types/MainType";

const PostList = ({ data }: { data: ItemPostProps[] }) => {
  return (
    <div>
      <div className="space-y-4">
        {data.map((item, idx) => (
          <PostCard key={idx} {...item} />
        ))}
      </div>
    </div>
  );
};

export default PostList;
