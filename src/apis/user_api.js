import http from "./http";

export const login_api = (email, password) => {
  const path = "/user/login/";
  return http.post(path, { email, password });
};