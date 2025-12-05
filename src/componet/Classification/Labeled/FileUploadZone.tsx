import React from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";

const FileUploadZone = ({ onDrop }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/zip': ['.zip'] },
        multiple: false,
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
        >
            <div
                {...getRootProps()}
                className={`
                    relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer
                    ${isDragActive 
                        ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 scale-[1.02]' 
                        : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-slate-100'
                    }
                `}
            >
                <input {...getInputProps()} />
                
                <motion.div 
                    className="flex flex-col items-center justify-center gap-4"
                    animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        animate={isDragActive ? { 
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                        } : {}}
                        transition={{ duration: 0.5 }}
                        className={`
                            w-20 h-20 rounded-full flex items-center justify-center
                            ${isDragActive 
                                ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500' 
                                : 'bg-gradient-to-br from-indigo-400 to-purple-400'
                            }
                        `}
                    >
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </motion.div>

                    <div className="text-center">
                        <p className="text-lg font-semibold text-slate-700 mb-1">
                            {isDragActive ? "Drop your ZIP file here" : "Drag & drop your ZIP file here"}
                        </p>
                        <p className="text-sm text-slate-500">
                            or <span className="text-indigo-600 font-medium">browse</span> from your device
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Required: xyz.zip → xyz → images & labels folders
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default FileUploadZone;
