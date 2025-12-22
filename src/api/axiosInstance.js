import axios from "axios";
import { Url } from "../config/config";
import store from "../reduxToolkit/store";
const axiosInstance = axios.create({
  baseURL: Url,
  withCredentials: true, // COOKIE-ONLY AUTH
  headers: {
    "Content-Type": "application/json",
  },
});



axiosInstance.interceptors.request.use((config) => {
  const csrf = document.cookie
    .split("; ")
    .find((c) => c.startsWith("csrf_token="))
    ?.split("=")[1];

  if (csrf) config.headers["x-csrf-token"] = csrf;
  return config;
});


axiosInstance.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.endsWith("/user/refresh")
    ) {
      originalRequest._retry = true;
      try {
        await axiosInstance.post("/user/refresh");
        return axiosInstance(originalRequest);
      } catch {
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;

// axiosInstance.interceptors.response.use(
//   res => res,
//   async err => {
//     const originalRequest = err.config;
//     const { wasAuthenticated, loading } = store.getState().auth;

//     // Not a 401 → ignore
//     if (err.response?.status !== 401) {
//        console.log('1')
//       return Promise.reject(err);
//     }

//     // Auth not resolved yet OR user is logged out → do NOT refresh
//     if (loading || !wasAuthenticated) {
//       console.log('2', wasAuthenticated)
//       return Promise.reject(err);
//     }

//     // Never refresh these
//     if (

//       originalRequest.url.endsWith("user/refresh")
//     ) {
//         console.log('3')
//       return Promise.reject(err);
//     }

//     if (!originalRequest._retry) {
//       originalRequest._retry = true;

//       if (!refreshPromise) {
//         refreshPromise = axiosInstance
//           .post("user/refresh")
//           .finally(() => {
//             refreshPromise = null;
//           });
//       }

//       try {
//         await refreshPromise;
//         return axiosInstance(originalRequest);
//       } catch {
//           console.log('4')
//         window.location.href = "/login";
//       }
//     }

//     return Promise.reject(err);
//   }
// );


