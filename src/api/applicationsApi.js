import axios from "axios";
import axiosInstance from "./axiosInstance";
import { Url as NodeUrl } from "../config/config";

/**
 * --------------------
 * NODE APIs (AUTH)
 * --------------------
 */

// Start build (Node → Flask internally)
export const startBuild = (payload) => {
  return axiosInstance.post(`projects/build-image-pri`, payload);
};

// Get download URL (Node)
export const getDownloadUrl = (filename, params, token) => {
  return axios.get(
    `${NodeUrl}projects/get-download-url/${encodeURIComponent(filename)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params,
    }
  );
};

/**
 * --------------------
 * FLASK APIs (PUBLIC)
 * --------------------
 */

// Read-only status polling (Flask)
export const pollBuildStatus = (url, taskId, payload) => {
  return axios.post(`${url}status/${taskId}`, payload);
};
