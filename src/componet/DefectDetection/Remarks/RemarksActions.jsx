import React from 'react';
import { motion } from 'framer-motion';
import { MdCheckCircle, MdSave, MdArrowForward } from 'react-icons/md';

function RemarksActions({ loading, isEditMode, onNext, showNextOnly }) {
    if (showNextOnly) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center pt-4"
            >
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onNext}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                    <span>Next</span>
                    <MdArrowForward className="w-5 h-5" />
                </motion.button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex justify-center gap-4 pt-4"
        >
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center"
            >
                {loading ? (
                    <>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Saving...</span>
                    </>
                ) : (
                    <>
                        <MdSave className="w-5 h-5" />
                        <span>{isEditMode ? 'Update' : 'Submit'}</span>
                    </>
                )}
            </motion.button>

            {isEditMode && (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onNext}
                    disabled={loading}
                    className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <span>Next</span>
                    <MdArrowForward className="w-5 h-5" />
                </motion.button>
            )}
        </motion.div>
    );
}

export default RemarksActions;
