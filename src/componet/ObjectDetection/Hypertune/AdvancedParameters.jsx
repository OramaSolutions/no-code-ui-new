import React from 'react';
import { motion } from 'framer-motion';
import ParameterInput from './ParameterInput';
import ParameterSlider from './ParameterSlider';
import { MdInfo } from 'react-icons/md';

function AdvancedParameters({ values, onValueChange }) {
    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 pt-6 border-t-2 border-slate-200"
        >
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full" />
                Advanced Parameters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Single Class Toggle */}
                <div className="bg-gradient-to-br from-slate-50 to-purple-50 p-6 rounded-xl border border-purple-100">
                    <label className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            Single Class
                            <div className="group relative">
                                <MdInfo className="w-4 h-4 text-slate-400 cursor-help" />
                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-slate-800 text-white text-xs rounded-lg shadow-lg z-10">
                                    Train the dataset as a single class. Effective in Defect Detection (scratches, dents, etc) as defect
                                </div>
                            </div>
                        </span>
                        <div className="relative inline-block w-12 h-6">
                            <input
                                type="checkbox"
                                checked={values.single_cls === 'true'}
                                onChange={(e) => onValueChange('single_cls', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-12 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </div>
                    </label>
                </div>

                {/* Device Selection */}
                <div className="bg-gradient-to-br from-slate-50 to-purple-50 p-6 rounded-xl border border-purple-100">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                        Device
                        <div className="group relative">
                            <MdInfo className="w-4 h-4 text-slate-400 cursor-help" />
                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-slate-800 text-white text-xs rounded-lg shadow-lg z-10">
                                Change training device
                            </div>
                        </div>
                    </label>
                    <div className="flex gap-4">
                        <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 rounded-lg cursor-pointer transition-all has-[:checked]:bg-indigo-600 has-[:checked]:text-white has-[:checked]:border-indigo-600">
                            <input
                                type="radio"
                                name="device"
                                value="0"
                                checked={values.device === '0'}
                                onChange={(e) => onValueChange('device', e.target.value)}
                                className="sr-only"
                            />
                            <span className="font-medium">GPU</span>
                        </label>
                        <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 rounded-lg cursor-pointer transition-all has-[:checked]:bg-indigo-600 has-[:checked]:text-white has-[:checked]:border-indigo-600">
                            <input
                                type="radio"
                                name="device"
                                value="cpu"
                                checked={values.device === 'cpu'}
                                onChange={(e) => onValueChange('device', e.target.value)}
                                className="sr-only"
                            />
                            <span className="font-medium">CPU</span>
                        </label>
                    </div>
                </div>

                {/* Patience */}
                <ParameterInput
                    name="patience"
                    label="Patience"
                    tooltip="Number of consistent iterations to wait for before terminating the training. Helpful if learning is slow."
                    value={values.patience}
                    onChange={(value) => onValueChange('patience', value)}
                />

                {/* Close Mosaic */}
                <ParameterInput
                    name="close_mosaic"
                    label="Close Mosaic"
                    tooltip="Add mosaicing in the last N epochs to mitigate overfitting."
                    value={values.close_mosaic}
                    onChange={(value) => onValueChange('close_mosaic', value)}
                />
            </div>

            {/* Dropout Slider */}
            <ParameterSlider
                name="dropout"
                label="Dropout"
                tooltip="Dropout rate for regularization."
                value={values.dropout}
                min={0}
                max={0.5}
                step={0.1}
                onChange={(value) => onValueChange('dropout', value)}
            />
        </motion.div>
    );
}

export default AdvancedParameters;
