import React, { useState, useCallback, useEffect, useRef } from "react";
import { toast } from 'react-toastify';
import { useDropzone } from "react-dropzone";
import { commomObj } from '../../utils';
import Loader from '../../commonComponent/Loader';
import { useDispatch } from "react-redux";
import { ResizeFolder, importData } from "../../reduxToolkit/Slices/projectSlices";
import ResizeModal from "../Project/ResizeModal";
import ImportModal from "../Project/ImportModal";
import {  importClassData } from "../../reduxToolkit/Slices/classificationSlices";
import {  getUrl } from '../../config/config';

const url = getUrl('defectdetection')


const initialState = {
    imageUrls: [],
    imageFolder: null,
    loading: false,
    openImport: false,
    closeImport: false,
}

function Defectlabelled({ iState, updateIstate, userData, state, onApply, onChange }) {
    const [istate, setIstate] = useState(initialState)
    const { imageUrls, imageFolder, loading, openImport, closeImport } = istate;
    const [selectedFile, setSelectedFile] = useState(null);
    const abortControllerReff = useRef();
    const [isDirty, setIsDirty] = useState("")
    const dispatch = useDispatch();
    console.log(istate,"ISATE OF LABEL")

    useEffect(() => {
        const fetchAndSaveStreamingZip = async () => {
            try {
                
                const response = await fetch(`${url}get_import_dataset?username=${userData?.activeUser?.userName}&task=defectdetection&project_name=${state?.name}&version=${state?.version}`, {
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
        }
        fetchAndSaveStreamingZip();
    }, [])

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) {
            toast.error("No file selected. Please select a ZIP file", commomObj);
            return;
        }
        if (file.type === "application/zip" || /\.zip$/i.test(file.name)) {

            const dummyData = file
            console.log(dummyData, "dummyData")
            setSelectedFile(dummyData);
            processZipFileInWorker(dummyData);
        } else {
            toast.error("Please select a ZIP file", commomObj);
        }
    }, [])
    const processZipFileInWorker = (file) => {
        const worker = new Worker('/Zipworker.js');
        // const worker = new Worker(new URL("Zipworker.js", import.meta.url));//we are creating the worker
        setIstate({ ...istate, imageFolder: imageFolder, imageUrls: [], loading: true });//here while creating till then show loading in ui
        worker.onmessage = (event) => { //it's the result providing by worker and setting it up to our state
            const { imageUrls, imageFolder } = event.data;
            setIstate({ ...istate, imageFolder: imageFolder, imageUrls: imageUrls, loading: false });
            worker.terminate();// after listening and update the state just terminating the worker
        };
        worker.postMessage({ file: file, showAll: true }); //send file and other argument acc. to our need to worker
        // worker.postMessage({ file });
    };  
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ".zip",
        multiple: false,

    });

    const importUpload = async () => {
        if (isDirty == selectedFile.name) {
            onApply()
            return;
        }
        if (!selectedFile) {
            toast.error("Please select a Zip file first", commomObj);
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("username", userData?.activeUser?.userName);
        formData.append("version", state?.version);
        formData.append("project_name", state?.name);
        formData.append("task", "defectdetection");

        try {
            abortControllerReff.current = new AbortController();
            setIstate({ ...istate, openImport: true })
            const response = await dispatch(importData({ payload:formData, signal: abortControllerReff.current.signal, url }))
            console.log(response, "response of defect")
            if (response?.payload?.status === 201) {
                setIstate({ ...istate, openImport: false })
                toast.success("Import Successfully", commomObj)
                onChange();
                onApply()

            } else {
                setIstate({ ...istate, openImport: true, closeImport: true });
                toast.error(response?.payload?.data?.message, commomObj);
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
        if (abortControllerReff?.current) {
            abortControllerReff?.current?.abort();
            console.log('Resize operation aborted');
        }
    };
    return (
        <div>
            <div className="Small-Wrapper">
                <h6 className="Remarks">Import Dataset</h6>
                <div className="CommonForm">
                    <form>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="form-group">
                                    <label>Labelled Data(Upload Zip File upto 2GB):{" "}
                                        <span
                                            className="EsclamSpan"
                                            data-toggle="tooltip"
                                            title="1.Create a folder named anything you like(e.g.,xyz
                                            2.inside that folder,create two subfolders:
                                            ->One named good
                                            ->One named bad
                                            3. Put the images of good items inside the good folder
                                            4. Put the images of bad items inside the bad floder
                                            5.Compress the main folde(xyz)into a .zip file"
                                        >
                                            {/* <img src={require("../../assets/images/esclamination.png")} /> */}
                                        </span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="folder name"
                                        value={selectedFile ? selectedFile.name : ""}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            {...getRootProps({
                                className: `form-group Upload Big ${isDragActive ? "drag-active" : ""}`,
                            })}
                            style={{ position: 'relative', border: '1px dashed #ddd', padding: '20px', textAlign: 'center' }}
                        >
                            <input {...getInputProps()} style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                            <span>
                                {/* <img src={require("../../assets/images/folder-open-big.png")} alt="Upload" /> <br /> */}
                                Drag or browse from device
                            </span>
                        </div>
                        <div className="FolderImageShow">
                            <h6 className="Remarks">Images</h6>
                            <div className="PreviewImagesArea">
                                <h6>Preview Images</h6>
                                {loading ?
                                    <Loader /> :
                                    <ul>
                                        {imageUrls?.length > 0 && imageUrls?.slice(0, 15)?.map((url, index) => (
                                            <li>
                                                <figure>
                                                    <img key={index} src={url} alt={`Preview ${index}`} />
                                                </figure>
                                            </li>
                                        ))}
                                    </ul>}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 mx-auto">
                                <div className="TwoButtons">                                 
                                    <a
                                        className="FillBtn"
                                        role="button"
                                        onClick={() => importUpload()}
                                    >
                                        Import Data
                                    </a>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <ImportModal
                onOpen={openImport}
                onClose={closeImport}
                istate={istate}
                setIstate={setIstate}
                handleCancel={handleCancel}
            />
        </div>
    )
}

export default Defectlabelled

