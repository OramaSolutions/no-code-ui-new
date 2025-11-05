import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Labelled from "../Labeled/Labeled";

import HyperTune from "../Hypertune/HyperTune";
import InferImages from "../InferImages/InferImages";
import Remark from "../Remarks/Remark";
import Application from "../Application";
import type {
  StepKey,
  ODProjectLocationState,
  ODUserLogin,
} from "../../../types/objectDetection/training";

interface StepContentProps {
  currentStep: StepKey;
  handleApply: (step: StepKey) => Promise<void>;
  handleChange: (step: StepKey) => Promise<void>;
  url: string;
  state: ODProjectLocationState;
  userData: ODUserLogin;
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
            userData={userData}
            onApply={() => handleApply("labelled")}
            onChange={() => handleChange("augumented")}
            url={url}
          />
        );
     
      
     
      case "HyperTune":
        return (
          <HyperTune
            state={state}
            userData={userData}
            onApply={() => handleApply("HyperTune")}
            onChange={() => handleChange("infer")}
            url={url}
          />
        );
      case "infer":
        return (
          <InferImages
            state={state}
            userData={userData}
            onApply={() => handleApply("infer")}
            onChange={() => handleChange("remark")}
            url={url}
          />
        );
      case "remark":
        return (
          <Remark
            username={userData?.activeUser?.userName}
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
            username={userData?.activeUser?.userName}
            task="objectdetection"
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
