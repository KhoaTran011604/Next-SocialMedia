import { Proxy } from './Proxy';

export async function apiLogin(request: any) {
  return await Proxy('post', '/login', request, false);
}

export async function SignUp(request: any) {
  return await Proxy('post', '/signup', request, false);
}

export async function UpdateUserProfile(id: string, request: any) {
  return await Proxy(
    'post_multi',
    '/update-user-profile/' + id,
    request,
    false
  );
}

export async function SeachUserProfiles(id: string, request: any) {
  return await Proxy('post', '/search-profile/' + id, request, false);
}

export async function AuthVertify(request: any) {
  return await Proxy('post', '/auth-vertify/', request, true);
}

export async function RefreshToken(request: any) {
  return await Proxy('post', '/refresh-token/', request, false);
}
