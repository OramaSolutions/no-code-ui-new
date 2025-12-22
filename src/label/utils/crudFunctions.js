import axios from "axios";

import { unzipSync } from "fflate";
import { CLASS_COLORS } from "./classColors";
import { getUrl } from "../../config/config";

export const API_BASE_URL = "";
export const NODE_SERVER_URL = ''

// Helper function to get task from backLink
export const getTaskFromBackLink = (backLink) => {
  if (!backLink) return null;

  const taskMap = {
    'object-detection-training': 'objectdetection',
    'classification-training': 'classification',
    'defect-detection-training': 'defectdetection',
  };

  return taskMap[backLink] || taskMap[backLink.toLowerCase()] || null;
};

// Helper function to convert backLink to config key
export const getBaseUrlFromBackLink = (backLink) => {
  if (!backLink) return null;

  // Map backLink patterns to config keys
  const keyMap = {
    'object-detection-training': 'objectdetection',
    'classification-training': 'classification',
    'defect-detection-training': 'defectdetection',
  };

  // Find matching key (exact match or case-insensitive)
  const key = keyMap[backLink] || keyMap[backLink.toLowerCase()];

  if (!key) {
    console.warn(`Unknown backLink: ${backLink}`);
    return null;
  }

  try {
    return getUrl(key);
  } catch (error) {
    console.error(`Error getting URL for backLink "${backLink}":`, error);
    return null;
  }
};

