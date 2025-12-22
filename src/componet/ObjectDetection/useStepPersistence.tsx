// useStepPersistence.ts
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
import { getUrl } from "../../config/config";
import type {
  
  StepKey,
  StepOrder,
  StepStatusValue,
  StepStatusMap,
  UseStepPersistenceReturn,
} from "../../types/objectDetection/training";
import type { User, AppRootState } from "../../types/user";

const url: string = getUrl("objectdetection");

// Canonical step order
const stepsOrder: StepOrder = [
  "labelled",
  "augmented",
  "images",
  "dataSplit",
  "HyperTune",
  "infer",
  "remark",
  "application",
] as const;

// Runtime type guards
const isStepKey = (v: unknown): v is StepKey =>
  typeof v === "string" && (stepsOrder as readonly string[]).includes(v);

const isStepStatusValue = (v: unknown): v is StepStatusValue =>
  v === "not_started" || v === "in_progress" || v === "completed";

type UseStepPersistenceArgs = {
  projectName: string;
  version: string;
  task: "objectdetection" | "classification" | "defectdetection";
  projectId: string;
};

export const useStepPersistence = (
  {
  projectName,
  version,
  task,
  projectId
}: UseStepPersistenceArgs
): UseStepPersistenceReturn => {
  const [stepStatus, setStepStatus] = useState<StepStatusMap>();
  const [currentStep, setCurrentStep] = useState<StepKey | null>("labelled");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get user data from Redux with proper typing
  const userData = useSelector(
    (state: AppRootState) => state.auth.user
  ) as User | null;
  const token = userData?.jwtToken ?? "";

  const fetchProjectStatus = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);

      const response = await axios.get(`${url}status`, {
        params: {
          username: userData?.userName,
          projectId: projectId,
          task: task,
          project_name: projectName,
          version: version,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const { current_step, step_status } = response.data as {
          current_step?: unknown;
          step_status?: Record<
            string,
            { status?: unknown; [k: string]: unknown }
          >;
        };

        // Narrow current step
        setCurrentStep(isStepKey(current_step) ? current_step : "labelled");

        // Narrow step status map
        const narrowed: StepStatusMap = {};
        if (step_status && typeof step_status === "object") {
          for (const k of Object.keys(step_status)) {
            if (!isStepKey(k)) continue;
            const s = step_status[k]?.status;
            narrowed[k] = { status: isStepStatusValue(s) ? s : "not_started" };
          }
        }
        setStepStatus(narrowed);
      }
    } catch (error) {
      // Optionally log
      console.error("Failed to fetch project status:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    projectName,
    projectId,
    version,
    token,
    userData?.userName,
  ]);

  const updateStepStatus = useCallback(
    async (
      stepName: StepKey,
      status: StepStatusValue,
      data: Record<string, unknown> = {}
    ): Promise<void> => {
      // Optimistic local update
      setStepStatus((prev) => {
        const next = { ...(prev ?? {}) };
        next[stepName] = {
          status,
          // keep only known property 'status' in the typed map; extra fields are fine to keep locally if you extend StepStatusMap
        } as { status: StepStatusValue };
        return next;
      });

      try {
        await axios.post(
          `${url}update_step_status`,
          {
            username: userData?.userName,
            projectId: projectId,
            project_name: projectName,
            task: task,
            version: version,
            step: stepName,
            status,
            data,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Keep currentStep aligned when switching to in_progress
        if (status === "in_progress") setCurrentStep(stepName);
        if (status === "completed") {
          // Optionally advance currentStep if you want
        }
      } catch (error) {
        console.error("Failed to update step status:", error);
        // Revert by refetching
        fetchProjectStatus();
      }
    },
    [
      fetchProjectStatus,
      projectName,
      projectId,
      version,
      token,
      userData?.userName,
    ]
  );

  const isStepAccessible = useCallback(
    (stepName: StepKey): boolean => {
      const stepIndex = stepsOrder.indexOf(stepName);
      if (stepIndex <= 0) return true;
      const previousStep = stepsOrder[stepIndex - 1];
      return stepStatus?.[previousStep]?.status === "completed";
    },
    [stepStatus]
  );

  useEffect(() => {
    void fetchProjectStatus();
  }, [fetchProjectStatus]);

  return {
    stepStatus,
    currentStep,
    isLoading,
    fetchProjectStatus,
    updateStepStatus,
    isStepAccessible,
  };
};
