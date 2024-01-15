import axios, { AxiosError, AxiosResponse } from "axios";

const API_URL = process.env.API_URL;
const statusCode = [401, 402, 403];

const getAccessTokenClient = async () => {
  try {
    const { data } = await axios.get<{ access_token: string }>(
      `${API_URL}/auth/refresh`,
      {
        withCredentials: true,
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const AxiosInstanceClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

AxiosInstanceClient.interceptors.response.use(
  (res: AxiosResponse) => {
    return res;
  },
  async (error: AxiosError) => {
    if (error.response && statusCode.includes(error.response.status)) {
      const originalRequest = error.config;
      if (originalRequest) {
        try {
          await getAccessTokenClient();
          return AxiosInstanceClient(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);
