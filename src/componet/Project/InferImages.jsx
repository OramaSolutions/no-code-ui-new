import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { commomObj } from '../../utils';
import { toast } from 'react-toastify';
import { inferImages } from "../../reduxToolkit/Slices/projectSlices";
import { useDispatch, useSelector } from "react-redux";
import Slider from "rc-slider";
import InferResultModal from "./inferResultModal";

const initialstate = {
    conf: 0.5,
    onOpen: false,
}

function InferImages({ userData, state }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [istate, updateIstate] = useState(initialstate)
    const { conf, onOpen } = istate;
    const dispatch = useDispatch();


    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);

        } else {
            setSelectedFile(null);
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
            toast.error("Please Select a Image to infer", commomObj)
            return
        }
        try {
            const formData = new FormData();
            formData.append("username", userData?.activeUser?.userName);
            formData.append("version", state?.version);
            formData.append("project", state?.name);
            formData.append("task", "objectdetection");
            formData.append("file", selectedFile);
            formData.append("conf", conf);

            const response = await dispatch(inferImages(formData))
            console.log(response, "response of import image")
            if (response?.payload?.status === 201) {
                toast.success(response?.payload?.data?.message, commomObj)
                updateIstate({ ...istate, onOpen: true })
            } else {
                toast.error(response?.payload?.data?.message, commomObj)
            }
        } catch (error) {
            toast.error("Oops,something went wrong", commomObj)
            console.error("Error uploading file:", error);

        }
    }
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
                                    <a className="OutlineBtn">
                                        Cancel
                                    </a>
                                    <a
                                        role="buton"
                                        className="FillBtn"
                                        onClick={saveHandler}
                                    >
                                        Start Inference
                                    </a>
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
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
            />
        </>
    )
}

export default InferImages
