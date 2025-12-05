import React from "react";
import { motion } from "framer-motion";

interface ProjectHeaderProps {
  name?: string;
  version?: number|string;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ name, version }) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"
          >
            {name} / Version {version}
          </motion.h1>
          <motion.p
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-slate-600 mt-2 font-medium text-sm"
          >
            Model: Object Detection
          </motion.p>
        </div>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-lg"
        >
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProjectHeader;
