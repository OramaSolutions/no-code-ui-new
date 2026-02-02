import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { MdArrowBack, MdArrowForward, MdCheckCircle, MdError } from "react-icons/md";

function DefectVisualizePanel({ onApply, onBack }) {
    const { defectTrainData } = useSelector(
        (state) => state.defectDetection
    );

    const [loadedImages, setLoadedImages] = useState({
        bad: [],
        good: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);

        // Pre-load images in batches
        const loadImages = async () => {
            const badPromises = (defectTrainData?.bad_heatmaps || []).map(img =>
                new Promise((resolve) => {
                    const image = new Image();
                    image.src = `data:image/png;base64,${img}`;
                    image.onload = () => resolve(img);
                    image.onerror = () => resolve(null);
                })
            );

            const goodPromises = (defectTrainData?.good_heatmaps || []).map(img =>
                new Promise((resolve) => {
                    const image = new Image();
                    image.src = `data:image/png;base64,${img}`;
                    image.onload = () => resolve(img);
                    image.onerror = () => resolve(null);
                })
            );

            const [badResults, goodResults] = await Promise.all([
                Promise.all(badPromises),
                Promise.all(goodPromises)
            ]);

            setLoadedImages({
                bad: badResults.filter(Boolean),
                good: goodResults.filter(Boolean)
            });
            setIsLoading(false);
        };

        loadImages();
    }, [defectTrainData]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
                <span className="ml-3 text-gray-600">Loading visualizations...</span>
            </div>
        );
    }

    const renderImages = (images, type) => (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {images.map((img, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative overflow-hidden rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300"
                >
                    <img
                        src={`data:image/png;base64,${img}`}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        alt={`Heatmap ${i + 1}`}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-sm font-medium">Heatmap {i + 1}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
        >
            {/* HEADER */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                <h3 className="text-2xl font-bold text-white">Heatmap Visualization</h3>
                <p className="text-blue-100">Model predictions visualized as heatmaps</p>
            </div>

            <div className="p-6 space-y-10">
                {/* BAD HEATMAPS */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <MdError className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-gray-800">Defective Samples</h4>
                            <p className="text-gray-600 text-sm">Heatmaps showing defect regions in bad samples</p>
                        </div>
                    </div>
                    {renderImages(defectTrainData?.bad_heatmaps || [], "bad")}
                </div>

                {/* GOOD HEATMAPS */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <MdCheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-gray-800">Good Samples</h4>
                            <p className="text-gray-600 text-sm">Heatmaps showing normal regions in good samples</p>
                        </div>
                    </div>
                    {renderImages(defectTrainData?.good_heatmaps || [], "good")}
                </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="p-6 border-t border-blue-100 bg-white flex justify-between">
                <button
                    onClick={onBack}
                    className="px-7 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center gap-2 group"
                >
                    <MdArrowBack className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Results
                </button>

                <button
                    onClick={onApply}
                    className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-3 group"
                >
                    Proceed
                    <MdArrowForward className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
}

export default DefectVisualizePanel;