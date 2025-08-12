import jwtDecode from "jwt-decode";
import http from "./httpService";
import config from "../config.json";

const registerApiEndPoint = config.userApi + "/sign-up";
const loginApiEndPoint = config.userApi + "/login";
const tokenKey = "token";

http.setJwt(getJwtFromLocalStorage());

export function register(user_email: string, user_pwd: string) {
  return http.post(registerApiEndPoint, {
    user_email,
    user_pwd,
  });
}

export async function login(user_email: string, user_pwd: string) {
  const res = await http.post(loginApiEndPoint, {
    user_email,
    user_pwd,
  });
  const { token } = res.data;
  localStorage.setItem(tokenKey, token);
  window.location.href = "/";
}

export function logout() {
  localStorage.removeItem(tokenKey);
  window.location.href = "/";
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    if (jwt) {
      return jwtDecode(jwt) as { uuid: string; user_email: string };
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export function getJwtFromLocalStorage() {
  return localStorage.getItem(tokenKey);
}

export default {
  register,
  login,
  logout,
  getCurrentUser,
  getJwtFromLocalStorage,
};
