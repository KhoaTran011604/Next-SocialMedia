import React from "react";
import HD_Input from "../common/HD_Input";
import { Button } from "../ui/button";

type DetailItem = {
  id: number | null;
  color: string;
  size: string;
  quantity: number | string;
};

type AddVariantsProductProps = {
  isEdit?: boolean;
  isConfirm?: boolean;
  initData?: DetailItem[];
  onChange: (newDetail: DetailItem[]) => void;
};

const INIT_REQUEST: DetailItem = {
  id: null,
  color: "",
  size: "",
  quantity: "",
};

const AddVariantsProduct: React.FC<AddVariantsProductProps> = ({
  isEdit = false,
  isConfirm = false,
  initData = [],
  onChange,
}) => {
  const [request, setRequest] = React.useState<DetailItem>(INIT_REQUEST);
  const [detail, setDetail] = React.useState<DetailItem[]>([]);
  const [errors, setErrors] = React.useState<string[]>([]);

  const onValidate = () => {
    const listError: string[] = [];
    if (!request.color) listError.push("color");
    if (!request.size) listError.push("size");
    if (request.quantity === "" || request.quantity == null)
      listError.push("quantity");

    setErrors(listError);
    return listError.length === 0;
  };

  const handleChangeDetail = () => {
    if (!onValidate()) return;

    const parsedQuantity = Number(request.quantity);
    const quantity = isNaN(parsedQuantity) ? 0 : parsedQuantity;

    let newDetail: DetailItem[] = [];

    if (request.id == null) {
      newDetail = [
        ...detail,
        {
          ...request,
          id: Math.random(),
          quantity,
        },
      ];
    } else {
      const index = detail.findIndex((d) => d.id === request.id);
      if (index !== -1) {
        newDetail = [...detail];
        newDetail[index] = { ...request, quantity };
      }
    }

    setDetail(newDetail);
    onChange(newDetail);
    setRequest(INIT_REQUEST);
    setErrors([]);
  };

  const handleDeleteItem = (itemDelete: DetailItem) => {
    const filtered = detail.filter((item) => item.id !== itemDelete.id);
    setDetail(filtered);
    onChange(filtered);
    if (itemDelete.id === request.id) {
      setRequest({ ...INIT_REQUEST });
    }
  };

  React.useEffect(() => {
    if (initData?.length) setDetail(initData);
  }, [initData]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 rounded-lg border border-gray-300 p-2 dark:border-gray-800 md:grid-cols-4">
        {(!isEdit || (isEdit && !isConfirm)) && (
          <>
            <div>
              <HD_Input
                {...{
                  error: errors.includes("color"),
                  hint: errors.includes("color") ? "Required field" : "",
                }}
                title="Color"
                name="color"
                placeholder=""
                isItemForm={false}
                initValue={request.color}
                onChange={(value) =>
                  setRequest({
                    ...request,
                    color: value,
                  })
                }
              />
            </div>
            <div>
              <HD_Input
                {...{
                  error: errors.includes("size"),
                  hint: errors.includes("size") ? "Required field" : "",
                }}
                title="Size"
                name="size"
                placeholder=""
                isItemForm={false}
                initValue={request.size}
                onChange={(value) =>
                  setRequest({
                    ...request,
                    size: value,
                  })
                }
              />
            </div>
            <div>
              <HD_Input
                {...{
                  error: errors.includes("quantity"),
                  hint: errors.includes("quantity") ? "Required field" : "",
                }}
                title="Qty"
                name="quantity"
                type="number"
                placeholder=""
                isItemForm={true}
                initValue={request.quantity}
                onChange={(value) =>
                  setRequest({
                    ...request,
                    quantity: value,
                  })
                }
              />
            </div>
            <div className="m-auto space-x-2 text-end">
              <Button
                className="mt-6"
                variant="outline"
                type="button"
                onClick={() => {
                  setRequest(INIT_REQUEST);
                  setErrors([]);
                }}
              >
                Reset
              </Button>
              <Button
                className="mt-6"
                type="button"
                onClick={handleChangeDetail}
              >
                {request.id ? "Update" : "Add"}
              </Button>
            </div>
          </>
        )}

        {detail.length > 0 && (
          <>
            <div className="col-span-full my-2 border-t border-gray-300 dark:border-gray-800"></div>
            <div className="col-span-full">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="px-6 py-3">Color</th>
                      <th className="px-6 py-3">Size</th>
                      <th className="px-6 py-3 text-end">Quantity</th>
                      <th className="px-6 py-3 text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.map((item) => (
                      <tr
                        key={Math.random()}
                        className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                        onClick={() => setRequest(item)}
                      >
                        <td className="px-6 py-4">{item.color}</td>
                        <td className="px-6 py-4">{item.size}</td>
                        <td className="px-6 py-4 text-end">{item.quantity}</td>
                        <td className="px-6 py-4 text-end">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isEdit && isConfirm}
                            onClick={(e) => {
                              e.stopPropagation(); // tránh trigger setRequest
                              handleDeleteItem(item);
                            }}
                          >
                            x
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddVariantsProduct;
