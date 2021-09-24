import axios from "axios";
import { parseCookies } from "nookies";

export function getApiClient(ctx?: any) {
  const { "nextauth.token": token } = parseCookies(ctx);

  const api = axios.create({
    baseURL: "http://localhost:3333",
  });

  api.interceptors.request.use((config) => {
    console.log(config);

    return config;
  });

  if (token) {
    api.defaults.headers["Autgorization"] = `Bearer ${token}`;
  }

  return api;
}
