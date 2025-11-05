import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { commomObj } from '../../utils';
import { toast } from 'react-toastify';
import { inferImages } from "../../reduxToolkit/Slices/projectSlices";
import { useDispatch, useSelector } from "react-redux";
import Slider from "rc-slider";
import InferResultModal from "./InferImages/InferResultModal";

const initialstate = {
    conf: 0.5,
    onOpen: false,
};


function InferImages({ userData, state, url, onApply, onChange }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [istate, updateIstate] = useState(initialstate);
    const [imagePreview, setImagePreview] = useState(null);
    const [resultImage, setResultImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const { conf, onOpen } = istate;
    const dispatch = useDispatch();


    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file)); // ✅ show preview
        } else {
            setSelectedFile(null);
            setImagePreview(null);
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
            toast.error("Please Select a Image to infer", commomObj);
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("username", userData?.activeUser?.userName);
            formData.append("version", state?.version);
            formData.append("project", state?.name);
            formData.append("task", "objectdetection");
            formData.append("file", selectedFile);
            formData.append("conf", conf);

            // Use redux action to call API (returns axios response)
            const response = await dispatch(inferImages({ payload: formData, url })).unwrap();
            // If the response is a binary image, handle it

            // response.data is a Blob if axios is configured correctly, but if not, convert it
            const imgUrl = URL.createObjectURL(response.data); // Blob
            setResultImage(imgUrl);
            updateIstate({ ...istate, onOpen: true });
            toast.success("Inference successful", commomObj);

        } catch (error) {
            // Try to extract error message
            let errorMsg = "Oops, something went wrong";
            if (error && error.data && error.data.message) {
                errorMsg = error.data.message;
            } else if (error && error.message) {
                errorMsg = error.message;
            }
            toast.error(errorMsg, commomObj);
            console.error("Error uploading file:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);
    return (
        <>
            <div className="Small-Wrapper">
                <h6 className="Remarks">Infer Images</h6>
                <div className="CommonForm">
                    <form>
                        {/* <div className="form-group">
                            <label>Source of Images</label>
                            <select className="form-control">
                                <option>Select Source of Images</option>
                            </select>
                        </div> */}
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
                                <span>
                                    {/* <img src={require("../../assets/images/folder-open-big.png")} /> <br /> Drag or browser from */}
                                    device
                                </span>

                            </div>
                        </div>
                        <div className="form-group text-center">
                            <label>OR</label>
                        </div>
                        <div className="form-group">
                            <label>Source of Images</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Basler Camera"
                            />
                        </div>
                        {imagePreview && (
                            <div className="form-group text-center mt-3">
                                <label>Preview:</label>
                                <div style={{ maxWidth: "100%", maxHeight: "300px" }}>
                                    <img
                                        src={imagePreview}
                                        alt="Selected preview"
                                        style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "8px" }}
                                    />
                                </div>
                            </div>
                        )}
                        <div
                            className="form-group"
                            style={{ display: "flex", margin: "35px 0 75px 0" }}
                        >
                            <label>
                                Confidence Level{" "}
                                <span
                                    className="EsclamSpan"
                                    data-toggle="tooltip"
                                    title="Change the detection confidence. If the objects are not detected, decrease it. If extra are detected, increase it."
                                >
                                    {/* <img src={require("../../assets/images/esclamination.png")} /> */}
                                </span>
                            </label>
                            <div className="RangeBox" style={{ width: 450, margin: "0 0 0 50px" }}>
                                <div className="RangeHeading">
                                    <label>Min value</label>
                                    <label>Max Value</label>
                                </div>
                                <div className='slider-container'>
                                    <Slider
                                        min={0}
                                        max={1}
                                        step={0.1}
                                        value={conf}
                                        onChange={(value) => updateIstate({ ...istate, conf: value })}
                                        className="custom-slider"
                                    />
                                    <div
                                        className="slider-value"
                                        style={{ left: `${(conf / 1) * 100}%` }} // Adjust position based on slider value
                                    >
                                        {conf?.toFixed(1)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-7 mx-auto">
                                <div className="TwoButtons">
                                    <button type="button" className="OutlineBtn">
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className={`FillBtn${loading ? ' disabled' : ''}`}
                                        onClick={saveHandler}
                                        disabled={loading}
                                        style={loading ? { pointerEvents: 'none', opacity: 0.6 } : {}}
                                    >
                                        {loading ? 'Inferring...' : 'Start Inference'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <InferResultModal
                onOpen={onOpen}
                output={istate}
                setOutput={updateIstate}
                userData={userData}
                state={state}
                onApply={onApply}
                onChange={onChange}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                url={url}
                resultImage={resultImage}
            />
        </>
    )
}

export default InferImages
