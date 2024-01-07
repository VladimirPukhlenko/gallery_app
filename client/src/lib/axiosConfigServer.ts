import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { headers } from "next/headers";

const API_URL = process.env.API_URL;
const statusCode = [401, 402, 403];

export const getAccessTokenServer = async (token?: string) => {
  const cookies = headers().get("cookie");
  // console.log(cookies);
  try {
    const res = await axios.get(`${API_URL}/auth/refresh`, {
      headers: { Cookie: token || cookies },
    });
    // console.log(res);
    const access_token = res.headers["set-cookie"]?.join(" ");
    // console.log(access_token);
    return access_token;
  } catch (error) {
    // console.log(error);
    throw error;
  }
};

export const AxiosInstanceServer = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

AxiosInstanceServer.interceptors.response.use(
  (res: AxiosResponse) => {
    return res;
  },
  async (error: AxiosError) => {
    if (error.response && statusCode.includes(error.response.status)) {
      const originalRequest = error.config;
      if (originalRequest) {
        try {
          const access_token = await getAccessTokenServer();
          if (access_token) {
            originalRequest.headers["Cookie"] = access_token;
            return axios.request(originalRequest);
          }
        } catch (e) {
          return Promise.reject(error);
        }
      }
    }
    return Promise.reject(error);
  }
);
