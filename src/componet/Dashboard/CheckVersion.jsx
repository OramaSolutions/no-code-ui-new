import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';
import { MdWarning } from 'react-icons/md';

function CheckVersion({ show, setShow, model, istate, setIstate }) {
    const { openModal, projectName } = show;

    const handleVersion = () => {
        setShow({ ...show, openModal: false, openVersion: true });
    };

    const handleProject = () => {
        setIstate({ ...istate, open: true });
        setShow({ ...show, openModal: false });
    };

    const handleClose = () => {
        setShow({ ...show, openModal: false });
    };

    return (
        <AnimatePresence>
            {openModal && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={handleClose}
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
                            {/* Header with Icon */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 relative">
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                                >
                                    <IoClose className="w-6 h-6" />
                                </motion.button>
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    >
                                        <MdWarning className="w-8 h-8 text-white" />
                                    </motion.div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Project Exists!</h2>
                                        <p className="text-amber-100 text-sm mt-0.5">
                                            <span className="font-semibold">{projectName}</span> already exists
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-center"
                                >
                                    <p className="text-gray-700 text-lg font-medium mb-2">
                                        Want to Create a New Version?
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        You can create a new version for this project or start over with a different name.
                                    </p>
                                </motion.div>
                            </div>

                            {/* Footer */}
                            <div className="px-3 pb-3 flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleProject}
                                    className="flex items-center justify-evenly flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-md transition-colors duration-200 gap-2"
                                >
                                    <IoCloseCircle className="w-5 h-5" />
                                    No, Go Back
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleVersion}
                                    className="flex items-center justify-evenly flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-md transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <IoCheckmarkCircle className="w-5 h-5" />
                                    Yes, Create
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

export default CheckVersion;
