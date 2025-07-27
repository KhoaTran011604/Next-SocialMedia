"use client";
import { GetAllPostByUserId } from "@/api/postService";
import { CreateComment, DeleteComment, LikeToggle } from "@/api/socialService";
import PostCard from "@/components/Social/PostCard";
import {
  CommentPayload,
  Filter,
  ItemPostProps,
  LikePayload,
} from "@/types/MainType";
import useStore from "@/zustand/store";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import NewPost from "./NewPost";
import { SkeletonPostCard } from "@/components/Social/SkeletonPostCard ";
import { Button } from "@/components/ui/button";
import { debounce } from "lodash";

const filterInit: Filter = {
  keySearch: "",
  sort: {},
  page: 1,
  pageSize: 10,
  sessionCode: Math.random().toString(),
};

const PostList = () => {
  const queryClient = useQueryClient();
  const zustand = useStore();
  const { isLoading, setIsLoading, setHasDataChanged } = zustand;

  const [data, setData] = useState<ItemPostProps[]>([]);
  const [filterPage, setFilterPage] = useState<Filter>(filterInit);
  const [hasMore, setHasMore] = useState(true);

  const anchorRef = useRef<HTMLDivElement>(null); // phần tử neo để giữ vị trí

  const LoadData = (isLoadMore = false) => {
    if (isLoading) return;
    setIsLoading(true);

    let prevTop = 0;
    if (isLoadMore && anchorRef.current) {
      prevTop = anchorRef.current.getBoundingClientRect().top;
    }

    GetAllPostByUserId(filterPage)
      .then((response) => {
        if (response.success) {
          const newData = response.data;

          if (isLoadMore) {
            setData((prev) => [...prev, ...newData]);
          } else {
            setData(newData);
          }

          if (newData.length < filterPage.pageSize) {
            setHasMore(false);
          }

          queryClient.setQueryData(["#postList"], () => newData);
          setHasDataChanged(false);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);

        if (isLoadMore && anchorRef.current) {
          // sau render, scroll lại để giữ nguyên vị trí anchor
          requestAnimationFrame(() => {
            const newTop = anchorRef.current!.getBoundingClientRect().top;
            const delta = newTop - prevTop;
            window.scrollBy({ top: delta, behavior: "auto" });
          });
        }
      });
  };

  const handleComment = (comment: CommentPayload) => {
    if (isLoading) return;
    setIsLoading(true);
    CreateComment(comment).finally(() => setIsLoading(false));
  };

  const handleDeleteComment = (id: string) => {
    if (isLoading) return;
    setIsLoading(true);
    DeleteComment(id).finally(() => setIsLoading(false));
  };

  const handleLike = (comment: LikePayload) => {
    if (isLoading) return;
    setIsLoading(true);
    LikeToggle(comment).finally(() => setIsLoading(false));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    LoadData();
  }, []);

  useEffect(() => {
    if (filterPage.page !== 1) {
      LoadData(true); // load more
    }
  }, [filterPage.page]);

  const handleLoadMore = useCallback(
    debounce(() => {
      setFilterPage((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }, 700),
    [],
  );

  const LoadingComponent = () => {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <div className="flex h-20 w-20 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-blue-400 text-4xl text-blue-400">
          <div className="flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-red-400 text-2xl text-red-400"></div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <NewPost data={data} setData={setData} />

      <div className="space-y-4">
        {isLoading && data.length === 0 ? (
          <SkeletonPostCard />
        ) : (
          data.map((item, idx) => (
            <div key={item._id} ref={idx === 0 ? anchorRef : null}>
              <PostCard
                {...item}
                handleComment={handleComment}
                handleDeleteComment={handleDeleteComment}
                handleLike={handleLike}
              />
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center py-6">
        {isLoading && data.length > 0 ? (
          <LoadingComponent />
        ) : hasMore ? (
          <Button onClick={handleLoadMore} className="my-16">
            Load more
          </Button>
        ) : (
          <span className="text-sm text-gray-400">No more posts.</span>
        )}
      </div>
    </div>
  );
};

export default PostList;
