import React from 'react';
import { motion } from 'framer-motion';
import { MdClose, MdPlayArrow } from 'react-icons/md';

function InferActions({ loading, onInfer, hasImage }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-4"
        >
         

            <motion.button
                whileHover={{ scale: hasImage && !loading ? 1.02 : 1 }}
                whileTap={{ scale: hasImage && !loading ? 0.98 : 1 }}
                onClick={onInfer}
                disabled={loading || !hasImage}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[180px] justify-center"
            >
                {loading ? (
                    <>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Inferring...</span>
                    </>
                ) : (
                    <>
                        <MdPlayArrow className="w-5 h-5" />
                        <span>Start Inference</span>
                    </>
                )}
            </motion.button>
        </motion.div>
    );
}

export default InferActions;
