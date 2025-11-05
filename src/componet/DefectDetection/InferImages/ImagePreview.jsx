import React from 'react';
import { motion } from 'framer-motion';
import { MdZoomIn } from 'react-icons/md';

function ImagePreview({ imagePreview, fileName }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
        >
            <label className="block text-sm font-semibold text-slate-700">
                Preview
            </label>
            <div className="relative rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-50 group">
                <img
                    src={imagePreview}
                    alt="Selected preview"
                    className="w-full max-h-[400px] object-contain"
                />
                <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity"
                >
                    <div className="text-white text-center">
                        <MdZoomIn className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm font-medium">{fileName}</p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default ImagePreview;
