import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Labelled from "../Labeled/Labeled";

import HyperTune from "../Hypertune/HyperTune";
import Train from "../Training/Training";
import InferImages from "../InferImages/InferImages";
import Remark from "../Remarks/Remark";
import Application from "../Application";
import type {
  StepKey,
  ODProjectLocationState,
} from "../../../types/objectDetection/training";
import type { User } from "../../../types/user";
interface StepContentProps {
  currentStep: StepKey;
  handleApply: (step: StepKey) => Promise<void>;
  handleChange: (step: StepKey) => Promise<void>;
  url: string;
  state: ODProjectLocationState;
  userData: User | null;
}

const contentVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const StepContent: React.FC<StepContentProps> = ({
  currentStep,
  handleApply,
  handleChange,
  url,
  state,
  userData,
}) => {
  const renderStepComponent = () => {
    switch (currentStep) {
      case "labelled":
        return (
          <Labelled
            state={state}
            username={userData?.userName}
            onApply={() => handleApply("labelled")}
            onChange={() => handleChange("augmented")}
            url={url}
          />
        );

      case "HyperTune":
        return (
          <HyperTune
            state={state}
            username={userData?.userName}
            onApply={() => handleApply("HyperTune")}
            onChange={() => handleChange("infer")}
            url={url}
          />
        );

      case "Train":
        return (
          <Train
            state={state}
            username={userData?.userName}
            onApply={() => handleApply("Train")}
          />
        );
      case "infer":
        return (
          <InferImages
            state={state}
            username={userData?.userName}
            onApply={() => handleApply("infer")}
            onChange={() => handleChange("remark")}
            url={url}
          />
        );
      case "remark":
        return (
          <Remark
            username={userData?.userName}
            task="defectdetection"
            project={state?.name}
            version={state?.version}
            onApply={() => handleApply("remark")}
            onChange={() => handleChange("application")}
          />
        );
      case "application":
        return (
          <Application
            url={url}
            state={state}
            username={userData?.userName}
            task="defectdetection"
            project={state?.name}
            version={state?.version}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={contentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-4 min-h-[600px]"
        >
          {renderStepComponent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default StepContent;
