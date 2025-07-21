import { Proxy } from "./Proxy";



export async function GetAllPost(request: any) {

    return await Proxy("post", "/post/get-all", request);
}

export async function GetAllPostFK(request: any) {

    return await Proxy("post", "/post/get-all-fk", request);
}

export async function SavePost(request: any) {

    return await Proxy("post", "/post/create", request);
}

export async function SavePost_UploadMutli(request: any) {

    return await Proxy("post_multi", "/post/create-upload-multi", request);
}

export async function UpdatePost(id: string, request: any) {

    return await Proxy("post", "/post/update/" + id, request);
}

export async function UpdatePost_UploadMutli(id: string, request: any) {

    return await Proxy("post_multi", "/post/update-upload-multi/" + id, request);
}

export async function SeachPost(id: string, request: any) {

    return await Proxy("post", "/post/search/" + id, request);
}

export async function DeletePost(id: string, request: any) {

    return await Proxy("post", "/post/delete/" + id, request);
}

export async function ImportPost(request: any) {

    return await Proxy("post", "/post/import", request);
}
export async function ExportPost(request: any) {

    return await Proxy("post", "/post/export", request);
}

export async function ExportAllPost() {

    return await Proxy("post", "/post/export-all");
}
