// projectSlice.types.ts

import { AxiosResponse } from 'axios';

// ==================== Payload Types ====================

export interface BaseProjectPayload {
  username: string;
  task: string;
  project: string;
  version: string;
}

export interface ResizeFolderPayload {
  formData: FormData;
  signal: AbortSignal;
  url: string;
}

export interface ImportDataPayload {
  payload: FormData;
  signal: AbortSignal;
  url: string;
}

export interface AugmentDataPayload {
  payload: FormData;
  signal: AbortSignal;
  url: string;
}

export interface DataSplitPayload {
  payload: FormData;
  url: string;
}

export interface HyperTunePayload {
  payload: FormData;
  url: string;
}

export interface DataSplitImagesPayload extends BaseProjectPayload {
  url: string;
  split_ratio: string;
}

export interface InferImagesPayload {
  payload: FormData;
  url: string;
}

export interface StopDataTransferPayload {
  payload: FormData;
  url: string;
}

export interface RemarkDataPayload {
  payload: FormData;
  url: string;
}

export interface GetRemarkDataPayload extends BaseProjectPayload {
  url: string;
}

export interface CreateProjectPayload {
  name: string;
  model: string;
  [key: string]: any;
}

// ==================== Response Types (Define based on actual API responses) ====================

// Placeholder types - replace with actual response structures from your API
export interface AgumentedImageResponse {
  images?: any[];
  [key: string]: any;
}

export interface AgumentedGeneratedImageResponse {
  generatedImages?: any[];
  [key: string]: any;
}

export interface HypertuneModelResponse {
  models?: any[];
  [key: string]: any;
}

export interface DataSplitImagesResponse {
  total_images: number;
  [key: string]: any;
}

// ==================== State Types ====================

export interface ProjectState {
  agumentedImages: any[];
  agumentedGeneratedImages: any[];
  hypertuneModel: any[];
  totalImages: number;
  dataTransferResult: string;
  loading: boolean;
}
