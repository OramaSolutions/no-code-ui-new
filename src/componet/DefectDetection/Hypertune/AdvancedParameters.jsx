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

            {/* Test Split Mode */}
            <div className="bg-gradient-to-br from-slate-50 to-purple-50 p-6 rounded-xl border border-purple-100">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                    Test Split Mode
                    <div className="group relative">
                        <MdInfo className="w-4 h-4 text-slate-400 cursor-help" />
                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-slate-800 text-white text-xs rounded-lg shadow-lg z-10">
                            Choose how to split your dataset for testing
                        </div>
                    </div>
                </label>
                <div className="flex gap-4">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 rounded-lg cursor-pointer transition-all has-[:checked]:bg-indigo-600 has-[:checked]:text-white has-[:checked]:border-indigo-600">
                        <input
                            type="radio"
                            name="test_split_mode"
                            value="from_dir"
                            checked={values.test_split_mode === 'from_dir'}
                            onChange={(e) => onValueChange('test_split_mode', e.target.value)}
                            className="sr-only"
                        />
                        <span className="font-medium">Dir</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 rounded-lg cursor-pointer transition-all has-[:checked]:bg-indigo-600 has-[:checked]:text-white has-[:checked]:border-indigo-600">
                        <input
                            type="radio"
                            name="test_split_mode"
                            value="synthetic"
                            checked={values.test_split_mode === 'synthetic'}
                            onChange={(e) => onValueChange('test_split_mode', e.target.value)}
                            className="sr-only"
                        />
                        <span className="font-medium">Synthetic</span>
                    </label>
                </div>
            </div>

            {/* Tiling Section */}
            <div className="space-y-6 pt-6 border-t-2 border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full" />
                    Tiling Parameters
                </h3>

                {/* Apply Tiling Toggle */}
                <div className="bg-gradient-to-br from-slate-50 to-green-50 p-6 rounded-xl border border-green-100">
                    <label className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            Apply Tiling
                            <div className="group relative">
                                <MdInfo className="w-4 h-4 text-slate-400 cursor-help" />
                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-slate-800 text-white text-xs rounded-lg shadow-lg z-10">
                                    Enable tiling for processing large images in smaller chunks
                                </div>
                            </div>
                        </span>
                        <div className="relative inline-block w-12 h-6">
                            <input
                                type="checkbox"
                                checked={values.apply_tiling}
                                onChange={(e) => onValueChange('apply_tiling', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-12 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </div>
                    </label>
                </div>

                {values.apply_tiling && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ParameterInput
                            name="tile_size"
                            label="Tile Size"
                            tooltip="Size of the tiles to process"
                            value={values.tile_size}
                            onChange={(value) => onValueChange('tile_size', value)}
                        />
                        <ParameterInput
                            name="stride"
                            label="Stride"
                            tooltip="Stride between tiles"
                            value={values.stride}
                            onChange={(value) => onValueChange('stride', value)}
                        />

                        {/* Random Tiling Section */}
                        <div className="bg-gradient-to-br from-slate-50 to-green-50 p-6 rounded-xl border border-green-100">
                            <label className="flex items-center justify-between mb-4">
                                <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    Random Tiling
                                </span>
                                <div className="relative inline-block w-12 h-6">
                                    <input
                                        type="checkbox"
                                        checked={values.use_random_tiling}
                                        onChange={(e) => onValueChange('use_random_tiling', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-12 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </div>
                            </label>

                            {values.use_random_tiling && (
                                <ParameterInput
                                    name="random_tile_count"
                                    label="Tile Count"
                                    tooltip="Number of random tiles to generate"
                                    value={values.random_tile_count}
                                    onChange={(value) => onValueChange('random_tile_count', value)}
                                />
                            )}
                        </div>
                    </div>
                )}
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
