import React, { useState, useCallback, useEffect, useRef } from "react";
import { toast } from 'react-toastify';
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { ResizeFolder, importData } from "../../../reduxToolkit/Slices/projectSlices";
import { commomObj } from '../../../utils';
import FileUploadZone from "./FileUploadZone";

import ImagePreview from "./ImagePreview";
import ActionButtons from "./ActionButtons";

import ImportModal from "../../Project/ImportModal";
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
}

function Labelled({ username, state, onApply, onChange, url }) {
    const [istate, setIstate] = useState(initialState)
    const { imageUrls, imageFolder, loading, resizecheck, width, open, close, openImport, closeImport } = istate;
    const [isDirty, setIsDirty] = useState("")
    const [selectedFile, setSelectedFile] = useState(null);
    const abortControllerReff = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchThumbnails = async () => {
            console.log('Fetching dataset thumbnails...');
            try {
                console.log('fetching thumbnails from server...');
                const response = await fetch(`${url}get_import_dataset?username=${username}&task=defectdetection&project_name=${state?.name}&version=${state?.version}`, {
                    method: 'GET',
                });
                console.log(response, "responseeee")
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const filename = response.headers.get('x-filename') || 'default_filename.zip';
                const reader = response.body.getReader();
                const chunks = [];
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    chunks.push(value);
                }
                const zipBlob = new Blob(chunks, { type: 'application/zip' });
                const dummyData = new File([zipBlob], filename, { type: 'application/zip' });
                setIsDirty(filename)
                setSelectedFile(dummyData);
                processZipFileInWorker(dummyData);
            } catch (err) {
                console.log(err, "errrrrr")
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
        formData.append("task", "defectdetection");

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
        formData.append("task", "defectdetection");
        try {
            abortControllerReff.current = new AbortController();
            setIstate({ ...istate, openImport: true })

            const response = await dispatch(importData({ payload: formData, signal: abortControllerReff.current.signal, url }))

            if (response?.payload?.status === 201) {
                setIstate({ ...istate, openImport: false })
                toast.success("Import Successfully", commomObj)
                const datasize = {
                    Size: response?.payload?.data?.image_count,

                }

                window.localStorage.setItem("DataSize", JSON.stringify(datasize))

                onChange();
                onApply()

            } else {
                setIstate({ ...istate, openImport: true, closeImport: true });
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
