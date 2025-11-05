import React from 'react';
import { motion } from 'framer-motion';
import { MdImage } from 'react-icons/md';
import Loader from '../../../../commonComponent/Loader';

function TrainingBatches({ trainingImage, showButtons, status, fetchImage, openImageModal }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden"
        >
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-4 py-3 border-b-2 border-slate-200">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <MdImage className="w-5 h-5 text-indigo-600" />
                    Training Batches
                </h3>
            </div>
            <div className="p-4 min-h-[300px] flex items-center justify-center bg-slate-50">
                {trainingImage ? (
                    trainingImage === 'No image' ? (
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-slate-600">Waiting for training batches...</p>
                            {showButtons && (
                                <>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={fetchImage}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        Fetch Image
                                    </motion.button>
                                    {status.loadingImage && <div className="text-indigo-600 text-sm">Loading image...</div>}
                                    {status.errorImage && <div className="text-red-600 text-sm">{status.errorImage}</div>}
                                </>
                            )}
                        </div>
                    ) : (
                        <motion.img
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            src={`data:image/png;base64,${trainingImage}`}
                            alt="Training Batch"
                            onClick={() => openImageModal(trainingImage)}
                            className="max-w-full h-auto rounded-lg cursor-pointer hover:scale-105 transition-transform shadow-lg"
                        />
                    )
                ) : (
                    <Loader item="200px" />
                )}
            </div>
        </motion.div>
    );
}

export default TrainingBatches;
