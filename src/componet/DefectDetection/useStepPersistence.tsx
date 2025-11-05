

// useStepPersistence.ts
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { getUrl } from "../../config/config";
import type {
  ODUserLogin,
  ODProjectLocationState,
  StepKey,
  StepOrder,
  StepStatusValue,
  StepStatusMap,
  UseStepPersistenceReturn,
} from "../../types/defectDetection/training";

const url = getUrl("defectdetection");

// Canonical step order
const stepsOrder: StepOrder = [
  "labelled",
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

export const useStepPersistence = (
  userData: ODUserLogin | null,
  projectState: ODProjectLocationState | null
): UseStepPersistenceReturn => {
  const [stepStatus, setStepStatus] = useState<StepStatusMap>();
  const [currentStep, setCurrentStep] = useState<StepKey | null>("labelled");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const token = userData?.token ?? "";

  const fetchProjectStatus = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);

      const response = await axios.get(`${url}status`, {
        params: {
          username: userData?.activeUser?.userName,
          projectId: projectState?.projectId,
          task: "objectdetection",
          project_name: projectState?.name,
          version: projectState?.version,
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
    projectState?.name,
    projectState?.projectId,
    projectState?.version,
    token,
    userData?.activeUser?.userName,
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
            username: userData?.activeUser?.userName,
            projectId: projectState?.projectId,
            project_name: projectState?.name,
            task: "objectdetection",
            version: projectState?.version,
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
      projectState?.name,
      projectState?.projectId,
      projectState?.version,
      token,
      userData?.activeUser?.userName,
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
