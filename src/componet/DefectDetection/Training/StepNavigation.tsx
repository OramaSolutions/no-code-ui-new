import React from "react";
import { motion } from "framer-motion";
import StepButton from "./StepButton";
import type { StepKey, StepStatusMap } from "../../../types/objectDetection/training";

interface StepNavigationProps {
  currentStep: StepKey;
  stepStatus: StepStatusMap | null;
  isStepAccessible: (step: StepKey) => boolean;
  onStepClick: (step: StepKey) => void;
}

const steps = [
  { key: "labelled" as StepKey, label: "Upload Labelled Data", icon: "📤" },
  { key: "HyperTune" as StepKey, label: "Tune Hyper Parameters", icon: "⚙️" },
  { key: "infer" as StepKey, label: "Infer Images", icon: "🔍" },
  { key: "remark" as StepKey, label: "Remarks", icon: "📝" },
  { key: "application" as StepKey, label: "Application", icon: "🚀" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  stepStatus,
  isStepAccessible,
  onStepClick,
}) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-72 bg-white rounded-2xl shadow-lg border border-indigo-100 p-4 h-fit sticky top-4  "
    >
      <h2 className="text-xl font-bold text-slate-800 mb-6 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text">
        Training Pipeline
      </h2>
      
      <div className="space-y-3">
        {steps.map((step, index) => (
          <StepButton
            key={step.key}
            step={step}
            index={index}
            isActive={currentStep === step.key}
            isCompleted={stepStatus?.[step.key]?.status === "completed"}
            isAccessible={isStepAccessible(step.key)}
            onClick={() => isStepAccessible(step.key) && onStepClick(step.key)}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default StepNavigation;
