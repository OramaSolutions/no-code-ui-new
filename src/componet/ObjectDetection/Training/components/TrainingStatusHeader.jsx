import React from 'react';
import { motion } from 'framer-motion';
import { MdStop, MdCheckCircle } from 'react-icons/md';

function TrainingStatusHeader({ statusText, step, stoping, onStop, onProceed }) {
    const isActive = step === "running" || step === "monitor";
    const isCompleted = step === "completed";
    
    return (
        <div className="rounded-xl border border-blue-300 bg-blue-50 p-6 transition-all duration-300 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
                {/* Left side: Status with icon and text */}
                <div className="flex items-start space-x-3 flex-1">
                    {/* Animated Spinner for active states */}
                    {(isActive || step === "running") && (
                        <div className="relative flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 border-2 border-blue-200 rounded-full"></div>
                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                        </div>
                    )}
                    
                    {/* Checkmark for completed state */}
                    {isCompleted && (
                        <div className="flex-shrink-0 mt-0.5">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                                <svg 
                                    className="w-4 h-4 text-white" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth="3" 
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>
                    )}
                    
                    {/* Waiting state with subtle animation */}
                    {!isActive && !isCompleted && (
                        <div className="relative flex-shrink-0 mt-0.5">
                            <div className="w-4 h-4 bg-blue-400 rounded-full opacity-75 animate-pulse"></div>
                            <div className="w-4 h-4 bg-blue-400 rounded-full opacity-75 animate-pulse absolute top-0 delay-100"></div>
                        </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                        {/* Status text with smooth transition */}
                        <p className="text-sm text-gray-600 transition-all duration-300">
                            {statusText}
                        </p>
                        
                        {/* Success animation for completed state */}
                        {isCompleted && (
                            <div className="mt-1 flex items-center">
                                <span className="text-xs text-green-600 font-medium animate-[bounce_0.5s_ease-in-out]">
                                    ✓ All tasks completed
                                </span>
                                <div className="ml-2 flex space-x-1">
                                    {[0, 1, 2].map(i => (
                                        <div 
                                            key={i}
                                            className="w-1 h-1 bg-green-400 rounded-full animate-[bounce_1s_infinite]"
                                            style={{ animationDelay: `${i * 0.15}s` }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Right side: Action buttons */}
                <div className="flex-shrink-0">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isCompleted ? (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onProceed}
                                className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                <span>Proceed</span>
                                <MdCheckCircle className="w-4 h-4" />
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onStop}
                                disabled={stoping}
                                className={`px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2 ${
                                    !stoping ? 'hover:from-red-700 hover:to-rose-700 hover:shadow-xl' : 'opacity-70 cursor-not-allowed'
                                }`}
                            >
                                <MdStop className="w-4 h-4" />
                                <span>{stoping ? 'Stopping...' : 'Stop'}</span>
                            </motion.button>
                        )}
                    </motion.div>
                </div>
            </div>
            
            {/* Optional progress bar for active states - now spans full width */}
            {isActive && (
                <div className="mt-4 w-full bg-blue-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-1.5 rounded-full animate-[pulse_2s_ease-in-out_infinite] w-3/4"></div>
                </div>
            )}
            
            {/* Subtle background animation for active states */}
            {isActive && (
                <div className="absolute inset-0 overflow-hidden rounded-xl -z-10">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-100/50 to-transparent animate-[shimmer_3s_infinite]"></div>
                </div>
            )}
        </div>
    );
}

export default TrainingStatusHeader;