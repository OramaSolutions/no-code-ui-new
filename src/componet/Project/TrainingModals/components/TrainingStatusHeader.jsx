import React from 'react';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

function TrainingStatusHeader({ inProgress, pollStatus, pollingStopped }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm"
        >
            <div className="flex items-start gap-4">
                {/* Status Icon */}
                <div className="flex-shrink-0">
                    {inProgress ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center"
                        >
                            <FaSpinner className="text-blue-600 text-xl" />
                        </motion.div>
                    ) : pollingStopped && pollStatus.error ? (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Status Text */}
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                        {inProgress ? 'Training in Progress' : pollingStopped && pollStatus.error ? 'Training Failed' : 'Training Complete'}
                    </h3>
                    {inProgress && <p className="text-sm text-gray-600 mt-1">Please be patient, this may take some time.</p>}
                    {pollingStopped && pollStatus.error && <p className="text-sm text-red-600 mt-1">{pollStatus.error}</p>}
                </div>
            </div>

            {/* Progress Details */}
            {inProgress && pollStatus && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 rounded-lg bg-white p-4 border border-gray-200"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</dt>
                            <dd className="text-sm text-gray-900 font-medium mt-1 capitalize">{pollStatus.status}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Progress</dt>
                            <dd className="text-sm text-gray-900 font-medium mt-1 capitalize">{pollStatus.progress}</dd>
                        </div>
                        {pollStatus.result && (
                            <div className="md:col-span-2">
                                <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Result</dt>
                                <dd className="text-sm text-gray-900 mt-1">{pollStatus.result}</dd>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

export default TrainingStatusHeader;
