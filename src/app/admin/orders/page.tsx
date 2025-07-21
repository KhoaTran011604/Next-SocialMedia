import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import OrderList from "./OrderList";

export const dynamic = "force-dynamic"; // nếu cần revalidate mỗi lần truy cập

export default async function OrdersPage() {
  return (
    <>
      <Breadcrumb pageName="Orders" />
      <OrderList initialOrders={[]} />
    </>
  );
}
