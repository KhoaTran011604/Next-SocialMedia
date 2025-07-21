import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ProductList from "./ProductList";

export const dynamic = "force-dynamic"; // nếu cần revalidate mỗi lần truy cập

export default async function ProductsPage() {
  return (
    <>
      <Breadcrumb pageName="Products" />
      <ProductList initialProducts={[]} />
    </>
  );
}
