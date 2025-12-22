/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import Header from "../../../commonComponent/Header";
import Sidenav from "../../../commonComponent/Sidenav";
import Labelled from "./Labelled";
import Augumentation from "../Augmentation/augmentation";
import AugumentImages from "../AugumentImages";
import DataSplit from "../DataSplit";
import HyperTune from "./HyperTune";
// import InferImages from "../InferImages";
import Remark from "./Remark";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  markStepChanged,
  clearStepChange,
} from "../../../reduxToolkit/Slices/stepSlices";
import { getUrl } from "../../../config/config";
import { useStepPersistence } from "../useStepPersistence";
import Application from "../Application";
import Loader from "../../../commonComponent/Loader";

// Types are imported from external files (do not define them here)
import type {
  ODProjectLocationState, // location.state for this page
  ODUserLogin, // structure of localStorage "userLogin"
  StepKey, // 'labelled' | 'augmented' | 'images' | 'dataSplit' | 'HyperTune' | 'infer' | 'remark' | 'application'
  StepOrder, // readonly StepKey[] or type alias
  StepStatusMap, // { [K in StepKey]?: { status: 'not_started' | 'in_progress' | 'completed' } }
  CompletedStepsState, // { [K in StepKey]: boolean }
  RootState, // Redux root state
  StepsSliceState, // { hasChangedSteps: Record<StepKey, boolean> } or similar
  UseStepPersistenceReturn, // return type of useStepPersistence
} from "../../../types/objectDetection/training";

// getUrl for 'objectdetection' returns a string
const url: string = getUrl("objectdetection");

const initialState = {
  labelledData: {},
};

