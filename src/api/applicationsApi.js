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
export const getDownloadUrl = (filename, params) => {
  return axiosInstance.get(
    `${NodeUrl}projects/get-download-url/${encodeURIComponent(filename)}`,
    {
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
