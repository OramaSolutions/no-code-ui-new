import React from 'react';
import { motion } from 'framer-motion';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { MdInfo } from 'react-icons/md';

function ConfidenceSlider({ conf, onChange }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
        >
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                Confidence Level
                <div className="group relative">
                    <MdInfo className="w-4 h-4 text-slate-400 cursor-help" />
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-72 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-lg z-10">
                        <p className="font-semibold mb-1">Confidence Threshold:</p>
                        <p>• Decrease if objects are not detected</p>
                        <p>• Increase if extra objects are detected</p>
                    </div>
                </div>
            </label>

            <div className="bg-gradient-to-br from-slate-50 to-indigo-50 p-6 rounded-xl border border-indigo-100">
                <div className="flex items-center justify-between mb-3 text-xs text-slate-600">
                    <span>Low (0.0)</span>
                    <span className="text-lg font-bold text-indigo-600">{conf.toFixed(1)}</span>
                    <span>High (1.0)</span>
                </div>

                <Slider
                    min={0}
                    max={1}
                    step={0.1}
                    value={conf}
                    onChange={onChange}
                    railStyle={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#e2e8f0',
                    }}
                    trackStyle={{
                        height: 8,
                        borderRadius: 4,
                        background: 'linear-gradient(to right, #4F46E5, #7C3AED)',
                    }}
                    handleStyle={{
                        height: 24,
                        width: 24,
                        marginTop: -8,
                        backgroundColor: '#ffffff',
                        border: '4px solid #4F46E5',
                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
                        opacity: 1,
                    }}
                />

                <div className="mt-4 text-center">
                    <p className="text-xs text-slate-600">
                        Current threshold: <span className="font-bold text-indigo-600">{(conf * 100).toFixed(0)}%</span>
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

export default ConfidenceSlider;
