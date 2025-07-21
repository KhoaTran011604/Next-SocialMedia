import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PostList from "./PostListList";

export const dynamic = "force-dynamic"; // nếu cần revalidate mỗi lần truy cập

export default async function PostsPage() {
  return (
    <>
      <Breadcrumb pageName="Posts" />
      <PostList initialPosts={[]} />
    </>
  );
}
