import { Proxy } from "./Proxy";



export async function LikeToggle(request: any) {

    return await Proxy("post", "/like-toggle", request);
}

export async function GetAllLikesByPost(id: string) {

    return await Proxy("get", "/all-like-by-post/" + id);
}

export async function CreateComment(request: any) {

    return await Proxy("post", "/comment/create", request);
}

export async function DeleteComment(id: string) {

    return await Proxy("post", "/comment/delete/" + id);
}


export async function DeleteReview(id: string) {

    return await Proxy("post", "/all-like-by-post/" + id);
}

export async function GetAllCommentsByPost(id: string) {

    return await Proxy("get", "/all-comment-by-post/" + id);
}


export async function getUsersForSidebar(request: any) {

    return await Proxy("post", "/message/get-all-user-online", request);
}

export async function GetMessages(userToChatId: string) {

    return await Proxy("get", "/message/get-all-with/" + userToChatId);
}

export async function SendMessage(userToChatId: string, request: any) {

    return await Proxy("post", "/message/send/" + userToChatId, request);
}