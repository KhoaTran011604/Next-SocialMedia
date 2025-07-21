import { Proxy } from "./Proxy";



export async function GetAllProduct(request: any) {

    return await Proxy("post", "/product/get-all", request);
}

export async function GetAllProductFK(request: any) {

    return await Proxy("post", "/product/get-all-fk", request);
}

export async function SaveProduct(request: any) {

    return await Proxy("post", "/product/create", request);
}

export async function SaveProduct_UploadMutli(request: any) {

    return await Proxy("post_multi", "/product/create-upload-multi", request);
}

export async function UpdateProduct(id: string, request: any) {

    return await Proxy("post", "/product/update/" + id, request);
}

export async function UpdateProduct_UploadMutli(id: string, request: any) {

    return await Proxy("post_multi", "/product/update-upload-multi/" + id, request);
}

export async function SeachProduct(id: string, request: any) {

    return await Proxy("post", "/product/search/" + id, request);
}

export async function DeleteProduct(id: string, request: any) {

    return await Proxy("post", "/product/delete/" + id, request);
}

export async function ImportProduct(request: any) {

    return await Proxy("post", "/product/import", request);
}
export async function ExportProduct(request: any) {

    return await Proxy("post", "/product/export", request);
}

export async function ExportAllProduct() {

    return await Proxy("post", "/product/export-all");
}
