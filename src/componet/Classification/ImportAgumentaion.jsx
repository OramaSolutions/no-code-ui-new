import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { MdError, MdAutorenew } from 'react-icons/md';

import Loader from '../../commonComponent/Loader';
function ImportAgumentaion({ onOpen, onClose, istate, setIstate, handleCancel }) {
    const handleclose = () => {
        setIstate({ ...istate, openModal: false, onClose: false });
        handleCancel();
    };

    return (
        <AnimatePresence>
            {onOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={!onClose ? undefined : handleclose}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden"
                        >
                            {!onClose ? (
                                // Loading State
                                <>
                                    {/* Header with Gradient */}
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 relative">
                                        <motion.button
                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleclose}
                                            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                                        >
                                            <IoClose className="w-6 h-6" />
                                        </motion.button>
                                        <h2 className="text-2xl font-bold text-white">Augmentation</h2>
                                        {/* <p className="text-blue-100 text-sm mt-1">In progress</p> */}
                                    </div>

                                    {/* Body - Loading Content */}
                                    <div className="p-8 text-center">
                                        {/* Loading Icon */}

                                        <Loader variant='moon' color='#2563EB' />
                                        {/* Text */}
                                        <div className="text-center space-y-2 mt-6">
                                            <h3 className="text-lg font-bold text-gray-800">
                                                Augmentation in Progress
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Please be patient, this may take some time
                                            </p>
                                        </div>







                                        {/* Animated Dots */}
                                        <div className="mt-6 flex items-center justify-center gap-2">
                                            <motion.div
                                                animate={{ scale: [1, 1.3, 1] }}
                                                transition={{ duration: 1, repeat: Infinity, repeatDelay: 0 }}
                                                className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                                            />
                                            <motion.div
                                                animate={{ scale: [1, 1.3, 1] }}
                                                transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2 }}
                                                className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                            />
                                            <motion.div
                                                animate={{ scale: [1, 1.3, 1] }}
                                                transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.4 }}
                                                className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                // Error State
                                <>
                                    {/* Header with Red Gradient */}
                                    <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-5 relative">
                                        <motion.button
                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleclose}
                                            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                                        >
                                            <IoClose className="w-6 h-6" />
                                        </motion.button>
                                        <h2 className="text-2xl font-bold text-white">Import Failed</h2>
                                        <p className="text-red-100 text-sm mt-1">Something went wrong</p>
                                    </div>

                                    {/* Body - Error Content */}
                                    <div className="p-8 text-center">
                                        {/* Error Icon */}
                                        <motion.div
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center"
                                        >
                                            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </motion.div>

                                        {/* Error Message */}
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                            Import Failed
                                        </h3>
                                        <p className="text-gray-600 mb-8">
                                            Please try again or contact support if the issue persists.
                                        </p>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleclose}
                                                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors duration-200"
                                            >
                                                Cancel
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleclose}
                                                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                                            >
                                                Try Again
                                            </motion.button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

export default ImportAgumentaion;
