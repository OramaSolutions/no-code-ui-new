import React from 'react';
import { motion } from 'framer-motion';
import { MdStop, MdCheckCircle } from 'react-icons/md';

function TrainingActions({ isComplete, stoping, onStop, onProceed }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between pt-4 border-t-2 border-slate-200"
        >
            {isComplete ? (
                <>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                            <MdCheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">Training Completed!</h4>
                            <p className="text-sm text-slate-600">Ready to proceed to the next step</p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onProceed}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                        <span>Proceed Further</span>
                        <MdCheckCircle className="w-5 h-5" />
                    </motion.button>
                </>
            ) : (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onStop}
                    disabled={stoping}
                    className="mx-auto px-8 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                    <MdStop className="w-5 h-5" />
                    <span>{stoping ? 'Stopping...' : 'Stop Training'}</span>
                </motion.button>
            )}
        </motion.div>
    );
}

export default TrainingActions;
