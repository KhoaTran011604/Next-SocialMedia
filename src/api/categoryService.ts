import { Proxy } from "./Proxy";



export async function GetAllCategory(request: any) {

    return await Proxy("post", "/category/get-all", request);
}

export async function GetAllCategoryFK(request: any) {

    return await Proxy("post", "/category/get-all-fk", request);
}

export async function SaveCategory(request: any) {

    return await Proxy("post", "/category/create", request);
}
export async function SeachCategory(id: string, request: any) {

    return await Proxy("post", "/category/search/" + id, request);
}

export async function UpdateCategory(id: string, request: any) {

    return await Proxy("post", "/category/update/" + id, request);
}

export async function DeleteCategory(id: string, request: any) {

    return await Proxy("post", "/category/delete/" + id, request);
}