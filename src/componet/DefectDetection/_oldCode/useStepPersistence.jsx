// useStepPersistence.js
import { useState } from 'react';
import axios from 'axios';
import { getUrl } from '../../config/config';

const url = getUrl('defectdetection');

const stepsOrder = ['labelled', 'HyperTune', 'infer', 'remark', 'application'];
export const useStepPersistence = (userData, projectState) => {
  const [stepStatus, setStepStatus] = useState({});
  const [currentStep, setCurrentStep] = useState('labelled');
  const [isLoading, setIsLoading] = useState(true);
  const token = userData?.token || '';
  const fetchProjectStatus = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${url}status`, {
        params: {
          projectId: projectState?.projectId,
          username: userData?.activeUser?.userName,
          task: 'defectdetection',
          project_name: projectState?.name,
          version: projectState?.version
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // console.log('Project status response:', response);

      if (response.status === 200) {
        const { current_step, step_status } = response.data;
        setCurrentStep(current_step);
        setStepStatus(step_status);
      }
    } catch (error) {
      console.error('Failed to fetch project status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStepStatus = async (stepName, status, data = {}) => {
    // Update local state immediately for better UX
    setStepStatus(prev => ({
      ...prev,
      [stepName]: {
        ...prev[stepName],
        status,
        data,
        last_modified: new Date().toISOString()
      }
    }));

    // Persist to backend
    try {
      await axios.post(`${url}update_step_status`,
        {
          username: userData?.activeUser?.userName,
          project_name: projectState?.name,
          projectId: projectState?.projectId,
          task: 'defectdetection',
          version: projectState?.version,
          step: stepName,
          status,
          data
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      console.error('Failed to update step status:', error);
      // Revert local state on failure
      fetchProjectStatus();
    }
  };

  return {
    stepStatus,
    currentStep,
    isLoading,
    fetchProjectStatus,
    updateStepStatus,
    isStepAccessible: (stepName) => {
      const stepIndex = stepsOrder.indexOf(stepName);
      if (stepIndex === 0) return true;

      const previousStep = stepsOrder[stepIndex - 1];
      return stepStatus[previousStep]?.status === 'completed';
    }
  };
};
