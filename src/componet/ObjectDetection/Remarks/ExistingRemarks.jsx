import React from 'react';
import { motion } from 'framer-motion';
import { MdInfo, MdAttachFile } from 'react-icons/md';

function ExistingRemarks({ existingRemark, uploadedFiles }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 space-y-4"
        >
            <div className="flex items-center gap-2 text-blue-800">
                <MdInfo className="w-5 h-5" />
                <h3 className="font-bold">Existing User Remarks</h3>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-200">
                <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">{existingRemark}</pre>
            </div>

            {uploadedFiles.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 text-slate-700 mb-2">
                        <MdAttachFile className="w-4 h-4" />
                        <span className="text-sm font-semibold">Uploaded Files:</span>
                    </div>
                    <ul className="space-y-2">
                        {uploadedFiles.map((file, idx) => (
                            <li key={idx} className="text-sm text-slate-600 bg-white rounded-lg px-3 py-2 border border-slate-200">
                                {file}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </motion.div>
    );
}

export default ExistingRemarks;
