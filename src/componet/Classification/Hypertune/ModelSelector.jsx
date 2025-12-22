import React from 'react';
import { motion } from 'framer-motion';
import { MdInfo, MdModelTraining } from 'react-icons/md';

function ModelSelector({ models, selectedModel, onModelChange }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
        >
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                <MdModelTraining className="w-5 h-5 text-indigo-600" />
                Model Type
                <div className="group relative">
                    <MdInfo className="w-4 h-4 text-slate-400 cursor-help" />
                    <div className="absolute left-0 top-full mb-2 hidden group-hover:block w-80 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-lg z-10">
                        <p className="font-semibold mb-1">Model Selection Guide:</p>
                        <p>• <strong>Efficient:</strong> For easy tasks (classes &lt; 5, dataset &lt; 600)</p>
                        <p>• <strong>Small:</strong> For classes &gt; 5, dataset &gt; 1000</p>
                        <p>• <strong>Medium:</strong> For large datasets and hard-to-detect features</p>
                    </div>
                </div>
            </label>
            <select
                value={selectedModel}
                onChange={(e) => onModelChange(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
            >
                <option value="">Choose model type</option>
                {models.length > 0 ? (
                    models.map((item, i) => (
                        <option key={i} value={item}>
                            {item}
                        </option>
                    ))
                ) : (
                    <option disabled>No models available</option>
                )}
            </select>
        </motion.div>
    );
}

export default ModelSelector;
