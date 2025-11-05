import React from 'react';
import { motion } from 'framer-motion';
import { MdCloudUpload, MdClose } from 'react-icons/md';
import { HiPhotograph } from 'react-icons/hi';

function ImageUploadZone({ getRootProps, getInputProps, selectedFile, onClear }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <label className="block text-sm font-semibold text-slate-700 mb-3">
                Upload Image
            </label>

            {selectedFile ? (
                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl"
                >
                    <HiPhotograph className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{selectedFile.name}</p>
                        <p className="text-xs text-slate-600">
                            {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClear}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                        <MdClose className="w-5 h-5 text-red-600" />
                    </motion.button>
                </motion.div>
            ) : (
                <div
                    {...getRootProps()}
                    className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-200"
                >
                    <input {...getInputProps()} />
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="inline-block"
                    >
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                            <MdCloudUpload className="w-8 h-8 text-indigo-600" />
                        </div>
                    </motion.div>
                    <p className="text-slate-700 font-medium mb-1">
                        Drag & drop an image here
                    </p>
                    <p className="text-sm text-slate-500">
                        or click to browse from your device
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                        Supports: JPG, PNG, JPEG
                    </p>
                </div>
            )}
        </motion.div>
    );
}

export default ImageUploadZone;
