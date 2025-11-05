import React from "react";
import { motion } from "framer-motion";
import type { StepKey } from "../../../types/objectDetection/training";

interface StepButtonProps {
  step: { key: StepKey; label: string; icon: string };
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  isAccessible: boolean;
  onClick: () => void;
}

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  show: { x: 0, opacity: 1 },
};

const StepButton: React.FC<StepButtonProps> = ({
  step,
  index,
  isActive,
  isCompleted,
  isAccessible,
  onClick,
}) => {
  return (
    <motion.button
      variants={itemVariants}
      whileHover={isAccessible ? { scale: 1.02, x: 4 } : {}}
      whileTap={isAccessible ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={!isAccessible}
      className={`
        w-full p-4 rounded-xl text-left transition-all duration-300 relative overflow-hidden
        ${isActive 
          ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg" 
          : isCompleted
          ? "bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-2 border-indigo-300"
          : isAccessible
          ? "bg-slate-50 text-slate-700 hover:bg-slate-100 border-2 border-slate-200"
          : "bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-slate-200"
        }
      `}
    >
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      
      <div className="relative z-10 flex items-center gap-3">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1, type: "spring" }}
          className={`
            w-10 h-10 rounded-full flex items-center justify-center text-xl
            ${isActive 
              ? "bg-white/20 backdrop-blur-sm" 
              : isCompleted
              ? "bg-indigo-200"
              : "bg-slate-200"
            }
          `}
        >
          {isCompleted ? "✓" : step.icon}
        </motion.span>
        
        <div className="flex-1">
          <span className="font-medium">{step.label}</span>
        </div>
        
        {isActive && (
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-2 h-2 rounded-full bg-white"
          />
        )}
      </div>
    </motion.button>
  );
};

export default StepButton;
