import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UserList from "./UserList";

export const dynamic = "force-dynamic"; // nếu cần revalidate mỗi lần truy cập

export default async function UsersPage() {
  return (
    <>
      <Breadcrumb pageName="Users" />
      <UserList initialUsers={[]} />
    </>
  );
}
