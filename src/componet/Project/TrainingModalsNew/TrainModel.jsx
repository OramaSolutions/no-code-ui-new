import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { MdModelTraining, MdRocketLaunch, MdMinimize } from 'react-icons/md';
import DataTransferModal from './DataTransferModal';
import DefectTrainModal from './DefectTrainModal';
import DefectVisualize from './DefectVisualize';
import { toast } from "react-toastify";
import { getUrl } from '../../../config/config';
import axios from 'axios';


function TrainModel({ phase, setPhase, onApply, username, state, task, apiPoint }) {



    // 2️⃣ UI chrome (ONLY UI)
    const [minimized, setMinimized] = useState(false);

    // 3️⃣ Defect-specific flow (isolated)
    const [defectFlow, setDefectFlow] = useState({
        openTrain: false,
        openVisualize: false,
    });

    const isModalOpen = phase !== "idle";
    const isStarting = phase === "starting";
    const isRunning = phase === "running";
    const isComplete = phase === "completed";
    const canMinimize = phase === "running";




    const [output, setOutput] = useState('');
    const [flag, setFlag] = useState(false);
    const [taskId, setTaskId] = useState(null);

    let url = getUrl(task);

    const handleOpen = async () => {
        try {
            setPhase("starting");
            setMinimized(false);
            handleclose();

            await axios.get(`${url}train_yolov8`, {
                params: {
                    username,
                    task,
                    project: state?.name,
                    version: state?.version,
                },
            });

            setPhase("running");
        } catch (err) {
            toast.error(
                err?.response?.data?.details ||
                err?.response?.data?.error ||
                "Failed to start training"
            );

            setPhase("idle");
            setMinimized(false);

        }
    };

    const handleclose = () => {
        setPhase("idle");
        setMinimized(false);

    };

    const handleMinimize = () => {
        if (!canMinimize) return;
        setMinimized(true);

    };

    const handleMaximize = () => {
        setMinimized(false);

    };
    const handleDefect = () => {
        setPhase("running"); // training-like lifecycle
        setDefectFlow({ openTrain: true, openVisualize: false });
        handleclose();
    };

    return (
        <>
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                            onClick={canMinimize ? handleMinimize : handleclose}
                        />

                        {/* Modal */}
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden"
                            >
                                {/* Header */}
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 relative">
                                    <div className="flex items-center gap-2 absolute top-4 right-4">
                                        {isRunning && (
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={handleMinimize}
                                                className="text-white/80 hover:text-white transition-colors"
                                                title="Minimize"
                                            >
                                                <MdMinimize className="w-5 h-5" />
                                            </motion.button>
                                        )}
                                        <motion.button
                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleclose}
                                            className="text-white/80 hover:text-white transition-colors"
                                            title={isRunning ? 'Minimize' : 'Close'}
                                        >
                                            <IoClose className="w-6 h-6" />
                                        </motion.button>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">Train Model</h2>
                                    <p className="text-blue-100 text-sm mt-1">
                                        {isRunning ? 'Training in progress' : 'Start training your AI model'}
                                    </p>
                                </div>

                                {/* Body */}
                                <div className="p-8">
                                    <div className="flex flex-col items-center justify-center space-y-6">
                                        {/* Animated Icon */}
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 200,
                                                damping: 15,
                                                delay: 0.1,
                                            }}
                                            className="relative"
                                        >
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.2, 1],
                                                    opacity: [0.5, 0.8, 0.5],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: 'easeInOut',
                                                }}
                                                className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full blur-xl"
                                            />
                                            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                                <MdModelTraining className="w-12 h-12 text-indigo-600" />
                                            </div>
                                        </motion.div>

                                        {/* Text */}
                                        <div className="text-center space-y-2">
                                            <h3 className="text-lg font-bold text-gray-800">Ready to Train</h3>
                                            <p className="text-sm text-gray-600">Click the button below to start the training process</p>
                                        </div>

                                        {/* Info Cards */}
                                        <div className="w-full grid grid-cols-2 gap-3">
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200"
                                            >
                                                <p className="text-xs text-blue-600 font-semibold mb-1">Project</p>
                                                <p className="text-sm text-gray-800 font-bold truncate">{state?.name}</p>
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 }}
                                                className="bg-gradient-to-br from-purple-50 to-indigo-50 p-3 rounded-lg border border-purple-200"
                                            >
                                                <p className="text-xs text-purple-600 font-semibold mb-1">Version</p>
                                                <p className="text-sm text-gray-800 font-bold">{state?.version}</p>
                                            </motion.div>
                                        </div>

                                        {/* Train Button */}
                                        <motion.button
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={task === 'defectdetection' ? handleDefect : handleOpen}
                                            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                                        >
                                            <MdRocketLaunch className="w-6 h-6" />
                                            <span>Start Training</span>
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>

            {/* Minimized Indicator */}
            <AnimatePresence>
                {isRunning && minimized && (
                    <motion.button
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleMaximize}
                        className="fixed bottom-6 right-6 z-50 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all flex items-center gap-3 group"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span className="font-semibold">Training in Progress</span>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Click to view</span>
                    </motion.button>
                )}
            </AnimatePresence>

            <DataTransferModal
                phase={phase}
                onComplete={() => setPhase("completed")}
                onFail={() => setPhase("failed")}
                apiresponse={output}
                setResponse={setOutput}
                flag={flag}
                setFlag={setFlag}
                onApply={onApply}
                username={username}
                state={state}
                task={task}
                url={url}


            />

            {defectFlow.openTrain && (
                <DefectTrainModal
                    onComplete={() =>
                        setDefectFlow({ openTrain: false, openVisualize: true })
                    }
                    data={istate}
                    setData={updateIstate}
                    onApply={onApply}
                    username={username}
                    state={state}
                    task={task}
                    model={initialData.model}
                />
            )}

            {defectFlow.openVisualize && (
                <DefectVisualize
                    data={istate}
                    setData={updateIstate}
                    onApply={onApply}
                    username={username}
                    state={state}
                    task={task}
                    model={initialData.model}
                />
            )}
        </>
    );
}

export default TrainModel;
