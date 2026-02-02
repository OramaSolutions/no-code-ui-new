// useStepPersistence.ts
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
import axiosInstance from "../../api/axiosInstance";

import type {
  StepKey,
  StepOrder,
  StepStatusValue,
  StepStatusMap,
  UseStepPersistenceReturn,
} from "../../types/objectDetection/training";
import type { User, AppRootState } from "../../types/user";
import { getUrl } from "../../config/config";
import { Url } from "../../config/config";

const url = getUrl("objectdetection");

// Canonical step order
const stepsOrder: StepOrder = [
  "labelled",
  "augmented",
  "images",
  "dataSplit",
  "HyperTune",
  "Train",
  "infer",
  "remark",
  "application",
] as const;

// Runtime type guards
const isStepKey = (v: unknown): v is StepKey =>
  typeof v === "string" && (stepsOrder as readonly string[]).includes(v);

const isStepStatusValue = (v: unknown): v is StepStatusValue =>
  v === "pending" || v === "in_progress" || v === "completed";

type UseStepPersistenceArgs = {
  projectName: string;
  version: string;
  task: "objectdetection" ;
  projectId: string;
};

export const useStepPersistence = ({
  projectName,
  version,
  task,
  projectId,
}: UseStepPersistenceArgs): UseStepPersistenceReturn => {
  const [stepStatus, setStepStatus] = useState<StepStatusMap>();
  const [currentStep, setCurrentStep] = useState<StepKey | null>("labelled");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get user data from Redux with proper typing
  const userData = useSelector(
    (state: AppRootState) => state.auth.user,
  ) as User | null;

  // fetch status
  const fetchProjectStatus = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    const statusPromise = axiosInstance.get(`${Url}projects/status`, {
      params: { projectId },
    });

    const statsPromise = axios.get(`${url}projects/${projectName}/stats`, {
      params: {
        username: userData?.userName,
        version,
        task,
      },
    });

    try {
      // 🔥 Priority 1: STATUS (await first)
      const statusResponse = await statusPromise;

      if (statusResponse.status === 200) {
        const { current_step, step_status } = statusResponse.data as {
          current_step?: unknown;
          step_status?: Record<
            string,
            { status?: unknown; [k: string]: unknown }
          >;
        };

        // Narrow current step
        setCurrentStep(isStepKey(current_step) ? current_step : "labelled");

        // Narrow step status
        const narrowed: StepStatusMap = {};
        if (step_status && typeof step_status === "object") {
          for (const k of Object.keys(step_status)) {
            if (!isStepKey(k)) continue;
            const s = step_status[k]?.status;
            narrowed[k] = {
              status: isStepStatusValue(s) ? s : "pending",
            };
          }
        }
        setStepStatus(narrowed);
      }
    } catch (error) {
      // ❗ Status failure is important → log
      console.error("Failed to fetch project status:", error);
    } finally {
      setIsLoading(false); // 🔥 stop loader here
    }

    // 🔹 Priority 2: STATS (silent, non-blocking)
    statsPromise
      .then((statsResponse) => {
        if (statsResponse.status !== 200) return;

        const stats = statsResponse.data;
        if (!stats) return;

        const normalizedStats = {
          annotationType: stats.annotation_type,
          updatedAt: Date.now(),
          totalImages: stats.total_images,
          labeledImages: stats.labeled_images,
          unlabeledImages: stats.unlabeled_images,
          completionPercentage: stats.completion_percentage,
        };

        const STATS_STORAGE_KEY = `project_stats:${projectName}:${version}:${task}`;

        localStorage.setItem(
          STATS_STORAGE_KEY,
          JSON.stringify(normalizedStats),
        );
      })
      .catch(() => {
        // ❗ Completely silent failure (by design)
      });
  }, [projectId, projectName, version, task, userData?.userName]);

  const updateStepStatus = useCallback(
    async (
      stepName: StepKey,
      status: StepStatusValue,
      data: Record<string, unknown> = {},
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
        await axiosInstance.post(`${Url}projects/update_step_status`, {
          projectId,
          task,
          version,
          step: stepName,
          status,
          data,
        });
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
    [projectId, task, version, fetchProjectStatus],
  );

  const isStepAccessible = useCallback(
    (stepName: StepKey): boolean => {
      const stepIndex = stepsOrder.indexOf(stepName);
      if (stepIndex <= 0) return true;
      const previousStep = stepsOrder[stepIndex - 1];
      return stepStatus?.[previousStep]?.status === "completed";
    },
    [stepStatus],
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
