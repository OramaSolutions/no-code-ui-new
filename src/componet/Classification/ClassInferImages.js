import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { commomObj } from '../../utils';
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { ClassinferImages } from "../../reduxToolkit/Slices/classificationSlices";
import ClassInferResultModal from "./ClassInferResultModal";
import { getUrl } from '../../config/config';
const url = getUrl('classification')
const initialstate = {
    onOpen: false,
}

function ClassInferImages({ userData, state, onChange, onApply }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [prediction, setPrediction] = useState("1"); // Default to 1 prediction
    const [istate, updateIstate] = useState(initialstate);
    const { onOpen } = istate;
    const dispatch = useDispatch();

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
            // Reset only the modal state when new image is uploaded
            updateIstate({ ...initialstate });
        } else {
            setSelectedFile(null);
            setPreview(null);
            toast.error('Please select a valid image file (jpg, png, etc.)', commomObj);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
        maxFiles: 1
    });

    const saveHandler = async () => {
        if (!selectedFile) {
            toast.error('Please select an image first', commomObj);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("username", userData?.activeUser?.userName);
            formData.append("version", state?.version);
            formData.append("project", state?.name);
            formData.append("task", "classification");
            formData.append("image", selectedFile);
            formData.append("prediction", prediction); // Use current prediction value

            const response = await dispatch(ClassinferImages({ payload: formData, url }));
            if (response?.payload?.status === 200) {
                toast.success(response?.payload?.data?.message, commomObj);
                updateIstate({ ...istate, onOpen: true });
            } else {
                toast.error(response?.payload?.data?.message, commomObj);
            }
        } catch (error) {
            toast.error("Oops, something went wrong", commomObj);
            console.error("Error uploading file:", error);
        }
    }

    return (
        <div>
            <div className="Small-Wrapper">
                <h6 className="Remarks">Infer Images</h6>
                <div className="CommonForm">
                    <form>
                        <div className="form-group">
                            <label>Image</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Image name"
                                value={selectedFile ? selectedFile.name : ''}
                                readOnly
                            />
                        </div>
                        <div className="form-group text-center">
                            <label>OR</label>
                        </div>
                        <div className="form-group">
                            <div
                                {...getRootProps({ className: 'Upload Big' })}
                                style={{ border: '2px dashed gray', padding: '20px', textAlign: 'center' }}
                            >
                                <input {...getInputProps()} />
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        style={{ maxWidth: '100%', maxHeight: '200px', marginBottom: '10px' }}
                                    />
                                ) : (
                                    <span>
                                        <img src={require("../../assets/images/folder-open-big.png")} /> <br />
                                        Drag or browse from device
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Number of Top Predictions</label>
                            <div className="d-flex align-items-center justify-content-between" style={{ width: "50%" }}>
                                {[1, 2, 3, 4].map(num => (
                                    <label className="Radio" key={num}>
                                        {num < 10 ? `0${num}` : num}
                                        <input
                                            type="radio"
                                            className="form-control"
                                            name="prediction"
                                            checked={prediction === String(num)}
                                            onChange={() => setPrediction(String(num))}
                                        />
                                        <span className="checkmark" />
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-7 mx-auto">
                                <div className="TwoButtons">
                                    <a
                                        role="button"
                                        className="FillBtn"
                                        onClick={saveHandler}
                                        disabled={!selectedFile}
                                    >
                                        Start Inference
                                    </a>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <ClassInferResultModal
                onOpen={onOpen}
                prediction={prediction}
                setOutput={updateIstate}
                userData={userData}
                state={state}
                selectedFile={selectedFile}
                preview={preview}
                setPreview={setPreview}
                onChange={onChange}
                onApply={onApply}
            />
        </div>
    )
}
export default ClassInferImages