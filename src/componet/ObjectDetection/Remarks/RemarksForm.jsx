import React from 'react';
import { motion } from 'framer-motion';
import { MdInfo } from 'react-icons/md';
import RemarksActions from './RemarksActions';

function RemarksForm({
    observation,
    scopeOfImprovement,
    numOfTries,
    hardwareFile,
    files,
    loading,
    isEditMode,
    inputHandler,
    fileHandler,
    hardwareFileHandler,
    saveHandler,
    onNext,
}) {
    return (
        <form onSubmit={saveHandler} className="space-y-6">
            {/* Observations */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
            >
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    Observations
                    <div className="group relative">
                        <MdInfo className="w-4 h-4 text-slate-400 cursor-help" />
                        <div className="absolute left-0 top-full mb-2 hidden group-hover:block w-64 p-2 bg-slate-800 text-white text-xs rounded-lg shadow-lg z-10">
                            Record your observations about the training process and results
                        </div>
                    </div>
                </label>
                <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
                    placeholder="Enter your observations..."
                    name="observation"
                    value={observation}
                    onChange={inputHandler}
                />
            </motion.div>

            {/* Scope of Improvement */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
            >
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Scope of Improvement
                </label>
                <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
                    placeholder="Enter scope of improvement..."
                    name="scopeOfImprovement"
                    value={scopeOfImprovement}
                    onChange={inputHandler}
                />
            </motion.div>

            {/* Grid: Number of Tries and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Number of Tries */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Number of Tries
                    </label>
                    <input
                        type="number"
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        placeholder="Enter number of tries"
                        name="numOfTries"
                        value={numOfTries}
                        onWheel={(e) => e.target.blur()}
                        onChange={inputHandler}
                    />
                </motion.div>

                {/* Date (Read-only) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Date
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl text-slate-800 font-medium cursor-not-allowed"
                        value={new Date().toISOString().split('T')[0]}
                        readOnly
                    />
                </motion.div>
            </div>

            {/* Hardware Settings File */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Hardware Settings (.pfs file)
                </label>
                <input
                    type="file"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    accept=".pfs"
                    onChange={hardwareFileHandler}
                />
                {hardwareFile && (
                    <p className="text-sm text-slate-600 mt-2">Selected: {hardwareFile.name}</p>
                )}
            </motion.div>

            {/* Additional Files */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            >
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Attach Additional Files (.pdf, .pfs)
                </label>
                <input
                    type="file"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    multiple
                    accept=".pdf,.pfs"
                    onChange={fileHandler}
                />
                {files.length > 0 && (
                    <p className="text-sm text-slate-600 mt-2">{files.length} file(s) selected</p>
                )}
            </motion.div>

            {/* Actions */}
            <RemarksActions
                loading={loading}
                isEditMode={isEditMode}
                onNext={onNext}
                showNextOnly={false}
            />
        </form>
    );
}

export default RemarksForm;
