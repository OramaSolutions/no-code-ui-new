import React, { useState, useCallback, useEffect, useRef } from "react";
import { toast } from 'react-toastify';
import { useDropzone } from "react-dropzone";
import { commomObj } from '../../utils';
import Loader from '../../commonComponent/Loader';
import { useDispatch } from "react-redux";
import { ResizeFolder } from "../../reduxToolkit/Slices/projectSlices";
import ResizeModal from "../Project/ResizeModal";
import ImportModal from "../Project/ImportModal";
import { ClassResizeFolder, importClassData } from "../../reduxToolkit/Slices/classificationSlices";
import { getUrl } from '../../config/config';
const url = getUrl('classification')


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

function Classlabelled({ iState, updateIstate, userData, state, onApply, onChange }) {
    const [istate, setIstate] = useState(initialState)
    const { imageUrls, imageFolder, loading, resizecheck, width, open, close, openImport, closeImport } = istate;
    const [selectedFile, setSelectedFile] = useState(null);
    const abortControllerReff = useRef();
    const [isDirty, setIsDirty] = useState("")
    const [loadingData, setLoadingData] = useState(false)
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAndSaveStreamingZip = async () => {
            try {
                setLoadingData(true)
                const response = await fetch(`${url}return_import_dataset_cls?username=${userData?.activeUser?.userName}&task=classification&project=${state?.name}&version=${state?.version}`, {
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
                setLoadingData(false)
            } catch (err) {
                console.log(err, "errrrrr")
                setLoadingData(false)
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
        // const worker = new Worker(new URL("Zipworker.js", import.meta.url));
        setIstate({ ...istate, imageFolder: imageFolder, imageUrls: [], loading: true });
        worker.onmessage = (event) => {
            const { imageUrls, imageFolder } = event.data;
            setIstate({ ...istate, imageFolder: imageFolder, imageUrls: imageUrls, loading: false });
            worker.terminate();
        };

        worker.postMessage({ file });
    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ".zip",
        multiple: false,

    });
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
        formData.append("username", userData?.activeUser?.userName);
        formData.append("version", state?.version);
        formData.append("project", state?.name);
        formData.append("width", width);
        formData.append("task", "classification");
        try {
            abortControllerReff.current = new AbortController();
            setIstate({ ...istate, open: true });
            const response = await dispatch(ResizeFolder({ payload: formData, signal: abortControllerReff.current.signal, url }))
            if (response?.payload?.code === 200) {
                toast.success("Resize Successfully", commomObj)
                setIstate({ ...istate, open: true, close: true })
            } else {
                setIstate({ ...istate, open: true, close: false })
            }
        } catch (error) {
            console.log("error===>", error);
            if (error.name === 'AbortError') {
                setIstate({ ...istate, open: false, close: null })
            } else {
                console.error("Error uploading file:", error);
                setIstate({ ...istate, open: true, close: false })
            }


        }
    };
    const inputHandler = (e) => {
        const { name, value, checked } = e.target
        if (name == "resizecheck") {
            setIstate({ ...istate, resizecheck: checked ? true : false })
        } else {
            setIstate({ ...istate, [name]: value })
        }
    }
    const importUpload = async () => {
        if (isDirty == selectedFile?.name) {
            const datasize = {
                Size: imageUrls.length,
                image: imageUrls?.[0]
            }
            window.localStorage.setItem("ClassDataSize", JSON.stringify(datasize))
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
        formData.append("project", state?.name);
        formData.append("task", "classification");


        try {
            abortControllerReff.current = new AbortController();
            setIstate({ ...istate, openImport: true })
            const response = await dispatch(importClassData({ payload: formData, signal: abortControllerReff.current.signal, url }))
            console.log("Response From Class Dataset Import", response);
            if (response?.payload?.status === 201) {
                setIstate({ ...istate, openImport: false })
                toast.success("Import Successfully", commomObj)
                const datasize = {
                    Size: imageUrls.length,
                    image: imageUrls?.[0]
                }
                window.localStorage.setItem("ClassDataSize", JSON.stringify(datasize))
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
        if (abortControllerReff?.current) {
            abortControllerReff?.current?.abort();
            console.log('Resize operation aborted');
        }
    };

    if (loadingData) {
        return <div className="Small-Wrapper"><Loader /></div>;
    }

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
                                            title="Add the required folder structure: xyz.zip -> xyz -> images and labels. Label folder must contain classes.txt."
                                        >
                                            <img src={require("../../assets/images/esclamination.png")} />
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
                                <img src={require("../../assets/images/folder-open-big.png")} alt="Upload" /> <br />
                                Drag or browse from device
                            </span>
                        </div>
                        <div className="form-group">
                            <div className="Checkboxs">
                                <label className="CheckBox">
                                    {" "}
                                    Resize the images to a much smaller size to speed up inference.
                                    (around width of 500 pixels).{" "}
                                    <span
                                        className="EsclamSpan"
                                        data-toggle="tooltip"
                                        title="Resize the dataset to a set width and download for labelling"
                                    >
                                        <img src={require("../../assets/images/esclamination.png")} />
                                    </span>
                                    <input
                                        type="checkbox"
                                        name="resizecheck"
                                        value={resizecheck}
                                        checked={resizecheck}
                                        onChange={inputHandler}
                                    />
                                    <span className="checkmark" />
                                </label>
                            </div>
                        </div>
                        {resizecheck ? <>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-group ShowInput">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Enter size"
                                            name="width"
                                            value={width}
                                            onWheel={(e) => e.target.blur()}
                                            onChange={inputHandler}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-4 mx-auto">
                                    <div className="TwoButtons">
                                        {/* <a
                                    role="button"
                                    className="OutlineBtn">
                                    Cancel
                                </a> */}
                                        <a
                                            role="button"
                                            className="FillBtn ImportDataBtn"
                                            onClick={handleUpload}
                                        >
                                            Resize Dataset
                                        </a>
                                    </div>
                                </div>
                            </div></> : <>
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
                                        {/* <a
                                    role="button"
                                    className="OutlineBtn">
                                    Cancel
                                </a> */}
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
                        </>}
                    </form>
                </div>
            </div>
            <ResizeModal
                onOpen={open}
                onClose={close}
                istate={istate}
                setIstate={setIstate}
                setSelectedFile={setSelectedFile}
                handleCancel={handleCancel}
                userData={userData}
                state={state}
                task="classification"
            />
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

export default Classlabelled
