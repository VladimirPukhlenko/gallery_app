import axios, { AxiosError, AxiosResponse } from "axios";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL;
const statusCode = [401, 402, 403];

export const getAccessTokenServer = async () => {
  const refresh_token = cookies().get("refresh_token_client");
  try {
    const { data } = await axios.get<{ access_token: string }>(
      `${API_URL}/auth/refresh`,
      {
        headers: { Cookie: `refresh_token=${refresh_token?.value}` },
      }
    );
    const { access_token } = data;
    return access_token;
  } catch (error) {
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
          originalRequest.headers.set(
            "Cookie",
            `access_token=${await getAccessTokenServer()}`
          );
          return axios.request(originalRequest);
        } catch (e) {
          return Promise.reject(error);
        }
      }
    }
    return Promise.reject(error);
  }
);
