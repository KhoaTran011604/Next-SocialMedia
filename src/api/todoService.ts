import { Proxy } from './Proxy';

export async function GetAllTodo(request: any) {
  return await Proxy('post', '/todo/get-all', request);
}

export async function GetCompletedTodo(request: any) {
  return await Proxy('post', '/todo/get-completed', request);
}

export async function GetAllTodoFK(request: any) {
  return await Proxy('post', '/todo/get-all-fk', request);
}

export async function CreateTodo(request: any) {
  return await Proxy('post', '/todo/create', request);
}
export async function SeachTodo(id: string, request: any) {
  return await Proxy('post', '/todo/search/' + id, request);
}

export async function UpdateTodo(id: string, request: any) {
  return await Proxy('post', '/todo/update/' + id, request);
}

export async function CompletedTodo(id: string, request: any) {
  return await Proxy('post', '/todo/completed/' + id, request);
}

export async function DeleteTodo(id: string, request: any) {
  return await Proxy('post', '/todo/delete/' + id, request);
}

export async function GetAllTodo_WithoutPanigation(request: any) {
  return await Proxy('post', '/todo/get-all-no-panigation', request);
}
export async function GetCompletedTodo_WithoutPanigation(request: any) {
  return await Proxy('post', '/todo/get-completed-no-panigation', request);
}
