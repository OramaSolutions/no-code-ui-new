import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { commomObj } from '../../utils';
import { DataSplitImages, DataSplits, ReturnDataSplit } from '../../reduxToolkit/Slices/projectSlices';
import useDebounce from './Debouncing';
import { MdDataset, MdCheckCircle, MdInfo } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import { HiAdjustments } from 'react-icons/hi';

function DataSplit({ onApply, username, state, onChange, url }) {
    const dispatch = useDispatch();
    const AgumentedSize = window.localStorage.getItem('AgumentedSize') || 0;
    const [trainingPercentage, setTrainingPercentage] = useState(80);
    const [flag, setFlag] = useState(false);
    const debouncedTrainingPercentage = useDebounce((trainingPercentage / 100).toFixed(2), 300);
    const { loading: splitLoading } = useSelector((state) => state.project);
    const { hasChangedSteps } = useSelector((state) => state.steps);

    const handleSliderChange = (value) => {
        setTrainingPercentage(value);
    };

    useEffect(() => {
        const getData = async () => {
            const payload = {
                username: username,
                version: state?.version,
                project: state?.name,
                task: 'classification',
            };
            const res = await dispatch(ReturnDataSplit({ payload, url }));
            if (res?.status === 200) {
                if (res?.payload?.data?.split_ratio) {
                    setTrainingPercentage(res?.payload?.data?.split_ratio * 100 || 80);
                }
                setFlag(true);
            } else {
                setFlag(true);
            }
        };

        getData();
    }, []);

    const saveHandler = async () => {
        let isSplit = false;

        const payload = {
            username: username,
            version: state?.version,
            project: state?.name,
            task: 'classification',
            split_ratio: debouncedTrainingPercentage || 0.8,
        };
        console.log('not changed called datasplit');
        isSplit = true;
        await dispatch(DataSplitImages({ payload, url }));
        onApply(isSplit);
    };

    const trainingCount = Math.trunc((trainingPercentage * AgumentedSize) / 100);
    const validationCount = Math.trunc(((100 - trainingPercentage) * AgumentedSize) / 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 "
        >
            {/* Header Section */}
            <div className="flex items-center gap-3">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg"
                >
                    <HiAdjustments className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Data Split Configuration</h2>
                    <p className="text-sm text-slate-600">Configure training and validation data split ratio</p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
            >
                <div className="p-8 space-y-8">
                    {/* Dataset Size */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                            <MdDataset className="w-5 h-5 text-indigo-600" />
                            Total Dataset Size
                            <div className="group relative">
                                <MdInfo className="w-4 h-4 text-slate-400 cursor-help" />
                                <div className="absolute  left-0 bottom-full mb-2 hidden group-hover:block w-96 p-2 bg- text-black text-xs rounded-lg shadow-lg z-10">
                                    Total number of augmented images in your dataset
                                </div>
                            </div>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={AgumentedSize}
                                disabled
                                className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl text-slate-800 font-semibold focus:outline-none cursor-not-allowed"
                            />
                        </div>
                    </motion.div>

                    {/* Info Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl"
                    >
                        <MdInfo className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <p className="font-semibold mb-1">Split Ratio Guidelines</p>
                            <p>Adjust the slider to divide your dataset into training and validation sets. A typical split is 80/20, with training at 80% or above for optimal model performance.</p>
                        </div>
                    </motion.div>

                    {/* Slider Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm font-semibold text-green-600">
                                <div className="w-3 h-3 bg-green-500 rounded-full" />
                                Training: {trainingPercentage}%
                            </span>
                            <span className="flex items-center gap-2 text-sm font-semibold text-rose-600">
                                <div className="w-3 h-3 bg-rose-500 rounded-full" />
                                Validation: {100 - trainingPercentage}%
                            </span>
                        </div>

                        {/* Single Slider with Visual Background */}
                        <div className="relative px-2 py-6">
                            {/* Background visualization that matches slider position */}
                            <div className="absolute top-1/2 left-2 right-2 h-3 -translate-y-1/2 flex rounded-full overflow-hidden">
                                <div 
                                    className="bg-green-500 transition-all duration-300"
                                    style={{ width: `${trainingPercentage}%` }}
                                />
                                <div 
                                    className="bg-rose-500 transition-all duration-300"
                                    style={{ width: `${100 - trainingPercentage}%` }}
                                />
                            </div>

                            {/* Actual Slider */}
                            <Slider
                                min={0}
                                max={100}
                                value={trainingPercentage}
                                onChange={handleSliderChange}
                                disabled={splitLoading}
                                className="relative"
                                railStyle={{
                                    height: 12,
                                    borderRadius: 9999,
                                    backgroundColor: 'transparent',
                                }}
                                trackStyle={{
                                    height: 12,
                                    borderRadius: 9999,
                                    backgroundColor: 'transparent',
                                }}
                                handleStyle={{
                                    height: 24,
                                    width: 24,
                                    marginTop: -10,
                                    backgroundColor: '#ffffff',
                                    border: '4px solid #4F46E5',
                                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
                                    opacity: 1,
                                    cursor: splitLoading ? 'not-allowed' : 'grab',
                                }}
                            />
                        </div>

                        {/* Progress Bar */}
                        <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-slate-100">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${trainingPercentage}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className="bg-gradient-to-r from-green-400 to-green-600"
                            />
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${100 - trainingPercentage}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className="bg-gradient-to-r from-rose-400 to-rose-600"
                            />
                        </div>
                    </motion.div>

                    {/* Split Results */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {/* Training Set */}
                        <div className="relative overflow-hidden rounded-xl  border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4 shadow-md">
                            {/* <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16" /> */}
                            <label className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                Training Set
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={trainingCount}
                                    disabled
                                    className="w-full px-4 py-3 bg-white/80 border-2 border-green-300 rounded-lg text-2xl font-bold text-green-700 focus:outline-none cursor-default"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-green-600">
                                    images
                                </div>
                            </div>
                        </div>

                        {/* Validation Set */}
                        <div className="relative overflow-hidden rounded-xl  border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 p-4 shadow-md">
                            {/* <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full -mr-16 -mt-16" /> */}
                            <label className="text-sm font-semibold text-rose-700 mb-2 flex items-center gap-2">
                                <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                                Validation Set
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={validationCount}
                                    disabled
                                    className="w-full px-4 py-3 bg-white/80 border-2 border-rose-300 rounded-lg text-2xl font-bold text-rose-700 focus:outline-none cursor-default"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-rose-600">
                                    images
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex justify-center gap-4"
            >
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.history.back()}
                    disabled={splitLoading}
                    className="px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <IoClose className="w-5 h-5" />
                    Cancel
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={saveHandler}
                    disabled={splitLoading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center"
                >
                    {splitLoading ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                    ) : (
                        <>
                            <span>Apply Split</span>
                            <MdCheckCircle className="w-5 h-5" />
                        </>
                    )}
                </motion.button>
            </motion.div>

            {/* Summary Card */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex justify-center"
            >
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-full shadow-md">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-slate-700">
                        {trainingCount} training + {validationCount} validation = {AgumentedSize} total images
                    </span>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default DataSplit;
