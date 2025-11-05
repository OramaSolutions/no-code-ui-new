import React from 'react';
import { motion } from 'framer-motion';
import { HiInformationCircle } from 'react-icons/hi2';

export const ToggleRow = ({ name, label, checked, onChange, tooltip }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      className="flex items-center justify-between p-2 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all group"
    >
      <div className="flex items-center gap-3 flex-1">
        <label
          htmlFor={name}
          className="text-sm font-semibold text-slate-700 cursor-pointer group-hover:text-indigo-700 transition-colors"
        >
          {label}
        </label>
        {tooltip && (
          <div className="relative group/tooltip">
            <HiInformationCircle className="w-4 h-4 text-slate-400 hover:text-indigo-500 cursor-help transition-colors" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl z-10">
              {tooltip}
              <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-slate-800" />
            </div>
          </div>
        )}
      </div>

      <motion.label
        whileTap={{ scale: 0.95 }}
        className="relative inline-flex items-center cursor-pointer"
      >
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className={`
          w-11 h-6 rounded-full transition-all duration-300
          ${checked 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/50' 
            : 'bg-slate-300'
          }
        `}>
          <motion.div
            animate={{ x: checked ? 22 : 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="w-5 h-5 mt-0.5 bg-white rounded-full shadow-md"
          />
        </div>
      </motion.label>
    </motion.div>
  );
};
