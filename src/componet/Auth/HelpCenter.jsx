import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiX, HiMail, HiPhone } from 'react-icons/hi';
import { MdSupportAgent } from 'react-icons/md';

function HelpSupport({ show, setShow, onSubmit, help }) {
    const { modal } = show;

    const closeModal = () => {
        setShow({ ...show, modal: false });
    };

    // Animation variants
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { duration: 0.3 }
        },
        exit: { 
            opacity: 0,
            transition: { duration: 0.2 }
        }
    };

    const modalVariants = {
        hidden: { 
            opacity: 0,
            scale: 0.8,
            y: -50
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.4
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 50,
            transition: {
                duration: 0.2
            }
        }
    };

    const iconVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                damping: 15,
                stiffness: 200,
                delay: 0.2
            }
        }
    };

    return (
        <AnimatePresence mode="wait">
            {modal && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={closeModal}
                    >
                        {/* Modal Container */}
                        <motion.div
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <motion.button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Close modal"
                            >
                                <HiX className="w-6 h-6" />
                            </motion.button>

                            {/* Icon */}
                            <motion.div
                                className="flex justify-center mb-6"
                                variants={iconVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                                    <MdSupportAgent className="w-8 h-8 text-blue-600" />
                                </div>
                            </motion.div>

                            {/* Content */}
                            <motion.div
                                className="text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.4 }}
                            >
                                {/* Title */}
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    Contact Us
                                </h3>

                                {/* Description */}
                                <p className="text-gray-600 text-base mb-6 leading-relaxed">
                                    Before proceeding it's recommended to seek<br />
                                    advice from an expert
                                </p>

                                {/* Email Link */}
                                <motion.a
                                    href="mailto:applications@oramasolutions.in"
                                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-base mb-2 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <HiMail className="w-5 h-5" />
                                    applications@oramasolutions.in
                                </motion.a>
                                <motion.a
                                    href="tel:01142360010"
                                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-base mb-4 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <HiPhone className="w-5 h-5" />
                                    011 4236 0010
                                </motion.a>

                                {/* Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                    {/* Cancel Button */}
                                    <motion.button
                                        onClick={closeModal}
                                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Cancel
                                    </motion.button>

                                    {/* Proceed Button */}
                                    <motion.button
                                        onClick={help ? closeModal : () => onSubmit()}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Proceed
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default HelpSupport;
