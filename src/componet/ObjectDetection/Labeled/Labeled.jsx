import React, { useState, useCallback, useEffect, useRef } from "react";
import { toast } from 'react-toastify';
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { ResizeFolder, importData } from "../../../reduxToolkit/Slices/projectSlices";
import { commomObj } from '../../../utils';
import { useNavigate } from "react-router-dom";
import FileUploadZone from "./FileUploadZone";
import ResizeOptions from "./ResizeOptions";
import ImagePreview from "./ImagePreview";
import ActionButtons from "./ActionButtons";
import ResizeModal from "../ResizeModal";
import ImportModal from "./ImportModal";
import { LuFileStack } from "react-icons/lu";
const initialState = {
    imageUrls: [],
    imageFolder: null,
    loading: false,
    resizecheck: false,
    width: null,
    open: false,
    close: null,
    openImport: false,
    closeImport: false,
    importError:''
}

function Labelled({ username, state, onApply, onChange, url }) {
    const [istate, setIstate] = useState(initialState)
    const { imageUrls, imageFolder, loading, resizecheck, width, open, close, openImport, closeImport } = istate;
    const [isDirty, setIsDirty] = useState("")
    const [selectedFile, setSelectedFile] = useState(null);
    const [postImportActionsVisible, setPostImportActionsVisible] = useState(false);
    const abortControllerReff = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const backLink = "object-detection-training";

    useEffect(() => {
        const fetchThumbnails = async () => {
            console.log('Fetching dataset thumbnails...');
            try {
                const response = await fetch(
                    `${url}get_thumbnails?username=${username}&task=objectdetection&project=${state?.name}&version=${state?.version}&thumbnail_name=dataset_thumbnails`,
                    { method: 'GET' }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Thumbnails API response:", data);

                if (data?.thumbnails && data.thumbnails.length > 0 && data.count) {
                    // Save count in localStorage
                    window.localStorage.setItem("DataSize", JSON.stringify({ Size: data.count }));

                    setIstate(prev => ({
                        ...prev,
                        imageUrls: data.thumbnails
                    }));
                    setPostImportActionsVisible(true)
                    console.log(`Found ${data.count} thumbnails`);
                } else {
                    console.log("No thumbnails found.");
                }

            } catch (err) {
                console.error("Error fetching thumbnails:", err);
            }
        };

        fetchThumbnails();
    }, [url, username, state?.name, state?.version]);


    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];

        if (!file) {
            toast.error("No file selected. Please select a ZIP file", commomObj);
            return;
        }

        if (file.type === "application/zip" || /\.zip$/i.test(file.name)) {
            setSelectedFile(file);
            processZipFileInWorker(file);
        } else {
            toast.error("Please select a ZIP file", commomObj);
        }
    }, []);

    const processZipFileInWorker = (file) => {
        const worker = new Worker('/Zipworker.js');

        setIstate((prev) => ({ ...prev, imageFolder: imageFolder, imageUrls: [], loading: true }));

        worker.onmessage = (event) => {
            const { imageUrls, imageFolder } = event.data;
            setIstate(prev => ({ ...prev, imageFolder, imageUrls, loading: false }));
            worker.terminate();
        };

        worker.postMessage({ file });
    };

    // useless 
    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("Please select a Zip file first", commomObj);
            return;
        }
        if (!width) {
            toast.error("Please select the size", commomObj);
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("username", username);
        formData.append("version", state?.version);
        formData.append("project", state?.name);
        formData.append("width", width);
        formData.append("task", "objectdetection");

        try {
            abortControllerReff.current = new AbortController();
            setIstate({ ...istate, open: true });
            const response = await dispatch(ResizeFolder({ formData, signal: abortControllerReff.current.signal, url }))
            console.log("File responseeeeeeeeee", response);
            if (response?.payload?.code === 200) {
                toast.success("Resize Successfully", commomObj)
                setIstate({ ...istate, open: true, close: true })
            } else {
                setIstate({ ...istate, open: true, close: false })
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                setIstate(prev => ({ ...prev, open: false, close: null }));
            } else {
                console.error("Error uploading file:", error);
                setIstate(prev => ({ ...prev, open: true, close: false }));
            }
        }
    };

    // upload
    const importUpload = async () => {
        if (isDirty === selectedFile.name) {
            const datasize = {
                Size: imageUrls.length,

            }

            // window.localStorage.setItem("DataSize", JSON.stringify(datasize))

            onApply()
            return;
        }
        if (!selectedFile) {
            toast.error("Please select a Zip file first", commomObj);
            return;
        }
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("username", username);
        formData.append("version", state?.version);
        formData.append("project", state?.name);
        formData.append("task", "objectdetection");
        try {
            abortControllerReff.current = new AbortController();
            setIstate({ ...istate, openImport: true })

            const response = await dispatch(importData({ payload: formData, signal: abortControllerReff.current.signal, url }))
//  console.log('response', response)
            if (response?.payload?.status === 201) {
                setIstate({ ...istate, openImport: false })
                toast.success("Import Successfully", commomObj)
                const datasize = {
                    Size: response?.payload?.data?.image_count,
                }
               

                window.localStorage.setItem("DataSize", JSON.stringify(datasize))
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });

                // Show post-import actions (view or label) instead of immediately proceeding
                setPostImportActionsVisible(true);
                setSelectedFile(null)
                // Let parent know data changed when user chooses an action (handled on button click)

            } else {
                setIstate({ ...istate, openImport: true, closeImport: true, importError:response.payload?.message||"Somethign went wrong!" });
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                setIstate({ ...istate, openImport: true, closeImport: false });
            } else {
                console.error("Error uploading file:", error);
                setIstate({ ...istate, openImport: true, closeImport: true });
            }
        }
    };

    const handleCancel = () => {
        if (abortControllerRef?.current) {
            abortControllerRef.current.abort();
        }
    };

    const inputHandler = (e) => {
        const { name, value, checked } = e.target;
        if (name === "resizecheck") {
            setIstate(prev => ({ ...prev, resizecheck: checked }));
        } else {
            setIstate(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleLabelDataset = () => {
        console.log("Navigating to label dataset...", backLink, state);
        navigate(
            `/dataset-overview/${backLink}/${state.projectId}/${state.name}/${state.version}`
        )
    }

    const handleViewDataset = () => {
        // inform parent and navigate to dataset overview
        onChange && onChange();
        onApply && onApply();
        setPostImportActionsVisible(false);
        navigate(`/dataset-overview/${backLink}/${state.projectId}/${state.name}/${state.version}`);
    }

    const handleStartLabeling = () => {
        // inform parent and navigate to labeling start (first image)
        onChange && onChange();
        onApply && onApply();
        setPostImportActionsVisible(false);
        navigate(`/image-label/${backLink}/${state.projectId}/${state.name}/${state.version}/image/1`);
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
            >
                {/* Header Section */}
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Import Dataset</h2>
                        <p className="text-sm text-slate-600">Upload your labeled images (ZIP format, up to 2GB)</p>
                    </div>
                </div>
                {postImportActionsVisible ? (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-green-800">Import successful</h4>
                                <p className="text-xs text-slate-600">Your dataset was imported. Choose an action to continue.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleViewDataset}
                                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded shadow-sm hover:bg-slate-50"
                            >
                                View Dataset
                            </button>
                            <button
                                onClick={handleStartLabeling}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                Start Labeling
                            </button>
                            <button
                                onClick={() => setPostImportActionsVisible(false)}
                                className="px-3 py-2 bg-transparent text-slate-500 rounded hover:bg-slate-100"
                                aria-label="Dismiss"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ) : null}
                {/* File Name Display */}
                {selectedFile && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl"
                    >
                        <LuFileStack className="text-blue-600 w-6" />
                        <span className="flex-1 font-medium text-slate-700">{selectedFile.name}</span>
                        <span className="text-xs text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                    </motion.div>
                )}

                {/* File Upload Zone */}
                <FileUploadZone onDrop={onDrop} />

                {/* Resize Options */}
                {/* <ResizeOptions
                    resizecheck={resizecheck}
                    width={width}
                    inputHandler={inputHandler}
                    handleUpload={handleUpload}
                /> */}

                {/* Image Preview & Import */}
                {!resizecheck && (
                    <>
                        <ImagePreview imageUrls={imageUrls} loading={loading} />
                        <ActionButtons onImport={importUpload} />
                    </>
                )}

                {/* Modals */}
                <ResizeModal
                    onOpen={open}
                    onClose={close}
                    istate={istate}
                    setIstate={setIstate}
                    setSelectedFile={setSelectedFile}
                    handleCancel={handleCancel}
                    username={username}
                    state={state}
                    task="objectdetection"
                    url={url}
                />
                {/* <ImportModal
                onOpen={openImport}
                onClose={closeImport}
                istate={istate}
                setIstate={setIstate}
                handleCancel={handleCancel}
            /> */}
            </motion.div>
            <ImportModal
                onOpen={openImport}
                onClose={closeImport}
                istate={istate}
                setIstate={setIstate}
                handleCancel={handleCancel}
            />


        </>
    );
}

export default Labelled;
