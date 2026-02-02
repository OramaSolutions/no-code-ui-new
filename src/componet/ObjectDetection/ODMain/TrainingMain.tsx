/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import DashboardLayout from "../../../commonComponent/DashboardLayout";

import ProjectHeader from "./ProjectHeader";
import StepNavigation from "./StepNavigation";
import StepContent from "./StepContent";
import {
  markStepChanged,
  clearStepChange,
} from "../../../reduxToolkit/Slices/stepSlices";
import { getUrl } from "../../../config/config";
import { useStepPersistence } from "../useStepPersistence";
import Loader from "../../../commonComponent/Loader";
import type {
  ODProjectLocationState,
  ODUserLogin,
  StepKey,
  StepOrder,
  RootState,
  StepsSliceState,
  UseStepPersistenceReturn,
} from "../../../types/objectDetection/training";
import type { User, AppRootState } from "../../../types/user";

const url: string = getUrl("objectdetection");

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
];

function ProjectTraining(): JSX.Element {
  const dispatch = useDispatch();
  const { projectName, version, projectId } = useParams();
  const navigate = useNavigate();
  const [iState, updateIstate] = useState<StepKey | null>(null);

  const userData = useSelector(
    (state: AppRootState) => state.auth.user,
  ) as User | null;

  const hasChangedSteps = useSelector<
    RootState,
    StepsSliceState["hasChangedSteps"]
  >((state) => state.steps.hasChangedSteps);

  const [completedSteps, setCompletedSteps] = useState({
    labelled: false,
    augmented: false,
    images: false,
    dataSplit: false,
    HyperTune: false,
    Train: false,
    infer: false,
    remark: false,
    application: false,
  });

  if (!projectName || !version || !projectId) {
    throw new Error("Invalid route params");
  }

  const state: ODProjectLocationState = {
    name: projectName,
    version,
    projectId,
  };
  // useEffect(() => {
  //   console.log("Location state in TrainingMain>>>", state);
  // }, [state]);

  const {
    stepStatus,
    currentStep,
    isLoading,
    fetchProjectStatus,
    updateStepStatus,
    isStepAccessible,
  }: UseStepPersistenceReturn = useStepPersistence({
    projectName,
    version,
    task: "objectdetection",
    projectId,
  });

  useEffect(() => {
    void fetchProjectStatus();
  }, [fetchProjectStatus]);

  useEffect(() => {
    if (!isLoading && currentStep) {
      updateIstate(currentStep);
    }
  }, [currentStep, isLoading]);

  useEffect(() => {
    if (stepStatus) {
      const newCompletedSteps: Partial<typeof completedSteps> = {};
      (Object.keys(stepStatus) as StepKey[]).forEach((step) => {
        newCompletedSteps[step] = stepStatus[step]?.status === "completed";
      });
      setCompletedSteps((prev) => ({ ...prev, ...newCompletedSteps }));
    }
  }, [stepStatus]);

  const handleApply = async (step: StepKey): Promise<void> => {
    try {
      await updateStepStatus(step, "completed");
      setCompletedSteps((prevSteps) => ({ ...prevSteps, [step]: true }));

      const nextStepIndex = stepsOrder.indexOf(step) + 1;
      if (nextStepIndex < stepsOrder.length) {
        const nextStep = stepsOrder[nextStepIndex];
        updateIstate(nextStep);
        await updateStepStatus(nextStep, "in_progress");
      }

      if (hasChangedSteps[step]) {
        dispatch(clearStepChange({ step }));
      }
    } catch (error) {
      console.log("error", error);
      setCompletedSteps((prevSteps) => ({ ...prevSteps, [step]: true }));
      const nextStepIndex = stepsOrder.indexOf(step) + 1;
      if (nextStepIndex < stepsOrder.length) {
        updateIstate(stepsOrder[nextStepIndex]);
      }
    }
  };

  const handleChange = async (step: StepKey): Promise<void> => {
    try {
      dispatch(markStepChanged({ step }));
      if (isStepAccessible(step)) {
        await updateStepStatus(step, "in_progress");
      }
    } catch {
      dispatch(markStepChanged({ step }));
    }
  };

  if (isLoading || !iState) {
    return <Loader />;
  }

  return (
    <DashboardLayout
      pageTitle="Object Detection"
      pageDescription="Follow the steps to train and download your application."
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ProjectHeader name={state?.name} version={state?.version} />

        <div className="flex gap-4 mt-4">
          <StepNavigation
            currentStep={iState}
            stepStatus={stepStatus}
            isStepAccessible={isStepAccessible}
            onStepClick={updateIstate}
          />

          <StepContent
            currentStep={iState}
            handleApply={handleApply}
            handleChange={handleChange}
            url={url}
            state={state}
            userData={userData}
          />
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

export default ProjectTraining;
