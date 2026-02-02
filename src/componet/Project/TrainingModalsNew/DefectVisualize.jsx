import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdArrowBack, MdArrowForward, MdImageNotSupported } from 'react-icons/md';

function DefectVisualize({ onApply, state, userData, task, setData, data, model }) {
    const { defectTrainData } = data;
    
    const handleClose = () => {
        setData({ ...data, openVisualize: false });
        onApply();
    };
    
    const backHandler = () => {
        setData({ ...data, opendefectTraining: true, openVisualize: false });
    };

    // Animation variants
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const modalVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.95,
            y: -20
        },
        visible: { 
            opacity: 1, 
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 500
            }
        },
        exit: { 
            opacity: 0, 
            scale: 0.95,
            y: 20,
            transition: { duration: 0.2 }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 300
            }
        }
    };

    return (
        <AnimatePresence mode="wait">
            {data.openVisualize && (
                <motion.div
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={handleClose}
                >
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
                    >
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
                            <h3 className="text-xl font-bold text-white">
                                Heatmap Visualization Results
                            </h3>
                            <button
                                onClick={handleClose}
                                className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                            >
                                <MdClose className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="flex-1 p-6 overflow-y-auto">
                            {/* Bad Heatmaps Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mb-8"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <h5 className="text-lg font-bold text-slate-800">
                                        Bad Heatmaps
                                    </h5>
                                    <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
                                        {defectTrainData?.bad_heatmaps?.length || 0} images
                                    </span>
                                </div>

                                {defectTrainData?.bad_heatmaps?.length > 0 ? (
                                    <motion.div
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                                    >
                                        {defectTrainData.bad_heatmaps.map((imgSrc, index) => (
                                            <motion.div
                                                key={index}
                                                variants={imageVariants}
                                                whileHover={{ scale: 1.05, zIndex: 10 }}
                                                className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-red-50 to-red-100"
                                            >
                                                <div className="aspect-video overflow-hidden">
                                                    <img
                                                        src={`data:image/png;base64,${imgSrc}`}
                                                        alt={`Bad Heatmap ${index + 1}`}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="absolute bottom-2 left-2 text-white text-xs font-semibold">
                                                        Image {index + 1}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 bg-red-50 rounded-xl border-2 border-dashed border-red-200">
                                        <MdImageNotSupported className="w-16 h-16 text-red-400 mb-3" />
                                        <p className="text-red-600 font-semibold">No Bad Heatmaps Found</p>
                                    </div>
                                )}
                            </motion.div>

                            {/* Good Heatmaps Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <h5 className="text-lg font-bold text-slate-800">
                                        Good Heatmaps
                                    </h5>
                                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                                        {defectTrainData?.good_heatmaps?.length || 0} images
                                    </span>
                                </div>

                                {defectTrainData?.good_heatmaps?.length > 0 ? (
                                    <motion.div
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                                    >
                                        {defectTrainData.good_heatmaps.map((imgSrc, index) => (
                                            <motion.div
                                                key={index}
                                                variants={imageVariants}
                                                whileHover={{ scale: 1.05, zIndex: 10 }}
                                                className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-green-50 to-green-100"
                                            >
                                                <div className="aspect-video overflow-hidden">
                                                    <img
                                                        src={`data:image/png;base64,${imgSrc}`}
                                                        alt={`Good Heatmap ${index + 1}`}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="absolute bottom-2 left-2 text-white text-xs font-semibold">
                                                        Image {index + 1}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 bg-green-50 rounded-xl border-2 border-dashed border-green-200">
                                        <MdImageNotSupported className="w-16 h-16 text-green-400 mb-3" />
                                        <p className="text-green-600 font-semibold">No Good Heatmaps Found</p>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* Modal Footer - Fixed */}
                        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex items-center justify-between flex-shrink-0">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={backHandler}
                                className="px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
                            >
                                <MdArrowBack className="w-5 h-5" />
                                Back
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleClose}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                Next
                                <MdArrowForward className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default DefectVisualize;
