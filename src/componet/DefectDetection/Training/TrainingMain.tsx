/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
} from "../../../types/defectDetection/training";

const url: string = getUrl("defectdetection");

// import React, { useEffect, useState } from 'react'
// import Header from '../../commonComponent/Header'
// import Sidenav from '../../commonComponent/Sidenav'
// import { useLocation } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux'
// import { markStepChanged, clearStepChange } from '../../reduxToolkit/Slices/stepSlices'
// import Defectlabelled from './Defectlabelled';
// import DefectDataSplit from './DefectDataSplit';
// import DefectHypertune from './DefectHypertune';
// import DefectInfer from './DefectInfer';
// import axios from 'axios';
// import { getUrl } from '../../config/config';
// import DefectRemark from './DefectRemark';
// import Application from './Application'
// import { useStepPersistence } from './useStepPersistence';
// import Loader from '../../commonComponent/Loader'
// const url = getUrl('defectdetection')

const stepsOrder: StepOrder = [
  "labelled",

  "HyperTune",
  "infer",
  "remark",
  "application",
];

function ProjectTraining(): JSX.Element {
  const dispatch = useDispatch();
  const [iState, updateIstate] = useState<StepKey | null>(null);

  const rawUser = window.localStorage.getItem("userLogin");
  const userData: ODUserLogin | null = rawUser
    ? (JSON.parse(rawUser) as ODUserLogin)
    : null;

  const hasChangedSteps = useSelector<
    RootState,
    StepsSliceState["hasChangedSteps"]
  >((state) => state.steps.hasChangedSteps);

  const [completedSteps, setCompletedSteps] = useState({
    labelled: false,

    HyperTune: false,
    infer: false,
    remark: false,
    application: false,
  });

  const { state } = useLocation() as { state: ODProjectLocationState | null };

  const {
    stepStatus,
    currentStep,
    isLoading,
    fetchProjectStatus,
    updateStepStatus,
    isStepAccessible,
  }: UseStepPersistenceReturn = useStepPersistence(userData, state);

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

  const handleStepClick = (step: StepKey) => {
    updateIstate(step);
  };

  if (isLoading || !iState) {
    return <Loader />;
  }

  return (
    <DashboardLayout
      pageTitle="Defect Detection"
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
            onStepClick={handleStepClick}
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
