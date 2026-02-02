import React from 'react';
import { motion } from 'framer-motion';
import { MdCheckCircle, MdRefresh } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';

function ActionButtons({ onReset, onApply, loading, isModelSelected }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-4"
        >
           

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onReset}
                disabled={loading}
                className="px-6 py-3 bg-white border-2 border-amber-300 text-amber-700 rounded-xl font-semibold hover:bg-amber-50 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
                <MdRefresh className="w-5 h-5" />
                Reset
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onApply}
                disabled={loading || !isModelSelected}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center"
            >
                {loading ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                ) : (
                    <>
                        <span>Apply Changes</span>
                        <MdCheckCircle className="w-5 h-5" />
                    </>
                )}
            </motion.button>
        </motion.div>
    );
}

export default ActionButtons;
