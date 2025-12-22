//inferenceUtils.js
import axios from "axios";

import { API_BASE_URL } from "./crudFunctions";

// Helper function to create axios instance with dynamic base URL
const createApiInstance = (baseUrl) => {
  const apiInstance = axios.create({
    baseURL: baseUrl,
  });

  // Add request interceptor to inject fresh token for every request
  apiInstance.interceptors.request.use(async (config) => {
    return config;
  });

  return apiInstance;
};


// ---------------------------------------------------------------------
//  MODEL & INFERENCE HELPERS
// ---------------------------------------------------------------------

/**
 * Upload a YOLOv8 .pt model for a given project.
 *
 * @param {string} baseUrl       Base URL for the API
 * @param {string} projectName   Name of the project folder on the server
 * @param {File|Blob} modelFile  The .pt file selected in an <input type="file">
 * @param {string[]} [classes]   Optional list of class names—will be stored in config.yaml
 * @returns {Promise<object>}    Server response with {status, message, model_version, model_path}
 */
export async function uploadModel(baseUrl, projectName, modelFile, classes = []) {
  const api = createApiInstance(baseUrl);
  try {
    const formData = new FormData();
    formData.append("model", modelFile);
    if (classes.length) formData.append("classes", classes.join(","));

    const { data } = await api.post(
      `/projects/${encodeURIComponent(projectName)}/upload_model`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data; // { status: "success", ... }
  } catch (err) {
    // Forward server JSON if available, otherwise throw raw error
    throw err?.response?.data || err;
  }
}

/**
 * Fetch every stored model version and its config.
 *
 * @param {string} baseUrl Base URL for the API
 * @returns {Promise<Array<{version: string, config: object}>>}
 */
export async function getAllModels(baseUrl) {
  const api = createApiInstance(baseUrl);
  try {
    const { data } = await api.get("/models");
    return data.models; // normalised list
  } catch (err) {
    throw err?.response?.data || err;
  }
}

/**
 * Run inference on one image inside a project with a chosen model.
 *
 * @param {string}  baseUrl      Base URL for the API
 * @param {string}  projectName  Project folder
 * @param {number}  imageIndex   Zero-based index in the images/ directory
 * @param {string}  modelPath    Absolute/relative path returned by uploadModel()
 * @returns {Promise<object>}    { status, image_name, predictions }
 */
export async function predictImage(baseUrl, projectName, imageIndex, modelPath) {
  const api = createApiInstance(baseUrl);
  try {
    const payload = {
      image_index: imageIndex,
      model_path: modelPath,
    };

    const { data } = await api.post(
      `/projects/${encodeURIComponent(projectName)}/predict`,
      payload
    );
    return data;
  } catch (err) {
    throw err?.response?.data || err;
  }
}

export const fetchInferenceResults = async (baseUrl, projectName, imageId, username, version, task) => {
  const api = createApiInstance(baseUrl);
  try {
    const response = await api.get(`/projects/${projectName}/infer/${imageId}`, {
      params: { username, version, task },
    });

    console.log('Image inference fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching results:', error);
    throw error;
  }
};

/**
 * Run direct inference on one image inside a project using user-provided points.
 * @param {string} baseUrl Base URL for the API
 * @param {string} projectName Project folder
 * @param {number|string} imageId Image index or ID
 * @param {Array} points Array of [x, y] points inside the object
 * @returns {Promise<object>} { status, inference }
 */
export const fetchDirectInferenceResults = async (baseUrl, projectName, imageId, point, username, version, task) => {
  const api = createApiInstance(baseUrl);
  try {
    const payload = {
      image_id: imageId,
      point
    };
    console.log('payload', payload);
    const response = await api.post(`/projects/${projectName}/hover_sam_infer`, payload, {
      params: { username, version, task },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching direct inference results:', error);
    throw error;
  }
};

export const sendInclusionExclutionPoints = async (baseUrl, projectName, imageId, inclusion_points, exclusion_points, username, version, task) => {
  const api = createApiInstance(baseUrl);
  try {
    const payload = {
      image_id: imageId,
      inclusion_points, // Array of [x, y] points to include
      exclusion_points, // Array of [x, y] points to exclude
    };
    const response = await api.post(`/projects/${projectName}/sam_infer_2`, payload, {
      params: { username, version, task },
    });
    return response.data;
  } catch (error) {
    console.error('Error sending inclusion points:', error);
    throw error;
  }
}

