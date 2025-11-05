import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { MdModelTraining, MdRocketLaunch } from 'react-icons/md';
import DataTransferModal from './DataTransferModal';
import DefectTrainModal from '../DefectDetection/DefectTrainModal';
import DefectVisualize from '../DefectDetection/DefectVisualize';
import { getUrl } from '../../config/config';

const initialstate = {
    opentrainModal: false,
    opentraincomplete: false,
    opendefectTraining: false,
    isTrainDataLoaded: false,
    openVisualize: false,
    defectTrainData: {}
};

function TrainModel({ initialData, setState, onApply, userData, state, task, apiPoint }) {
    const [istate, updateIstate] = useState(initialstate);
    const { opentrainModal, opentraincomplete, opendefectTraining, isTrainDataLoaded, openVisualize, defectTrainData } = istate;
    const [output, setOutput] = useState('');
    const [flag, setFlag] = useState(false);
    const [taskId, setTaskId] = useState(null);
    let url = getUrl(task);

    const handleOpen = async () => {
        try {
            updateIstate({ ...istate, opentrainModal: true });
            handleclose();
            
            const response = await fetch(
                `${url}${apiPoint}?username=${userData?.activeUser?.userName}&task=${task}&project=${state?.name}&version=${state?.version}`,
                { method: 'GET' }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Response received:', data);
            
            if (data.message === 'Training already completed.') {
                updateIstate(prev => ({ ...prev, opentraincomplete: true, opentrainModal: true }));
            }

            const tId = data.task_id;
            console.log('Task ID:', tId);
            setTaskId(tId);
        } catch (error) {
            console.error('Error fetching stream:', error);
        }
    };

    const handleclose = () => {
        console.log('ran handle close in train modal');
        setState({ ...initialData, openModal: false });
    };

    const handleDefect = () => {
        updateIstate({ ...istate, opendefectTraining: true });
        handleclose();
    };

    return (
        <>
            <AnimatePresence>
                {initialData.openModal && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                            onClick={handleclose}
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
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleclose}
                                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                                    >
                                        <IoClose className="w-6 h-6" />
                                    </motion.button>
                                    <h2 className="text-2xl font-bold text-white">Train Model</h2>
                                    <p className="text-blue-100 text-sm mt-1">
                                        Start training your AI model
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
                                                delay: 0.1 
                                            }}
                                            className="relative"
                                        >
                                            <motion.div
                                                animate={{ 
                                                    scale: [1, 1.2, 1],
                                                    opacity: [0.5, 0.8, 0.5]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: 'easeInOut'
                                                }}
                                                className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full blur-xl"
                                            />
                                            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                                <MdModelTraining className="w-12 h-12 text-indigo-600" />
                                            </div>
                                        </motion.div>

                                        {/* Text */}
                                        <div className="text-center space-y-2">
                                            <h3 className="text-lg font-bold text-gray-800">
                                                Ready to Train
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Click the button below to start the training process
                                            </p>
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

            <DataTransferModal
                data={istate}
                setData={updateIstate}
                apiresponse={output}
                setResponse={setOutput}
                flag={flag}
                setFlag={setFlag}
                onApply={onApply}
                userData={userData}
                state={state}
                task={task}
                url={url}
                taskId={taskId}
            />
            
            {opendefectTraining && (
                <DefectTrainModal
                    data={istate}
                    setData={updateIstate}
                    onApply={onApply}
                    userData={userData}
                    state={state}
                    task={task}
                    model={initialData.model}
                />
            )}
            
            {openVisualize && (
                <DefectVisualize
                    data={istate}
                    setData={updateIstate}
                    onApply={onApply}
                    userData={userData}
                    state={state}
                    task={task}
                    model={initialData.model}
                />
            )}
        </>
    );
}

export default TrainModel;
