import React from 'react';
import { motion } from 'framer-motion';

export const PreviewPair = ({ original, transformed, transformStyle, label }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      // whileHover={{ scale: 1.02 }}
      className="space-y-3 bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
    >
      <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
        {label}
      </h4>

      <div className="grid grid-cols-2 gap-4">
        {/* Original Image */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500">Original</p>
          <motion.div
            // whileHover={{ scale: 1.05 }}
            className="relative aspect-square rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100 shadow-md"
          >
            {original ? (
              <img
                src={original}
                alt="Original"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </motion.div>
        </div>

        {/* Transformed Image */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-indigo-600">Augmented</p>
          <motion.div
            // whileHover={{ scale: 1.05 }}
            className="relative aspect-square rounded-xl overflow-hidden border-2 border-indigo-300 bg-indigo-50 shadow-md"
          >
            {transformed ? (
              <img
                src={transformed}
                alt="Transformed"
                className="w-full h-full object-cover"
                style={transformStyle || {}}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 mx-auto mb-2 rounded-full border-4 border-indigo-200 border-t-indigo-600"
                  />
                  <p className="text-xs text-slate-500">Processing...</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
