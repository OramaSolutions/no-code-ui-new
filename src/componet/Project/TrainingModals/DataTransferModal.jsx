import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { IoClose } from 'react-icons/io5';
import { MdMinimize, MdExpandMore } from 'react-icons/md';
import { DataTransfer, StopDataTransfer, TrainingbatchApi } from '../../../reduxToolkit/Slices/projectSlices';
import { ClassStopDataTransfer } from '../../../reduxToolkit/Slices/classificationSlices';
import { commomObj } from '../../../utils';
import TrainingStatusHeader from './components/TrainingStatusHeader';
import TrainingBatches from './components/TrainingBatches';
import ValidationMatrix from './components/ValidationMatrix';
import TrainingActions from './components/TrainingActions';

const initialstate = {
    openImage: false,
    trainingImage: 'No image',
};

function DataTransferModal({ url, data, setData, apiresponse, setResponse, flag, setFlag, onApply, state, userData, task, taskId }) {
    const dispatch = useDispatch();
    const [pollStatus, setPollStatus] = useState({ status: '', progress: '', result: '', error: '' });
    const [pollingActive, setPollingActive] = useState(false);
    const [pollingStopped, setPollingStopped] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const pollingStoppedRef = useRef(false);
    const [istate, updateIstate] = useState(initialstate);
    const [rows, setRows] = useState([]);
    const [showButtons, setShowButtons] = useState(false);
    const [status, setStatus] = useState({
        loadingImage: false,
        loadingMatrix: false,
        errorImage: '',
        errorMatrix: '',
    });

    useEffect(() => {
        pollingStoppedRef.current = pollingStopped;
    }, [pollingStopped]);

    useEffect(() => {
        if (data.opentrainModal && taskId && !pollingActive) {
            setPollingActive(true);
            setPollingStopped(false);
            pollTrainingStatus(taskId);
            pollUntilImageExists();
        }
    }, [data.opentrainModal, taskId]);

    const pollTrainingStatus = async (tId) => {
        const pollUrl = `${url}training_status/${tId}`;
        const poll = async () => {
            if (pollingStoppedRef.current) return;
            try {
                const res = await fetch(pollUrl);
                const dataRes = await res.json();
                if (res.status) {
                    setPollStatus({
                        status: dataRes.status || '',
                        progress: dataRes.progress || '',
                        result: dataRes.result || '',
                        error: dataRes.error || '',
                    });
                    if (dataRes.progress === 'Training completed successfully') {
                        setData((prev) => ({ ...prev, opentraincomplete: true, opentrainModal: true }));
                        setPollingActive(false);
                        setPollingStopped(true);
                        return;
                    }
                    if (dataRes.progress === 'Training failed') {
                        setPollStatus((prev) => ({ ...prev, error: dataRes.error || 'Training Failed' }));
                        setPollingActive(false);
                        setPollingStopped(true);
                        return;
                    }
                }
                setTimeout(poll, 10000);
            } catch (err) {
                if (!pollingStoppedRef.current) setTimeout(poll, 10000);
            }
        };
        poll();
    };

    const pollUntilImageExists = async () => {
        const pollUrl = `${url}train_batch_img_get?username=${userData?.activeUser?.userName}&task=${task}&project=${state?.name}&version=${state?.version}`;
        const poll = async () => {
            if (pollingStoppedRef.current) return;
            try {
                const res = await fetch(pollUrl);
                const dataRes = await res.json();
                if (dataRes.status === 'ok') {
                    setFlag((prev) => !prev);
                    return;
                } else {
                    setTimeout(poll, 10000);
                }
            } catch (err) {
                if (!pollingStoppedRef.current) setTimeout(poll, 10000);
            }
        };
        poll();
    };

    useEffect(() => {
        if (flag) {
            setShowButtons(true);
        }
    }, [flag]);

    const fetchData = async () => {
        setStatus((prev) => ({ ...prev, loadingMatrix: true, errorMatrix: '' }));
        try {
            let apiendpoint = task === 'classification' ? 'val_matrix_cls' : 'val_matrix';
            const response = await fetch(`${url}${apiendpoint}?username=${userData?.activeUser?.userName}&task=${task}&project=${state?.name}&version=${state?.version}`);

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            if (task === 'classification') {
                if (data.per_class_accuracy && Array.isArray(data.per_class_accuracy)) {
                    const parsedRows = data.per_class_accuracy.map((line) => {
                        const classMatch = line.match(/Class:\s*([^\|]+)/);
                        const accuracyMatch = line.match(/Accuracy:\s*([\d.]+)%/);
                        return {
                            Class: classMatch ? classMatch[1].trim() : '',
                            Accuracy: accuracyMatch ? parseFloat(accuracyMatch[1]) : 0,
                        };
                    });
                    setRows(parsedRows);
                } else {
                    setRows([]);
                }
            } else if (task === 'objectdetection') {
                if (data.matrix && typeof data.matrix === 'object') {
                    const parsedRows = Object.entries(data.matrix).map(([className, metrics]) => ({
                        className,
                        precision: metrics.P ? (parseFloat(metrics.P) * 100).toFixed(2) : '',
                        recall: metrics.R ? (parseFloat(metrics.R) * 100).toFixed(2) : '',
                        accuracy: metrics.Acc !== undefined ? parseFloat(metrics.Acc).toFixed(2) : '',
                    }));
                    setRows(parsedRows);
                } else {
                    setRows([]);
                }
            }
            setStatus((prev) => ({ ...prev, loadingMatrix: false }));
        } catch (error) {
            setStatus((prev) => ({ ...prev, loadingMatrix: false, errorMatrix: error.message || 'Error fetching validation matrix' }));
        }
    };

    const fetchImage = async () => {
        setStatus((prev) => ({ ...prev, loadingImage: true, errorImage: '' }));
        try {
            const payload = {
                username: userData?.activeUser?.userName,
                version: state?.version,
                project: state?.name,
                task: task,
            };
            const response = await dispatch(TrainingbatchApi({ payload, url }));
            if (response?.payload?.image_base64 || response?.payload?.image) {
                updateIstate({ ...istate, trainingImage: response?.payload?.image });
            } else {
                updateIstate({ ...istate, trainingImage: 'No image' });
            }
            setStatus((prev) => ({ ...prev, loadingImage: false }));
        } catch (error) {
            setStatus((prev) => ({ ...prev, loadingImage: false, errorImage: error.message || 'Error fetching image' }));
        }
    };

    const stopHandler = async () => {
        try {
            const formData = new FormData();
            formData.append('username', userData?.activeUser?.userName);
            formData.append('version', state?.version);
            formData.append('project', state?.name);
            formData.append('task', task);
            const res = task === 'objectdetection' ? await dispatch(StopDataTransfer({ payload: formData, url })) : await dispatch(ClassStopDataTransfer({ payload: formData, url }));
            if (res?.payload?.status === 200) {
                handleclose();
                updateIstate(initialstate);
                toast.success(res?.payload?.data.message, commomObj);
                onApply();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleMinimize = () => {
        setMinimized(true);
    };

    const handleMaximize = () => {
        setMinimized(false);
    };

    const handleclose = () => {
        setData({ ...data, opentrainModal: false });
        setResponse('');
        setFlag(false);
        setPollingStopped(true);
        setMinimized(false);
    };

    const handleProceed = () => {
        setData({ ...data, opentraincomplete: false, opentrainModal: false });
        setResponse('');
        setFlag(false);
        onApply();
        setPollStatus({ status: '', progress: '', result: '', error: '' });
        setPollingActive(false);
        setPollingStopped(true);
        setMinimized(false);
    };

    const openImageModal = (base64Image) => {
        const newWindow = window.open();
        if (newWindow) {
            newWindow.document.write(`
                <img src="data:image/png;base64,${base64Image}" style="max-width:100%; height:auto;" alt="Training Image" />
            `);
            newWindow.document.title = 'Training Image';
        }
    };

    const inProgress = !data?.opentraincomplete && !pollingStopped;

    return (
        <>
            <AnimatePresence>
                {data.opentrainModal && !minimized && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                            onClick={handleMinimize}
                        />

                        {/* Modal */}
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl pointer-events-auto overflow-hidden max-h-[90vh] flex flex-col"
                            >
                                {/* Header */}
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 relative flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Training Monitor</h2>
                                        <p className="text-blue-100 text-sm">Real-time training progress and metrics</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleMinimize}
                                            className="text-white/80 hover:text-white transition-colors"
                                            title="Minimize"
                                        >
                                            <MdMinimize className="w-5 h-5" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleMinimize}
                                            className="text-white/80 hover:text-white transition-colors"
                                            title="Minimize"
                                        >
                                            <IoClose className="w-6 h-6" />
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {/* Status Header */}
                                    <TrainingStatusHeader inProgress={inProgress} pollStatus={pollStatus} pollingStopped={pollingStopped} />

                                    {/* Content Grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Training Batches */}
                                        <TrainingBatches trainingImage={istate.trainingImage} showButtons={showButtons} status={status} fetchImage={fetchImage} openImageModal={openImageModal} />

                                        {/* Validation Matrix */}
                                        <ValidationMatrix task={task} rows={rows} showButtons={showButtons} status={status} fetchData={fetchData} />
                                    </div>

                                    {/* Actions */}
                                    <TrainingActions isComplete={data.opentraincomplete} onStop={stopHandler} onProceed={handleProceed} />
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>

            {/* Minimized Indicator */}
            <AnimatePresence>
                {data.opentrainModal && minimized && (
                    <motion.button
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleMaximize}
                        className="fixed bottom-6 right-6 z-50 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            {/* Status Indicator */}
                            <div className="flex items-center gap-3">
                                {inProgress ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                    />
                                ) : data.opentraincomplete ? (
                                    <div className="w-4 h-4 bg-green-400 rounded-full" />
                                ) : (
                                    <div className="w-4 h-4 bg-red-400 rounded-full" />
                                )}
                                <div>
                                    <h4 className="font-bold text-sm">Training Monitor</h4>
                                    <p className="text-xs text-blue-100">
                                        {inProgress ? 'In Progress...' : data.opentraincomplete ? 'Completed' : 'Failed'}
                                    </p>
                                </div>
                            </div>

                            {/* Progress Info */}
                            {inProgress && pollStatus.progress && (
                                <div className="text-xs bg-white/20 px-3 py-1 rounded-full max-w-[200px] truncate">
                                    {pollStatus.progress}
                                </div>
                            )}

                            {/* Expand Icon */}
                            <motion.div
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <MdExpandMore className="w-5 h-5" />
                            </motion.div>
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    );
}

export default DataTransferModal;