// Helper function to create axios instance with dynamic base URL
const createApiInstance = (baseUrl) => {
  const apiInstance = axios.create({
    baseURL: baseUrl,
  });

  // Add request interceptor to inject fresh token for every request
  apiInstance.interceptors.request.use(async (config) => {
    // const token = await getToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  });

  return apiInstance;
};


// Project Management
export const createOrUpdateProject = async (baseUrl, projectName) => {
  const api = createApiInstance(baseUrl);
  try {
    const response = await api.post("/add_project", {
      project_name: projectName,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const getProject = async (baseUrl, projectName) => {
  const api = createApiInstance(baseUrl);
  try {
    const response = await api.get(`/projects/${projectName}`);
    return response.data;
  } catch (error) {
    console.error("Error getting project:", error);
    throw error;
  }
};

export const deleteProject = async (baseUrl, projectName) => {
  const api = createApiInstance(baseUrl);
  try {
    await api.delete(`/projects/${projectName}`);
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

// Image Management

const blobToBase64 = (blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

export const addImages = async (baseUrl, images, projectName) => {
  const api = createApiInstance(baseUrl);
  try {
    const formData = new FormData();

    images.forEach((image) => {
      // console.log("Original image data:", image);

      // Extract the actual blob data regardless of structure
      let blobToUpload;
      if (image.blob instanceof Blob || image.blob instanceof File) {
        // Case 1: Direct upload format (blob is already a Blob/File)
        blobToUpload = image.blob;
      } else if (image.blob?.blob instanceof Blob) {
        // Case 2: Nested blob structure from ZIP extraction
        blobToUpload = image.blob.blob;
      } else {
        // Case 3: Fallback for unexpected formats
        console.warn("Unexpected image blob format, creating new Blob");
        blobToUpload = new Blob([], { type: 'image/png' });
      }

      // Ensure we have a proper File object with filename
      const fileToUpload = blobToUpload instanceof File
        ? blobToUpload
        : new File([blobToUpload], image.name, {
          type: blobToUpload.type || 'image/png'
        });

      // console.log("Processed file data:", fileToUpload);
      formData.append("images", fileToUpload, image.name);
    });

    const response = await api.post(`/upload_images/${projectName}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Response from addImages:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding images:", error);
    throw error;
  }
};
export const deleteImage = async (baseUrl, projectName, imageId) => {
  const api = createApiInstance(baseUrl);
  try {
    await api.delete(`/projects/${projectName}/images/${imageId}`);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

export const clearAllImages = async (baseUrl, projectName) => {
  const api = createApiInstance(baseUrl);
  try {
    await api.delete(`/projects/${projectName}/images`);
  } catch (error) {
    console.error("Error clearing images:", error);
    throw error;
  }
};

// Class Management
export const getProjectClasses = async (baseUrl, projectName, username, version, task) => {
  const api = createApiInstance(baseUrl);
  try {
    const response = await api.get(`/projects/${projectName}/classes`, {
      params: { username, version, task },
    });
    return response.data || [];
  } catch (error) {
    console.error("Error getting classes:", error);
    throw error;
  }
};

export const saveProjectClasses = async (baseUrl, classes, projectName, username, version, task) => {
  const api = createApiInstance(baseUrl);
  try {
    // Check if classes already have all required fields
    const needsReindexing = classes.some(
      (cls) =>
        !("id" in cls && "name" in cls && "index" in cls && "color" in cls)
    );

    const processedClasses = needsReindexing
      ? classes.map((cls, index) => ({
        ...cls,
        id: cls.name, // or cls.id if available
        index,
        color: CLASS_COLORS[index % CLASS_COLORS.length],
      }))
      : classes;

    const response = await api.post(
      `/projects/${projectName}/classes`,
      processedClasses,
      {
        params: { username, version, task },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error saving classes:", error);
    throw error;
  }
};

export const updateProjectClass = async (baseUrl, projectName, classId, updates) => {
  const api = createApiInstance(baseUrl);
  try {
    const response = await api.put(
      `/projects/${projectName}/classes/${classId}`,
      updates
    );
    return response.data;
  } catch (error) {
    console.error("Error updating class:", error);
    throw error;
  }
};

export const deleteProjectClass = async (baseUrl, projectName, classId) => {
  const api = createApiInstance(baseUrl);
  try {
    await api.delete(`/projects/${projectName}/classes/${classId}`);
  } catch (error) {
    console.error("Error deleting class:", error);
    throw error;
  }
};

export const saveLabelData = async (baseUrl, projectName, username, version, task, payload) => {
  const api = createApiInstance(baseUrl);
  try {
    const response = await api.post(
      `/projects/${projectName}/add_labels`,
      payload, {
      params: { username, version, task },
    }
    );
    return response.status === 200;
  } catch (error) {
    console.error(
      "Error saving label data:",
      error.response?.data || error.message
    );
    return false;
  }
};

export const saveOcrData = async (baseUrl, projectName, payload) => {
  const api = createApiInstance(baseUrl);
  console.log("Saving OCR data:>>>", payload);
  try {
    const response = await api.post(
      `/projects/${projectName}/add_ocr`,
      payload
    );
    return response.status === 200;
  } catch (error) {
    console.error(
      "Error saving label data:",
      error.response?.data || error.message
    );
    return false;
  }
};



export const saveAllAnnotations = async (baseUrl, allAnnotations, projectName) => {
  const api = createApiInstance(baseUrl);
  try {
    const response = await api.post(
      `/projects/${projectName}/annotations`,
      allAnnotations
    );
    return response.status === 200;
  } catch (error) {
    console.error(
      "Error saving label data:",
      error.response?.data || error.message
    );
    return false;
  }
};

export const saveAllOcrAnnotations = async (baseUrl, allAnnotations, projectName) => {
  const api = createApiInstance(baseUrl);
  try {
    const response = await api.post(
      `/projects/${projectName}/ocr_annotations`,
      allAnnotations
    );
    return response.status === 200;
  } catch (error) {
    console.error(
      "Error saving label data:",
      error.response?.data || error.message
    );
    return false;
  }
};


export const getProjectAnnotations = async (baseUrl, projectName, username, version, task) => {
  const api = createApiInstance(baseUrl);
  try {
    const response = await api.get(`/projects/${projectName}/annotations`, {
      params: { username, version, task },
    });
    return response.data || [];
  } catch (error) {
    console.error(
      "Error getting annotation data:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const base64ToBlob = (base64) => {
  try {
    if (!base64) return null;
    const parts = base64.split(",");
    if (parts.length !== 2) return null;

    const byteString = atob(parts[1]);
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";

    const buffer = new ArrayBuffer(byteString.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < byteString.length; i++) {
      view[i] = byteString.charCodeAt(i);
    }
    return new Blob([buffer], { type: mime });
  } catch (error) {
    console.error("Base64 conversion failed:", error);
    return null;
  }
};

// Prepare images for IndexedDB storage (compatible with saveImages)
const formatForStorage = (images) => {
  return images.map((img, index) => ({
    id: img.id, // Required by saveImages
    name: img.name,
    blob: img.blob,
  }));
};

// Format for rendering (compatible with getImages output)
const formatForDisplay = (images) => {
  const format = images.map((img) => {


    return {
      id: img.id,
      name: img.name,
      data: img.data,
      blob: img.blob,

    };
  });

  return format;
};



export const getProjectImages = async (
  baseUrl,
  projectName,
  startIndex = 0,
  endIndex = null
) => {
  const api = createApiInstance(baseUrl);
  try {
    const formData = new FormData();
    formData.append("start", startIndex);
    if (endIndex !== null) formData.append("end", endIndex);
    formData.append("max_size", 536870912);

    const response = await api.post(
      `${baseUrl}/get_images/${projectName}`,
      formData,
      {
        responseType: "blob",
      }
    );
    console.log("Response from backend:", response, response.status, response.headers);
    const metadataHeader = response.headers["x-metadata"];
    console.log("Metadata header fetched from backend:", metadataHeader);
    const datasetLength = response.headers["x-dataset-length"];
    console.log("Dataset length fetched from backend:", datasetLength);
    const metadata = metadataHeader ? JSON.parse(metadataHeader) : [];
    console.log("Metadata fetched from backend:", metadata);
    const u8 = new Uint8Array(await response.data.arrayBuffer());
    const files = unzipSync(u8);
    console.log("Files extracted from ZIP:");
    const images = metadata.map((meta) => {
      const file = files[meta.filename];
      if (!file) return null;

      const blob = new Blob([file], { type: "image/jpeg" });
      return {
        id: meta.id,
        name: meta.filename,
        blob,
        data: URL.createObjectURL(blob),
      };
    });

    console.log("Images processed from metadata.");
    // console.log('images length fetched from backend>>>', images.length);
    return {
      images: images.filter(Boolean),
      hasMore: metadata.length > 0,
      nextIndex: startIndex + metadata.length,
      datasetLength: datasetLength,
    };
  } catch (error) {
    console.error("Error getting project images with Axios:", error);
    throw error;
  }
};

export const LoadImages = async (
  baseUrl,
  projectName,
  userName,
  startIndex,
  endIndex = null,
  isInitialLoad = false
) => {
  let backendData;
  let backendImages = [];

  try {
    // console.log("Loading images from index>>>:", startIndex, endIndex);
    backendData = await getProjectImages(baseUrl, projectName, startIndex, endIndex);
    backendImages = backendData.images || [];

    if (backendImages.length === 0) return { images: [], hasMore: false };

    // Cache management
    if (isInitialLoad) {
      // backend images being saved to IndexedDB it has a blob as well as data which is a url converted from the same blob
      // await saveImages(formatForStorage(backendImages), projectName, userName);
      const ids = backendImages.map((img) => img.id);
      localStorage.setItem(`${projectName}_firstLoaded`, Math.min(...ids));
      localStorage.setItem(`${projectName}_lastLoaded`, Math.max(...ids));
    } else {
      // console.log("updating cache");
      // await updateImageCache(
      //   formatForStorage(backendImages),
      //   startIndex,
      //   projectName
      // );
      // Update first/last loaded for non-initial loads too
      const currentFirst = parseInt(localStorage.getItem(`${projectName}_firstLoaded`) || 0);
      const currentLast = parseInt(localStorage.getItem(`${projectName}_lastLoaded`) || 0);
      const newIds = backendImages.map((img) => img.id);
      const newFirst = Math.min(currentFirst, ...newIds);
      const newLast = Math.max(currentLast, ...newIds);
      localStorage.setItem(`${projectName}_firstLoaded`, newFirst);
      localStorage.setItem(`${projectName}_lastLoaded`, newLast);
    }

    return {
      images: formatForDisplay(backendImages),
      hasMore: backendData.hasMore,
      datasetLength: backendData.datasetLength,
    };
  } catch (error) {
    console.error("Error loading images:", error);
    throw error;
  }
};


export const downloadDataset = async (baseUrl, projectName, onProgress) => {
  const api = createApiInstance(baseUrl);
  try {
    const response = await api.post(
      `/download_dataset/${projectName}`,
      new FormData(), // keep POST input
      {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          if (onProgress) {
            const loaded = progressEvent.loaded;
            const total = progressEvent.total;

            if (total && total > 0) {
              const percent = Math.round((loaded / total) * 100);
              onProgress(percent, 100); // exact percentage
            } else {
              const loadedMB = (loaded / (1024 * 1024)).toFixed(2);
              onProgress(`~${loadedMB} MB`, null); // fallback: show size
            }
          }
        }
      }
    );

    return response.data; // still returns blob for caller to use
  } catch (error) {
    console.error("Dataset download failed:", error);
    throw error;
  }
};

export const getProjectStats = async (baseUrl, projectName, username, version, task) => {
  const api = createApiInstance(baseUrl);
  try {
    const response = await api.get(`/projects/${projectName}/stats`, {
      params: { username, version, task },
    });
    // console.log('response from get annotation type>>>>>>>', response.data)
    return response.data; // Default to label if not specified
  } catch (error) {
    console.error("Error getting annotation type:", error);
    return "label"; // Default fallback
  }
};

export const setAnnotationType = async (baseUrl, projectName, type, username, version, task) => {
  const api = createApiInstance(baseUrl);
  try {
    await api.post(`/projects/${projectName}/annotation_type`, { type }, {
      params: { username, version, task },
    });
    return true;
  } catch (error) {
    console.error("Error setting annotation type:", error);
    return false;
  }
};

// Segment Management (mirroring label flow)

/**
 * Save segment annotations for a project
 * @param {string} projectName - Name of the project
 * @param {Object} payload - Segment data to save
 * @returns {Promise<boolean>} - True if successful
 */
// In your crudFunctions.js or similar file
export const saveSegmentData = async (baseUrl, projectName, payload, username, version, task) => {
  const api = createApiInstance(baseUrl);
  try {
    // Format the data for backend
    const formattedData = {
      imageName: payload.imageName,
      imageIndex: payload.imageIndex,
      classes: payload.classes,
      segments: payload.segments.map(segment => {
        // Find class index for the TXT file format
        const classIndex = payload.classes.findIndex(cls => cls.name === segment.label?.name);
        if (classIndex === -1) {
          console.warn(`Class not found for segment:`, segment);
          return null;
        }

        // Format points as a flat array of coordinates for TXT
        const flatPoints = segment.points.flat();

        return {
          id: segment.id,
          classIndex, // For TXT file
          points: segment.points, // For JSON file
          flatPoints, // For TXT file line
          label: segment.label // For JSON file
        };
      }).filter(Boolean) // Remove any null segments
    };

    const response = await api.post(
      `/projects/${projectName}/add_segments`,
      formattedData,
      {
        params: { username, version, task },
      }
    );
    return response.status === 200;
  } catch (error) {
    console.error("Error saving segment data:", error.response?.data || error.message);
    return false;
  }
};


export const getProjectSegmentAnnotation = async (baseUrl, projectName, username, version, task) => {
  const api = createApiInstance(baseUrl);
  try {
    const response = await api.get(`/projects/${projectName}/segments`, {
      params: { username, version, task },
    });
    console.log('response from get segment annotations>>>>>>>', response.data)
    return response.data || [];
  } catch (error) {
    console.error(
      "Error getting annotation data:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export const saveProjectSegmentAnnotations = async (baseUrl, allSegments, projectName) => {
  const api = createApiInstance(baseUrl);
  try {

    const response = await api.post(
      `/projects/${projectName}/segments`,
      allSegments
    );
    return response.status === 200;
  } catch (error) {
    console.error(
      "Error saving segment data:",
      error.response?.data || error.message
    );
    return false;
  }
};

export const fetchImageDetails = async (baseUrl, projectName, task, version, username, imageId) => {
  const api = createApiInstance(baseUrl);
  try {
    const response = await api.get(`/projects/${projectName}/images/${imageId}`, {
      params: { username, version, task },
    });

    console.log('Image details fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
};



export const getProjectThumbnails = async (
  baseUrl,
  projectName,
  username,
  version,
  task
) => {
  const api = createApiInstance(baseUrl);
  try {
    const response = await api.post(
      `/get_thumbnail/${projectName}`,
      null,
      {
        responseType: 'arraybuffer',
        params: { username, version, task },
      }
    );
    const u8 = new Uint8Array(response.data);
    const files = unzipSync(u8);

    // 2️⃣ Read metadata.json that the backend put in the zip
    const metaU8 = files['metadata.json'];
    const metadata = metaU8 ? JSON.parse(new TextDecoder().decode(metaU8)) : [];

    // console.log("Res  qponse from backend:", typeof response.data);



    // console.log("meta data from ZIP:", metadata);
    const images = metadata.map((meta) => {
      const file = files[meta.filename];
      if (!file) return null;

      const blob = new Blob([file], { type: "image/jpeg" });
      return {
        id: meta.id,
        name: meta.filename,
        blob,
        data: URL.createObjectURL(blob),
      };
    }).filter(Boolean);

    // console.log("Images processed from metadata.", images);
    // console.log("headers", response.headers);
    const datasetLength = response.headers["x-dataset-length"];

    // console.log('images length fetched from backend>>>', images.length);
    return {
      images: images.filter(Boolean),

      datasetLength: datasetLength,
    };
  } catch (error) {
    console.error("Error getting project images with Axios:", error);
    throw error;
  }
};


// OCR

export const getProjectOcrAnnotations = async (baseUrl, projectName, username, version, task) => {
  const api = createApiInstance(baseUrl);
  try {
    const response = await api.get(`/projects/${projectName}/ocr`, {
      params: { username, version, task },
    });
    return response.data || [];
  } catch (error) {
    console.error(
      "Error getting annotation data:",
      error.response?.data || error.message
    );
    throw error;
  }
};