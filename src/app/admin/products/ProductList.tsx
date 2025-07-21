"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DeleteProduct, GetAllProduct } from "@/api/productService";
import { useRouter } from "next/navigation";
import useStore from "@/zustand/store";
import { useQueryClient } from "@tanstack/react-query";
import { Filter } from "@/types/MainType";
import { debounce } from "lodash";
import isEqual from "lodash/isEqual";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { SearchIcon, TrashIcon } from "@/assets/icons";
import HD_Input from "@/components/common/HD_Input";
import { toast } from "react-toastify";
import LottieComponent from "@/components/lotties/lottie";
import MyPagination from "@/components/ui/panigation/MyPagination";
import { Checkbox } from "@/components/ui/checkbox";
import DefaultHeader from "@/components/default-header";
import { formatCurrencyVN } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { ProductStatus } from "@/enum/productEnum";
import { PreviewIcon } from "@/components/Tables/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/styles/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import HD_HyperTable from "@/components/HD_HyperTable";
import { AlertModal } from "@/components/common/AlertModal";
import Link from "next/link";
interface Product {
  _id: string;
  name: string;
  price: number;
}
const filterInit = {
  keySearch: "",
  sort: {},
  page: 1,
  pageSize: 10,
  sessionCode: Math.random().toString(),
};
export default function ProductList({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const router = useRouter();
  const zustan = useStore();
  const { hasDataChanged, setHasDataChanged } = zustan;

  const queryClient = useQueryClient();
  const cachedStore = queryClient.getQueryData(["#productList"]);
  const { isLoading, setIsLoading, openAlert, setOpenAlert } = zustan;
  const [data, setData] = useState([]);
  const [filterPage, setFilterPage] = useState<Filter>(filterInit);
  const [keySearch, setKeySearch] = useState<string>("");
  const [itemDelete, setItemDelete] = useState({ name: "", _id: "" });
  const LoadData = () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    GetAllProduct(filterPage)
      .then((response) => {
        if (response.success) {
          setData(response.data);
          queryClient.setQueryData(["#productList"], () => {
            return response.data;
          });
          setHasDataChanged(false);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };
  const handleViewDetail = (id: string) => {
    router.push(`/products/${id}`);
  };
  const handleDeleteConform = (item: any) => {
    setItemDelete(item);
    setOpenAlert(true);
  };
  const handleDelete = (id: string) => {
    DeleteProduct(id, {}).then((res) => {
      if (res.success) {
        LoadData();
        toast.success("Delete Success !", {
          position: "bottom-right",
        });
      } else {
        toast.error("Delete Fail !", {
          position: "bottom-right",
        });
      }
    });
  };
  const onDebounce = useCallback(
    debounce((term: string) => {
      setFilterPage({
        ...filterPage,
        keySearch: term.trim(),
        page: 1,
        sessionCode: Math.random().toString(),
      });
    }, 700),
    [],
  );
  const columnHelper = createColumnHelper<any>();
  const columns: ColumnDef<any, any>[] = [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          onCheckedChange={(value: any) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor("name", {
      header: (info) => <DefaultHeader info={info} name="Info" />,
      cell: (info) => {
        return (
          <div className="flex min-w-fit items-center justify-start gap-3">
            <img
              src={
                info.row.original.images.length > 0
                  ? info.row.original.images[0].imageAbsolutePath
                  : "/images/empty.png"
              }
              loading="lazy"
              className="aspect-[6/5] w-15 rounded-[5px] object-cover"
              width={100}
              height={100}
              alt={"Image for product " + info.row.original.name}
              role="presentation"
            />
            <div>{info.row.original.name}</div>
          </div>
        );
      },
    }),
    columnHelper.accessor("price", {
      header: (info) => <DefaultHeader info={info} name="Price" />,
      cell: (info) => {
        return (
          <div className="min-w-[155px]">
            <h5 className="text-dark dark:text-white">
              {info.row.original.name}
            </h5>
            <p className="mt-[3px] text-body-sm font-medium">
              {`${formatCurrencyVN(info.row.original.price)} `}
            </p>
          </div>
        );
      },
    }),
    columnHelper.accessor("categoryName", {
      header: (info) => <DefaultHeader info={info} name="Category" />,
      cell: (info) => {
        return info.getValue() || "_";
      },
    }),
    columnHelper.accessor("status", {
      header: (info) => <DefaultHeader info={info} name="Status" />,
      cell: (info) => {
        return (
          <div
            className={cn(
              "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
              {
                "bg-[#219653]/[0.08] text-[#219653]":
                  info.row.original.status === ProductStatus.inStock,
                "bg-[#D34053]/[0.08] text-[#D34053]":
                  info.row.original.status === ProductStatus.outOfStock,
                "bg-[#FFA70B]/[0.08] text-[#FFA70B]":
                  info.row.original.status === ProductStatus.pending,
              },
            )}
          >
            {info.row.original.status}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      enableSorting: false,
      header: (info) => <DefaultHeader info={info} name="Actions" />,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-x-3.5">
          <Link
            href={"/admin/products/" + row.original._id}
            className="hover:text-primary"
          >
            <span className="sr-only">View Invoice</span>
            <PreviewIcon />
          </Link>

          <button
            className="hover:text-primary"
            onClick={() => {
              handleDeleteConform({
                _id: row.original._id,
                name: row.original.name,
              });
            }}
          >
            <span className="sr-only">Delete Invoice</span>
            <TrashIcon />
          </button>
        </div>
      ),
    }),
    columnHelper.display({
      id: "more",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-white dark:bg-gray-800"
            align="end"
            onCloseAutoFocus={(e: any) => e.preventDefault()}
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link className="px-2" href={"/admin/products/" + row.original._id}>
              Detail
            </Link>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                handleDeleteConform({
                  _id: row.original._id,
                  name: row.original.name,
                });
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableSorting: false,
      enableHiding: false,
    }),
  ];

  const isFirstLoad = useRef(true); // 👈 đánh dấu lần render đầu tiên

  useEffect(() => {
    if (
      (!isFirstLoad.current && !isEqual(filterPage, filterInit)) ||
      (!isFirstLoad.current && hasDataChanged)
    ) {
      LoadData();
    } else {
      cachedStore ? setData(cachedStore as any) : LoadData();
      isFirstLoad.current = false;
      return;
    }
  }, [filterPage]);

  return (
    <div>
      <AlertModal openAlert={openAlert} setOpenAlert={setOpenAlert}>
        <AlertDialogContent className="bg-white dark:bg-gray-800 sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>{`Are you absolutely sure to delete ?`}</AlertDialogTitle>
            <AlertDialogDescription>
              {`Delete ${itemDelete?.name}`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(itemDelete._id)}>
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertModal>
      <div className="flex items-center justify-between">
        <HD_Input
          name="search"
          placeholder="Search..."
          title=""
          iconPosition="left"
          icon={<SearchIcon />}
          initValue={keySearch}
          onChange={(value: string) => {
            setKeySearch(value);
            onDebounce(value);
          }}
        />
        <Link
          href={"/admin/products/add"}
          className="rounded-md bg-primary px-4 py-2 text-white"
        >
          Add
        </Link>
      </div>
      <div className="space-y-10">
        {isLoading ? (
          <LottieComponent />
        ) : (
          <>
            <HD_HyperTable
              datas={data}
              columns={columns}
              onRowDoubleClick={(item: any) =>
                router.push(`/products/${item._id}`)
              }
            />
            {!isLoading && (
              // <MyPagination
              //   filterPage={filterPage}
              //   setFilterPage={setFilterPage}
              //   totalRecords={100}
              // />
              <></>
            )}
          </>
        )}
      </div>
    </div>
  );
}
