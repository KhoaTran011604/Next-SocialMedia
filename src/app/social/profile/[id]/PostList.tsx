"use client";
import { GetAllPost } from "@/api/postService";
import PostCard from "@/components/Social/PostCard";
import { useAuth } from "@/context/auth";
import { Filter, ItemPostProps } from "@/types/MainType";
import useStore from "@/zustand/store";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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
