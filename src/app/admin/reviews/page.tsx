import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ReviewList from "./ReviewList";

export const dynamic = "force-dynamic"; // nếu cần revalidate mỗi lần truy cập

export default async function ReviewsPage() {
  return (
    <>
      <Breadcrumb pageName="Reviews" />
      <ReviewList initialReviews={[]} />
    </>
  );
}
