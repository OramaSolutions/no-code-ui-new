import React, { useEffect, useState, useRef } from 'react'
import Modal from 'react-bootstrap/Modal';
import { DataTransfer, StopDataTransfer, TrainingbatchApi } from '../../reduxToolkit/Slices/projectSlices';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../commonComponent/Loader';
import { getUrl } from '../../config/config';
import axios from 'axios';
import { toast } from 'react-toastify';
import { commomObj } from '../../utils';
import TrainingCompleted from './TrainingCompleted';
import Papa from "papaparse";
import { ClassStopDataTransfer } from '../../reduxToolkit/Slices/classificationSlices';
import { FaSpinner } from "react-icons/fa";


const initialstate = {
    openImage: false,
    trainingImage: "No image",
}

function DataTransferModal({ url, data, setData, apiresponse, setResponse, flag, setFlag, onApply, state, userData, task, taskId }) {
    // Polling state for training status
    const [pollStatus, setPollStatus] = useState({ status: '', progress: '', result: '', error: '' });
    // Track if polling is active
    const [pollingActive, setPollingActive] = useState(false);
    // Track if polling should be stopped (e.g. on failure)
    const [pollingStopped, setPollingStopped] = useState(false);
    const pollingStoppedRef = useRef(false);
    useEffect(() => {
        pollingStoppedRef.current = pollingStopped;
    }, [pollingStopped]);
    // Poll for training status when modal opens and taskId is available
    useEffect(() => {
        if (data.opentrainModal && taskId && !pollingActive) {
            setPollingActive(true);
            setPollingStopped(false);
            pollTrainingStatus(taskId);
            pollUntilImageExists();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.opentrainModal, taskId]);

    // Polling logic for training status
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
                        error: dataRes.error || ''
                    });
                    console.log("dataRes from polling", dataRes)
                    if (dataRes.progress === 'Training completed successfully') {
                        setData(prev => ({ ...prev, opentraincomplete: true, opentrainModal: true }));
                        setPollingActive(false);
                        setPollingStopped(true);
                        return; // Stop polling
                    }
                    if (dataRes.progress === 'Training failed') {
                        setPollStatus(prev => ({ ...prev, error: dataRes.error || 'Training Failed' }));
                        setPollingActive(false);
                        setPollingStopped(true);
                        return; // Stop polling
                    }
                }
                setTimeout(poll, 10000);
            } catch (err) {
                if (!pollingStoppedRef.current) setTimeout(poll, 10000);
            }
        };
        poll();
    };
    // useEffect(() => { console.log('pollingStopped', pollingStopped) }, [
    //     pollingStopped
    // ])

    // Polling logic for image existence
    const pollUntilImageExists = async () => {
        const pollUrl = `${url}train_batch_img_get?username=${userData?.activeUser?.userName}&task=${task}&project=${state?.name}&version=${state?.version}`;
        const poll = async () => {
            if (pollingStoppedRef.current) return;
            try {
                const res = await fetch(pollUrl);
                const dataRes = await res.json();
                if (dataRes.status === 'ok') {
                    setFlag(prev => !prev);
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
    const outputRef = useRef(null);
    const rowsRef = useRef(null);
    const [dots, setDots] = useState('');
    const dispatch = useDispatch()
    const [rows, setRows] = useState([]);
    const [istate, updateIstate] = useState(initialstate)
    const { openImage, trainingImage } = istate;
    const [showButtons, setShowButtons] = useState(false)
    const [showTerminal, setShowTerminal] = useState(false)
    const [status, setStatus] = useState({
        loadingImage: false,
        loadingMatrix: false,
        errorImage: '',
        errorMatrix: ''
    })

    useEffect(() => {
        const blink = () => {
            setDots((prevDots) => (prevDots.length < 3 ? prevDots + '.' : ''));
        };
        const interval = setInterval(blink, 500);
        return () => clearInterval(interval);
    }, []);



    const handleclose = () => {
        setData({ ...data, opentrainModal: false })
        setResponse("")
        setFlag(false)
        setPollingStopped(true);
    }
    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [apiresponse]);

    useEffect(() => {




        if (flag) {

            setShowButtons(true)
        }
    }, [flag])



    const fetchData = async () => {
        setStatus(prev => ({ ...prev, loadingMatrix: true, errorMatrix: '' }));
        try {
            let apiendpoint = task === "classification" ? "val_matrix_cls" : "val_matrix";
            const response = await fetch(`${url}${apiendpoint}?username=${userData?.activeUser?.userName}&task=${task}&project=${state?.name}&version=${state?.version}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (task === "classification") {
                if (data.per_class_accuracy && Array.isArray(data.per_class_accuracy)) {
                    const parsedRows = data.per_class_accuracy.map(line => {
                        // Example: "Class: hf | Accuracy: 100.00% | Total: 3 | Correct: 3"
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
            } else if (task === "objectdetection") {
                if (data.matrix && typeof data.matrix === 'object') {
                    const parsedRows = Object.entries(data.matrix).map(([className, metrics]) => ({
                        className,
                        precision: metrics.P ? (parseFloat(metrics.P) * 100).toFixed(2) : '',
                        recall: metrics.R ? (parseFloat(metrics.R) * 100).toFixed(2) : '',
                        accuracy: metrics.Acc !== undefined ? (parseFloat(metrics.Acc)).toFixed(2) : '',
                    }));
                    setRows(parsedRows);
                } else {
                    setRows([]);
                }
            } else {
                setRows([]);
            }
            setStatus(prev => ({ ...prev, loadingMatrix: false }));
        } catch (error) {
            setStatus(prev => ({ ...prev, loadingMatrix: false, errorMatrix: error.message || 'Error fetching validation matrix, try again after a few seconds' }));
            console.error("Error parsing validation matrix:", error);
        }
    }

    // Move fetchImage outside useEffect so it can be called from button
    const fetchImage = async () => {
        setStatus(prev => ({ ...prev, loadingImage: true, errorImage: '' }));
        try {
            const payload = {
                username: userData?.activeUser?.userName,
                version: state?.version,
                project: state?.name,
                task: task,
            }
            const response = await dispatch(TrainingbatchApi({
                payload, url
            }))
            if (response?.payload?.image_base64 || response?.payload?.image) {
                updateIstate({ ...istate, trainingImage: response?.payload?.image })
            } else {
                updateIstate({ ...istate, trainingImage: "No image" })
            }
            setStatus(prev => ({ ...prev, loadingImage: false }));
        } catch (error) {
            setStatus(prev => ({ ...prev, loadingImage: false, errorImage: error.message || 'Error fetching image, try again after a few seconds.' }));
        }
    }

    useEffect(() => {
        if (rowsRef.current) {
            rowsRef.current.scrollTop = rowsRef.current.scrollHeight;
        }
    }, [rows]);

    const stopHandler = async () => {
        try {
            const formData = new FormData();
            formData.append("username", userData?.activeUser?.userName);
            formData.append("version", state?.version);
            formData.append("project", state?.name);
            formData.append("task", task);
            const res = task == "objectdetection" ? await dispatch(StopDataTransfer({ payload: formData, url })) :
                await dispatch(ClassStopDataTransfer({ payload: formData, url }))
            console.log(res, "response of StopDataTransfer")
            if (res?.payload?.status === 200) {
                handleclose()
                updateIstate(initialstate)
                toast.success(res?.payload?.data.message, commomObj)
                onApply();
            }
        } catch (err) {
            console.log(err, "error")
        }
    }

    const openImageModal = (base64Image) => {
        const newWindow = window.open();
        if (newWindow) {
            newWindow.document.write(`
                <img src="data:image/png;base64,${base64Image}" style="max-width:100%; height:auto;" alt="Training Image" />
            `);
            newWindow.document.title = "Training Image";
        }
    };

    const handleProceed = () => {
        setData({ ...data, opentraincomplete: false, opentrainModal: false });
        setResponse("");
        setFlag(false);
        onApply();
        setPollStatus({ status: '', progress: '', result: '', error: '' })
        setPollingActive(false);
        setPollingStopped(true);
    };
    const inProgress = !data?.opentraincomplete && !pollingStopped;
    return (
        <>
            <Modal
                show={data.opentrainModal}
                className="ModalBox LargeModal"
            >
                <Modal.Body>
                    <div className="relative pb-0">
                        <div className="w-full rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-2 shadow-sm">
                            <div className="flex  justify-center ">
                                <div className='flex gap-4'>
                                    {inProgress ? (
                                        <FaSpinner className="animate-spin text-blue-800 mt-0.5" />
                                    ) : (
                                        pollingStopped && pollStatus.error ? (
                                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 mt-0.5">
                                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                        ) : (
                                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mt-0.5">
                                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h5 className="text-base font-semibold text-gray-900">
                                                {inProgress ? "Training in progress..." : pollingStopped && pollStatus.error ? "Training failed" : "Training complete"}
                                            </h5>
                                        </div>
                                        {inProgress && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                Please be patient, this may take some time.
                                            </p>
                                        )}
                                        {pollingStopped && pollStatus.error && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {pollStatus.error}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {inProgress && pollStatus && (
                                <div className="mt-2 rounded-lg bg-white p-4 shadow-xs border border-gray-100">
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <dt className="font-medium text-gray-500 text-xs uppercase tracking-wide">Status</dt>
                                            <dd className="text-gray-900 font-medium mt-1 capitalize">{pollStatus.status}</dd>
                                        </div>
                                        <div>
                                            <dt className="font-medium text-gray-500 text-xs uppercase tracking-wide">Progress</dt>
                                            <dd className="text-gray-900 font-medium mt-1 capitalize">{pollStatus.progress}</dd>
                                        </div>
                                        <div className="col-span-3 space-y-3 pt-2">
                                            {pollStatus.result && (
                                                <div>
                                                    <dt className="font-medium text-gray-500 text-xs uppercase tracking-wide">Result</dt>
                                                    <dd className="text-gray-900 mt-1 capitalize">{pollStatus.result}</dd>
                                                </div>
                                            )}
                                            {pollStatus.error && (
                                                <div>
                                                    <dt className="font-medium text-red-500 text-xs uppercase tracking-wide">Error</dt>
                                                    <dd className="text-red-600 mt-1 capitalize">{pollStatus.error}</dd>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="row pb-8">
                            <div className="col-lg-6 mt-4">
                                <div className='DataPreviewAugmentLeftNew'><h6>Training Batches</h6></div>
                                <div
                                    className="DataPreviewAugmentLeft"
                                    style={{ borderRight: "1px solid #000", minHeight: '258px', maxHeight: '220px' }}
                                >

                                    <ul>
                                        {trainingImage ? trainingImage == "No image" ? (
                                            <div className='flex flex-col '>
                                                <p>Waiting...</p>
                                                {
                                                    showButtons && <>
                                                        <button className="w-fit bg-blue-500 px-4 py-2 rounded-md text-white" onClick={fetchImage} style={{ marginTop: '10px' }}>Fetch Image</button>
                                                        {status.loadingImage && <div className="text-blue-500 mt-2">Loading image...</div>}
                                                        {status.errorImage && <div className="text-red-500 mt-2">{status.errorImage}</div>}
                                                    </>
                                                }
                                            </div>
                                        ) :
                                            <figure>
                                                <img src={`data:image/png;base64,${trainingImage}`} width={400} height={150} onClick={() => openImageModal(trainingImage)} />
                                            </figure> : <Loader item="200px" />}
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="ValidationTableNew">
                                    <div className='flex justify-between items-center my-4'>
                                        <h6>Validation Matrix</h6>
                                        {showButtons && <>
                                            <button className="w-fit bg-blue-500 px-4 py-2 rounded-md text-white" onClick={fetchData} style={{ marginTop: '10px' }}>Fetch Data</button>
                                            {status.loadingMatrix && <div className="text-blue-500 mt-2">Loading validation matrix...</div>}
                                            {status.errorMatrix && <div className="text-red-500 mt-2">{status.errorMatrix}</div>}
                                        </>
                                        }

                                    </div>
                                    <table>
                                        <thead>
                                            {task == "classification" ?
                                                <tr>
                                                    <th />
                                                    <th >
                                                        Class
                                                    </th>
                                                    <th >
                                                        Accuracy (%)
                                                    </th>
                                                    {/* <th style={{ minWidth: '92px' }}>
                                                        Top 5
                                                        (%)
                                                    </th> */}
                                                </tr> :
                                                <tr>
                                                    <th style={{ minWidth: '92px' }} />
                                                    <th style={{ minWidth: '92px' }}>
                                                        Precision
                                                        (%)
                                                    </th>
                                                    <th style={{ minWidth: '92px' }}>
                                                        Recall
                                                        (%)
                                                    </th>
                                                    <th style={{ minWidth: '92px' }}>
                                                        Accuracy
                                                        (%)
                                                    </th>
                                                </tr>
                                            }
                                        </thead>
                                    </table>
                                </div>
                                <div className="ValidationTable" ref={rowsRef} >
                                    <table>
                                        <tbody>
                                            {rows?.length > 0 ? rows.map((row, index) => {
                                                if (task === 'classification') {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{row.Class}</td>
                                                            <td>{row.Accuracy}%</td>
                                                        </tr>
                                                    );
                                                } else if (task === 'objectdetection') {
                                                    return (
                                                        <tr key={index}>
                                                            <td style={{ minWidth: '92px' }}>{row.className}</td>
                                                            <td style={{ minWidth: '92px' }}>{row.precision}</td>
                                                            <td style={{ minWidth: '92px' }}>{row.recall}</td>
                                                            <td style={{ minWidth: '92px' }}>{row.accuracy}</td>
                                                        </tr>
                                                    );
                                                } else {
                                                    return null;
                                                }
                                            }) : (
                                                <tr>
                                                    <td colSpan={task === 'objectdetection' ? 4 : 2} className='text-center'>
                                                        <Loader />
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {!data.opentraincomplete && <div className="col-lg-4 mx-auto mt-3">
                                <a className="Button" role='button' onClick={stopHandler}>
                                    Stop
                                </a>
                            </div>}
                        </div>
                        {data.opentraincomplete &&
                            <div className="text-center  mt-4 absolute bottom-0 flex justify-between items-center w-full">
                                <div className=" flex gap-5 flex-row justify-center items-center">
                                    <span className="b"><i className="fa fa-check" aria-hidden="true"></i></span>
                                    <h4 className='mt-2'>Training has been completed....proceed further</h4>

                                </div>

                                <br />
                                <button className="bg-green-500 rounded-md w-fit text-white text-xl px-3 py-1" onClick={handleProceed}>Proceed Further</button>
                            </div>
                        }
                    </div>


                </Modal.Body>
            </Modal>
            {/* <TrainingCompleted
                onApply={onApply}
                data={data}
                setData={setData}
            /> */}
        </>
    )
}

export default DataTransferModal
