import { Proxy } from "./Proxy";



export async function GetAllReview(request: any) {

    return await Proxy("post", "/review/get-all", request);
}

export async function GetAllReviewFK(request: any) {

    return await Proxy("post", "/review/get-all-fk", request);
}

export async function SaveReview(request: any) {

    return await Proxy("post", "/review/create", request);
}
export async function SeachReview(id: string, request: any) {

    return await Proxy("post", "/review/search/" + id, request);
}

export async function UpdateReview(id: string, request: any) {

    return await Proxy("post", "/review/update/" + id, request);
}

export async function DeleteReview(id: string, request: any) {

    return await Proxy("post", "/review/delete/" + id, request);
}