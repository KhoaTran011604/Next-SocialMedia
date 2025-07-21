import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CategoryList from "./CategoryList";

export const dynamic = "force-dynamic"; // nếu cần revalidate mỗi lần truy cập

export default async function CategoryPage() {
  return (
    <>
      <Breadcrumb pageName="Categories" />
      <CategoryList initialCategory={[]} />
    </>
  );
}
