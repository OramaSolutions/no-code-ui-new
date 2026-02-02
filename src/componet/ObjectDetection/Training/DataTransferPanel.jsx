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

function DataTransferPanel({
    url,
    step,
    onComplete,
    onFail,
    state,
    username,
    task,
    onApply,
}) {
    const dispatch = useDispatch();
    const isRunning = step === "running";
    const isCompleted = step === "completed";
    const canPoll = step === "monitor";

    const [istate, updateIstate] = useState(initialstate);
    const [rows, setRows] = useState([]);


    const [fetchAllowed, setFetchAllowed] = useState(false);

    useEffect(() => {
        if (!canPoll) return;

        const t = setTimeout(() => setFetchAllowed(true), 30000);
        return () => clearTimeout(t);
    }, [canPoll]);


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
        if (!canPoll) return;

        pollRef.current = setInterval(async () => {
            try {
                const res = await fetch(
                    `${url}training_status?username=${username}&task=${task}&project=${state?.name}&version=${state?.version}`
                );
                const result = await res.json();

                if (result.status === "completed") {
                    clearInterval(pollRef.current);

                    onComplete();
                }

                if (result.status === "failed") {
                    clearInterval(pollRef.current);
                    onFail();
                }
            } catch (e) {
                console.error(e);
            }
        }, 10000);

        return () => clearInterval(pollRef.current);
    }, [canPoll]);



    /* ---------- STATUS TEXT (UI ONLY) ---------- */
    const trainingStatusText = () => {
        if (step === "running") return "Training is starting...";
        if (step === "monitor") return "Training running on our Pod...";
        if (step === "completed") return "Training completed successfully.";
        return "Waiting for training to start.";
    };
    /* ---------- FETCH VALIDATION MATRIX ---------- */
    const fetchData = async () => {
        if (!fetchAllowed) {
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
        if (!fetchAllowed) {
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

    /* ---------- STOP TRAINING ---------- */
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

            setFetchAllowed(false);


            onFail();
        } catch (error) {
            alert("Error stopping training!");
            setStoping(false);
        }
    };

    const handleClose = () => {
        clearInterval(pollRef.current);

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

        setFetchAllowed(false);

        onApply();
    };

    const inProgress = true; // training assumed running

    return (
        <>

            <motion.div className=" rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">

                {/* BODY */}
                <div className=" p-6 space-y-6 overflow-y-auto">
                    <TrainingStatusHeader
                        statusText={trainingStatusText()}
                        step={step}
                        stoping={stoping} 
                        onStop={stopHandler} 
                        onProceed={handleProceed}
                    />

                    {
                        (canPoll || isCompleted ) && <div className="grid grid-cols-1  gap-6">
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
                    }


                    {/* {
                        (isRunning || canPoll || isCompleted) && <TrainingActions isComplete={isCompleted} stoping={stoping} onStop={stopHandler} onProceed={handleProceed} />
                    } */}
                </div>
            </motion.div>



        </>
    );
}

export default DataTransferPanel;
