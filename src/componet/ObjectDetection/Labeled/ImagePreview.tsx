import React from "react";
import { motion } from "framer-motion";
import Loader from "../../../commonComponent/Loader";

const ImagePreview = ({ imageUrls, loading }) => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const item = {
        hidden: { opacity: 0, scale: 0.8 },
        show: { opacity: 1, scale: 1 }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
        >
            <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-slate-800">Preview Images</h3>
                {imageUrls?.length > 0 && (
                    <span className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {imageUrls.length} images
                    </span>
                )}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader />
                </div>
            ) : imageUrls?.length > 0 ? (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                >
                    {imageUrls.slice(0, 15).map((url, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ scale: 1.05, zIndex: 10 }}
                            className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200 hover:border-indigo-400 transition-all shadow-md hover:shadow-xl group"
                        >
                            <img
                                src={url}
                                alt={`Preview ${index}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                <span className="text-white text-xs font-medium">
                                    Image {index + 1}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="text-center py-12 text-slate-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No images to preview</p>
                </div>
            )}
        </motion.div>
    );
};

export default ImagePreview;
