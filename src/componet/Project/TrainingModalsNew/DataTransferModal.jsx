import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { IoClose } from 'react-icons/io5';
import { MdMinimize, MdExpandMore } from 'react-icons/md';
import { StopDataTransfer } from '../../../reduxToolkit/Slices/projectSlices';
import { ClassStopDataTransfer } from '../../../reduxToolkit/Slices/classificationSlices';
import Loader from '../../../commonComponent/Loader';
import TrainingStatusHeader from './components/TrainingStatusHeader';
import TrainingBatches from './components/TrainingBatches';
import ValidationMatrix from './components/ValidationMatrix';
import TrainingActions from './components/TrainingActions';

const initialstate = {
    trainingImage: null,
};

function DataTransferModal({
    url,
    phase,
    onComplete,
    onFail,
    onApply,
    state,
    username,
    task,
}) {
    const dispatch = useDispatch();

    const [minimized, setMinimized] = useState(false);
    const [istate, updateIstate] = useState(initialstate);
    const [rows, setRows] = useState([]);
    const [isComplete, setIsComplete] = useState(false);

    const [fetchAllowed, setFetchAllowed] = useState(false);

    useEffect(() => {
        if (phase !== "running") return;
        const t = setTimeout(() => setFetchAllowed(true), 30000);
        return () => clearTimeout(t);
    }, [phase]);
    const [polling, setPolling] = useState(false);
    const pollRef = useRef(null);

    const [stoping, setStoping] = useState(false)


    const [status, setStatus] = useState({
        loadingImage: false,
        loadingMatrix: false,
        errorImage: '',
        errorMatrix: '',
    });



    // -----------polling for status-------------
    useEffect(() => {
        if (phase !== "running") return;

        setPolling(true);

        pollRef.current = setInterval(async () => {
            try {
                const res = await fetch(
                    `${url}training_status?username=${username}&task=${task}&project=${state?.name}&version=${state?.version}`
                );

                const result = await res.json();

                if (result.status === "completed") {
                    clearInterval(pollRef.current);
                    setPolling(false);
                    setIsComplete(true);
                    onComplete(); // 🔥 parent notified
                }

                if (result.status === "failed") {
                    clearInterval(pollRef.current);
                    setPolling(false);
                    onFail(); // 🔥 parent notified
                }
            } catch (err) {
                console.error("Training status poll failed", err);
            }
        }, 10000);

        return () => clearInterval(pollRef.current);
    }, [phase]);


    /* ---------- STATUS TEXT (UI ONLY) ---------- */
    const trainingStatusText = () => {
        if (phase !== "running") return 'Waiting for Pod to initialise training procedures.';
        if (isComplete) return 'Training completed successfully';
        if (status.errorImage || status.errorMatrix) return 'Error fetching training data';
        return 'Training running on RunPod';
    };

    /* ---------- FETCH VALIDATION MATRIX ---------- */
    const fetchData = async () => {
        if (phase !== "running" || !fetchAllowed) {
            setStatus(prev => ({
                ...prev,
                errorMatrix: 'Training has not started yet.',
            }));
            return;
        }
        setStatus(prev => ({ ...prev, loadingMatrix: true, errorMatrix: '' }));
        try {
            const res = await fetch(
                `${url}val_matrix?username=${username}&task=${task}&project=${state?.name}&version=${state?.version}`
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to fetch matrix');

            if (task === 'objectdetection') {
                setRows(
                    Object.entries(data.matrix || {}).map(([className, m]) => ({
                        className,
                        precision: m.P ? (m.P * 100).toFixed(2) : '',
                        recall: m.R ? (m.R * 100).toFixed(2) : '',
                        accuracy: m.Acc?.toFixed(2) || '',
                    }))
                );
            }
        } catch (e) {
            setStatus(prev => ({ ...prev, errorMatrix: e.message }));
        } finally {
            setStatus(prev => ({ ...prev, loadingMatrix: false }));
        }
    };

    /* ---------- FETCH TRAINING BATCH IMAGE ---------- */
    const fetchImage = async () => {
        if (phase !== "running" || !fetchAllowed) {
            setStatus(prev => ({
                ...prev,
                errorImage: 'Training has not started yet.',
            }));
            return;
        }
        setStatus(prev => ({ ...prev, loadingImage: true, errorImage: '' }));
        try {
            const res = await fetch(
                `${url}training_batches?username=${username}&task=${task}&project=${state?.name}&version=${state?.version}`
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to fetch image');

            updateIstate({ trainingImage: data.image });
        } catch (e) {
            setStatus(prev => ({ ...prev, errorImage: e.message }));
        } finally {
            setStatus(prev => ({ ...prev, loadingImage: false }));
        }
    };

    /* ---------- STOP TRAINING (KEEPED) ---------- */
    const stopHandler = async () => {
        try {
            setStoping(true);

            const formData = new FormData();
            formData.append("username", username);
            formData.append("version", state?.version);
            formData.append("project", state?.name);
            formData.append("task", task);

            await dispatch(StopDataTransfer({ payload: formData, url }));

            setStoping(false);
            clearInterval(pollRef.current);
            setIsComplete(false);
            setFetchAllowed(false);

            onApply();
            onFail(); // parent resets phase
        } catch (error) {
            alert("Error stopping training!");
            setStoping(false);
        }
    };


    const handleClose = () => {
        clearInterval(pollRef.current);
        setMinimized(false);
        setFetchAllowed(false);
        onFail(); // or parent decides
    };


    const openImageModal = (base64Image) => {
        const newWindow = window.open('', '_blank');

        if (!newWindow) return;

        newWindow.document.open();
        newWindow.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Training Image</title>
                <style>
                    body {
                        margin: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #0f172a;
                    }
                    img {
                        max-width: 100%;
                        max-height: 100vh;
                        object-fit: contain;
                    }
                </style>
            </head>
            <body>
                <img src="data:image/png;base64,${base64Image}" alt="Training Image" />
            </body>
        </html>
    `);
        newWindow.document.close();
    };

    const handleProceed = () => {

        clearInterval(pollRef.current);
        setPolling(false);
        setIsComplete(false);
        setMinimized(false);
        setFetchAllowed(false);

        onApply();

    };

    const inProgress = true; // training assumed running

    return (
        <>
            <AnimatePresence>
                {phase === "running" && !minimized && (
                    <>
                        <motion.div className="fixed inset-0 bg-black/50 z-50" onClick={() => setMinimized(true)} />
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
                                {/* HEADER */}
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between rounded-t-2xl ">
                                    <h2 className="text-xl font-bold text-white">Training Monitor</h2>
                                    <div className="flex gap-2">
                                        <MdMinimize onClick={() => setMinimized(true)} className="text-white cursor-pointer" />
                                        <IoClose onClick={handleClose} className="text-white cursor-pointer" />
                                    </div>
                                </div>

                                {/* BODY */}
                                <div className="p-6 space-y-6 overflow-y-auto">
                                    <TrainingStatusHeader
                                        inProgress={!isComplete}
                                        statusText={trainingStatusText()}
                                    />

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <TrainingBatches
                                            trainingImage={istate.trainingImage}
                                        
                                            status={status}
                                            fetchImage={fetchImage}
                                            openImageModal={openImageModal}
                                            fetchAllowed={fetchAllowed}
                                        />
                                        <ValidationMatrix
                                            task={task}
                                            rows={rows}
                                           
                                            status={status}
                                            fetchData={fetchData}
                                            fetchAllowed={fetchAllowed}
                                        />
                                    </div>

                                    <TrainingActions isComplete={isComplete} stoping={stoping} onStop={stopHandler} onProceed={handleProceed} />
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>

            {/* MINIMIZED */}
            {phase === "running" && minimized && (
                <motion.button
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMinimized(false)}
                    className={`fixed flex items-center justify-center gap-3 bottom-6 right-6 px-4 py-4 text-white rounded-xl shadow-lg
            ${isComplete ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'}
        `}
                >
                    <MdExpandMore className="text-2xl" />

                    <span className="font-semibold text-sm">
                        {isComplete ? 'Training Completed' : 'Training Running'}
                    </span>

                    {!isComplete ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                    ) : (
                        <span className="w-4 h-4 flex items-center justify-center rounded-full bg-white text-green-600 text-xs font-bold">
                            ✓
                        </span>
                    )}
                </motion.button>
            )}
        </>
    );
}

export default DataTransferModal;