function ProjectTraining(): JSX.Element {
  // redux
  const dispatch = useDispatch();

  // iState is the current step, nullable until initialized
  const [iState, updateIstate] = useState<StepKey | null>(null);

  // localStorage retrieval: parse and cast safely
  const rawUser = window.localStorage.getItem("userLogin");
  const userData: ODUserLogin | null = rawUser
    ? (JSON.parse(rawUser) as ODUserLogin)
    : null;

  // typed selector
  const hasChangedSteps = useSelector<
    RootState,
    StepsSliceState["hasChangedSteps"]
  >((state) => state.steps.hasChangedSteps);

  // local UI mirror of completion flags
  
  const [completedSteps, setCompletedSteps] = useState<CompletedStepsState>({
    labelled: false,
    augmented: false,
    images: false,
    dataSplit: false,
    HyperTune: false,
    infer: false,
    remark: false,
    application: false,
  });

  useEffect(()=>{
    console.log('hasChangedSteps',hasChangedSteps)
  }, [hasChangedSteps])
  // router location typing (React Router v6+)
  const { state } = useLocation() as { state: ODProjectLocationState | null };

  // enforce a canonical steps order
  const stepsOrder: StepOrder = [
    "labelled",
    "augmented",
    "images",
    "dataSplit",
    "HyperTune",
    "infer",
    "remark",
    "application",
  ];

  // typed custom hook contract
  const {
    stepStatus,
    currentStep,
    isLoading,
    fetchProjectStatus,
    updateStepStatus,
    isStepAccessible,
  }: UseStepPersistenceReturn = useStepPersistence(userData, state);

  // Initialize and sync with backend status
  useEffect(() => {
    void fetchProjectStatus();
  }, [fetchProjectStatus]);

  // Sync iState with currentStep from backend
  useEffect(() => {
    if (!isLoading && currentStep) {
      updateIstate(currentStep);
    }
  }, [currentStep, isLoading]);

  // Sync completedSteps with stepStatus for backward compatibility
  useEffect(() => {
    if (stepStatus) {
      const newCompletedSteps: Partial<CompletedStepsState> = {};
      (Object.keys(stepStatus) as StepKey[]).forEach((step) => {
        newCompletedSteps[step] = stepStatus[step]?.status === "completed";
      });
      setCompletedSteps((prev) => ({ ...prev, ...newCompletedSteps }));
    }
  }, [stepStatus]);

  // Enhanced handleApply that updates backend and maintains existing behavior
  const handleApply = async (step: StepKey): Promise<void> => {
    try {
      // Update backend status
      await updateStepStatus(step, "completed");

      // Update local state for immediate UI feedback
      setCompletedSteps((prevSteps) => ({
        ...prevSteps,
        [step]: true,
      }));

      // Move to next step
      const nextStepIndex = stepsOrder.indexOf(step) + 1;
      if (nextStepIndex < stepsOrder.length) {
        const nextStep = stepsOrder[nextStepIndex];
        updateIstate(nextStep);
        await updateStepStatus(nextStep, "in_progress");
      }

      // Clear Redux step change if needed
      if (hasChangedSteps[step]) {
        dispatch(clearStepChange({ step }));
      }
    } catch (error) {
      console.log('error', error)
      // Fallback to original behavior if backend fails
      setCompletedSteps((prevSteps) => ({
        ...prevSteps,
        [step]: true,
      }));
      const nextStepIndex = stepsOrder.indexOf(step) + 1;
      if (nextStepIndex < stepsOrder.length) {
        updateIstate(stepsOrder[nextStepIndex]);
      }
    }
  };

  // Enhanced handleChange that updates backend
  const handleChange = async (step: StepKey): Promise<void> => {
    try {
      dispatch(markStepChanged({ step }));
      if (isStepAccessible(step)) {
        await updateStepStatus(step, "in_progress");
      }
    } catch {
      // Continue with original Redux behavior
      dispatch(markStepChanged({ step }));
    }
  };

  // Show loader while fetching status or before iState is set
  if (isLoading || !iState) {
    return (
      <div>
        <Header />
        <Sidenav />
        <div className="WrapperArea">
          <div className="WrapperBox">
            <Loader visible variant="fade" color="#16a34a" size={48} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <Sidenav />
      <div className="WrapperArea">
        <div className="WrapperBox">
          <div className="NewTitleBox">
            <h2 className="NewTitle">
              {state?.name} / <span>Version {state?.version}</span>
            </h2>
            <h4 className="NewTitle">Model: Object Detection</h4>
          </div>

          <div className="StepBox">
            <ul>
              <li className={iState === "labelled" ? "active" : ""}>
                <a
                  className="Text"
                  onClick={() =>
                    isStepAccessible("labelled") && updateIstate("labelled")
                  }
                  style={{
                    pointerEvents: isStepAccessible("labelled")
                      ? "auto"
                      : "none",
                    color: isStepAccessible("labelled") ? "#3cab4a" : "#aaa",
                  }}
                >
                  Upload Labelled Data
                  {stepStatus?.labelled?.status === "completed" && " ✓"}
                </a>
              </li>
              <li className={iState === "augmented" ? "active" : ""}>
                <a
                  className="Text"
                  onClick={() =>
                    isStepAccessible("augmented") && updateIstate("augmented")
                  }
                  style={{
                    pointerEvents: isStepAccessible("augmented")
                      ? "auto"
                      : "none",
                    color: isStepAccessible("augmented") ? "#3cab4a" : "#aaa",
                  }}
                >
                  Augmentations
                  {stepStatus?.augmented?.status === "completed" && " ✓"}
                </a>
              </li>
              <li className={iState === "images" ? "active" : ""}>
                <a
                  className="Text"
                  onClick={() =>
                    isStepAccessible("images") && updateIstate("images")
                  }
                  style={{
                    pointerEvents: isStepAccessible("images") ? "auto" : "none",
                    color: isStepAccessible("images") ? "#3cab4a" : "#aaa",
                  }}
                >
                  Augmented <br /> Images
                  {stepStatus?.images?.status === "completed" && " ✓"}
                </a>
              </li>
              <li className={iState === "dataSplit" ? "active" : ""}>
                <a
                  className="Text"
                  onClick={() =>
                    isStepAccessible("dataSplit") && updateIstate("dataSplit")
                  }
                  style={{
                    pointerEvents: isStepAccessible("dataSplit")
                      ? "auto"
                      : "none",
                    color: isStepAccessible("dataSplit") ? "#3cab4a" : "#aaa",
                  }}
                >
                  Data Split Ratio
                  {stepStatus?.dataSplit?.status === "completed" && " ✓"}
                </a>
              </li>
              <li className={iState === "HyperTune" ? "active" : ""}>
                <a
                  className="Text"
                  onClick={() =>
                    isStepAccessible("HyperTune") && updateIstate("HyperTune")
                  }
                  style={{
                    pointerEvents: isStepAccessible("HyperTune")
                      ? "auto"
                      : "none",
                    color: isStepAccessible("HyperTune") ? "#3cab4a" : "#aaa",
                  }}
                >
                  Tune Hyper Parameters
                  {stepStatus?.HyperTune?.status === "completed" && " ✓"}
                </a>
              </li>
              <li className={iState === "infer" ? "active" : ""}>
                <a
                  className="Text"
                  onClick={() =>
                    isStepAccessible("infer") && updateIstate("infer")
                  }
                  style={{
                    pointerEvents: isStepAccessible("infer") ? "auto" : "none",
                    color: isStepAccessible("infer") ? "#3cab4a" : "#aaa",
                  }}
                >
                  Infer Images
                  {stepStatus?.infer?.status === "completed" && " ✓"}
                </a>
              </li>
              <li className={iState === "remark" ? "active" : ""}>
                <a
                  className="Text"
                  onClick={() =>
                    isStepAccessible("remark") && updateIstate("remark")
                  }
                  style={{
                    pointerEvents: isStepAccessible("remark") ? "auto" : "none",
                    color: isStepAccessible("remark") ? "#3cab4a" : "#aaa",
                  }}
                >
                  Remarks
                  {stepStatus?.remark?.status === "completed" && " ✓"}
                </a>
              </li>
              <li className={iState === "application" ? "active" : ""}>
                <a
                  className="Text"
                  onClick={() =>
                    isStepAccessible("application") &&
                    updateIstate("application")
                  }
                  style={{
                    pointerEvents: isStepAccessible("application")
                      ? "auto"
                      : "none",
                    color: isStepAccessible("application") ? "#3cab4a" : "#aaa",
                  }}
                >
                  Application
                  {stepStatus?.application?.status === "completed" && " ✓"}
                </a>
              </li>
            </ul>
          </div>

          {iState === "labelled" && (
            <Labelled
              state={state}
              userData={userData}
              onApply={() => handleApply("labelled")}
              onChange={() => handleChange("augmented")}
              url={url}
            />
          )}

          {iState === "augmented" && (
            <Augumentation
              state={state}
              userData={userData}
              onApply={() => handleApply("augmented")}
              onChange={() => handleChange("images")}
              url={url}
            />
          )}

          {iState === "images" && (
            <AugumentImages
              
              state={state}
              userData={userData}
              onApply={() => handleApply("images")}
              onChange={() => handleChange("dataSplit")}
              url={url}
            />
          )}

          {iState === "dataSplit" && (
            <DataSplit
              state={state}
              userData={userData}
              onApply={() => handleApply("dataSplit")}
              onChange={() => handleChange("HyperTune")}
              url={url}
            />
          )}

          {iState === "HyperTune" && (
            <HyperTune
              state={state}
              userData={userData}
              onApply={() => handleApply("HyperTune")}
              onChange={() => handleChange("infer")}
              url={url}
            />
          )}

          {/* {iState === "infer" && (
            <InferImages
              state={state}
              userData={userData}
              onApply={() => handleApply("infer")}
              onChange={() => handleChange("remark")}
              url={url}
            />
          )} */}

          {iState === "remark" && (
            <Remark
              username={userData?.activeUser?.userName}
              task="defectdetection"
              project={state?.name}
              version={state?.version}
              onApply={() => handleApply("remark")}
              onChange={() => handleChange("application")}
            />
          )}

          {iState === "application" && (
            <Application
              url={url}
              state={state}
              username={userData?.activeUser?.userName}
              task="objectdetection"
              project={state?.name}
              version={state?.version}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectTraining;
