// utils/trainFunctions.js
import axios from "axios";
import { API_BASE_URL } from "./crudFunctions";

export const prepareDataset = async (projectName) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/projects/${projectName}/prepare_dataset`
    );
    return response.data;
  } catch (error) {
    console.error("Error preparing dataset:", error);
    throw error;
  }
};

export const trainNow = async (projectName) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/projects/${projectName}/train_now`
    );
    return response.data;
  } catch (error) {
    console.error("Error training now:", error);
    throw error;
  }
};

export const scheduleTraining = async (projectName, datetime) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/projects/${projectName}/schedule_training`,
      { projectName, datetime }
    );
    return response.data;
  } catch (error) {
    console.error("Error scheduling training:", error);
    throw error;
  }
};

export const getTrainingStatus = async (projectName) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/get_training_status/${projectName}`
    );
    const data = response.data;
    const metrics = data.metrics?.metrics_summary || {};

    // Return only relevant info
    return {
      trainingStatus: data.training_status,
      epoch: metrics.epoch ?? null,
      completed: metrics.Training_Completed ?? false,
      perClassAccuracy: data.metrics?.per_class_accuracy ?? {},
    };
  } catch (error) {
    console.error("Error fetching training status:", error);
    throw error;
  }
};

// Get all fine-tuned models
export const getAllFinetunedModels = async (projectName) => {
  const response = await fetch(`${API_BASE_URL}/api/projects/${projectName}/get_all_finetuned_model`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to fetch models");
  return await response.json();
};

// Choose model and reset
export const chooseModelAndReset = async (projectName, modelName) => {
  const response = await fetch(`${API_BASE_URL}/api/projects/${projectName}/choose_model_and_reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model_name: modelName }),
  });
  if (!response.ok) throw new Error("Failed to choose model");
  return await response.json();
};
