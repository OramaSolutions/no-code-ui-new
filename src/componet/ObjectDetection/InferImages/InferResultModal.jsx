import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { MdCheckCircle, MdRefresh, MdZoomIn } from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function InferResultModal({ onOpen, output, setOutput, state, username, selectedFile, setSelectedFile, url, resultImage, onApply, onChange }) {
    const navigate = useNavigate();
    const [imageData, setImageData] = useState('');
    const [loading, setLoading] = useState(null);


    useEffect(() => {
        if (onOpen && resultImage) {
            setImageData(resultImage);
            setLoading(false);
            return;
        }

        if (onOpen && selectedFile && !resultImage) {
            const fetchImageData = async () => {
                try {
                    setLoading(true);
                    const timestamp = new Date().getTime();
                    const inferUrl = `${url}infer_yolov8?username=${username}&task=objectdetection&project=${state?.name}&version=${state?.version}&timestamp=${timestamp}`;
                    const response = await axios.get(inferUrl, {
                        responseType: 'blob',
                    });
                    const imageBlob = response.data;
                    const imageUrl = URL.createObjectURL(imageBlob);
                    setImageData(imageUrl);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching image data', error);
                    setLoading(null);
                }
            };
            fetchImageData();
        }
    }, [onOpen, selectedFile, resultImage, url, username, state]);

    const remarkHandler = () => {
        console.log('remarkHandler called');
        onChange();
        onApply();
    };

    const closeHandler = () => {
        setOutput((prev) => ({ ...prev, onOpen: !onOpen }));
        setSelectedFile(null);
        setImageData('');
        setLoading(null);

    };

    const downloadImage = () => {
        if (imageData) {
            const link = document.createElement('a');
            link.href = imageData;
            link.download = `inference-result-${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={closeHandler}
                    />

                    {/* Modal - Increased size */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] max-h-[90vh] pointer-events-auto flex flex-col"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 relative flex-shrink-0">
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={closeHandler}
                                    className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                                >
                                    <IoClose className="w-6 h-6" />
                                </motion.button>
                                <h2 className="text-2xl font-bold text-white">Inference Result</h2>
                                <p className="text-blue-100 text-sm mt-1">View your model's predictions</p>
                            </div>

                            {/* Body - Adjusted for better image display */}
                            <div className="flex-1 overflow-hidden p-4">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center h-full space-y-6">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                            className="relative w-24 h-24"
                                        >
                                            <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                                            <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-purple-600"></div>
                                        </motion.div>
                                        <div className="text-center">
                                            <h3 className="text-lg font-bold text-slate-800">Processing Image</h3>
                                            <p className="text-sm text-slate-600 mt-2">Running inference on your model...</p>
                                        </div>
                                    </div>
                                ) : imageData ? (
                                    <div className="w-full h-full rounded-xl overflow-auto border-2 border-slate-200 bg-slate-50 flex items-center justify-center">
                                        <img
                                            src={imageData}
                                            alt="Inference Result"
                                            className="w-auto h-auto max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                        <svg className="w-20 h-20 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-xl font-semibold">No Result Available</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer Actions */}
                            {!loading && imageData && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="px-8 pb-8 pt-4 border-t-2 border-slate-200 flex justify-center gap-4 flex-shrink-0"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={closeHandler}
                                        className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors duration-200 shadow-md flex items-center gap-2"
                                    >
                                        <MdRefresh className="w-5 h-5" />
                                        Infer More Images
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={remarkHandler}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                                    >
                                        <span>Continue & Add Remark</span>
                                        <MdCheckCircle className="w-5 h-5" />
                                    </motion.button>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

export default InferResultModal;
