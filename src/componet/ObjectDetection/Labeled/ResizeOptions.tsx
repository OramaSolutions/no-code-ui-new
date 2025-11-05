import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ResizeOptions = ({ resizecheck, width, inputHandler, handleUpload }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
        >
            {/* Resize Checkbox */}
            <label className="flex items-start gap-4 p-5 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer group">
                <input
                    type="checkbox"
                    name="resizecheck"
                    checked={resizecheck}
                    onChange={inputHandler}
                    className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
                />
                <div className="flex-1">
                    <p className="font-medium text-slate-700 group-hover:text-indigo-700 transition-colors">
                        Resize images for faster inference
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                        Reduce image width to ~500px to speed up processing time
                    </p>
                </div>
                <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
            </label>

            {/* Resize Input & Button */}
            <AnimatePresence>
                {resizecheck && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 overflow-hidden"
                    >
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Target Width (pixels)
                            </label>
                            <input
                                type="number"
                                name="width"
                                value={width || ""}
                                onChange={inputHandler}
                                // onWheel={(e) => e.target.blur()}
                                placeholder="e.g., 500"
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleUpload}
                            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Resize Dataset
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ResizeOptions;
