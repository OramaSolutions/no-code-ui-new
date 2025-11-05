import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { commomObj } from '../../utils';
import { toast } from 'react-toastify';
import { inferImages } from "../../reduxToolkit/Slices/projectSlices";
import { useDispatch, useSelector } from "react-redux";
import Slider from "rc-slider";

import { Defectinfer } from "../../reduxToolkit/Slices/defectSlices";
import DefectInferResultModal from "./DefectInferResultModal";
import axios from "axios";

import DefectTrainModal from "./DefectTrainModal";
import DefectVisualize from "./DefectVisualize";
import { getUrl } from '../../config/config';

const url = getUrl('defectdetection')

const initialstate = {
    onOpen: false,
    confidence: 0,
    inferData: "",
    loader: false,
    opendefectTraining: false,
    openVisualize: false,
}

function DefectInfer({ userData, state, onApply, onChange }) {
    const dispatch = useDispatch();
    const [selectedFile, setSelectedFile] = useState(null);
    const [istate, updateIstate] = useState(initialstate)
    const { onOpen, confidence, inferData, loader, openVisualize, opendefectTraining } = istate;
    console.log(istate, "istaee of infer")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${url}get_confidence?username=${userData?.activeUser?.userName}&task=defectdetection&project_name=${state?.name}&version=${state?.version}`)
                console.log(res, "response of infer confidence")
                if (res?.status == 200) {
                    updateIstate({ ...istate, confidence: (res?.data?.confidence).toFixed(2) || 0 })
                }
            }
            catch (err) {
                console.log(err, "err")
            }
        }
        if (!onOpen) {
            fetchData();
        }

    }, [onOpen])

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            console.log('>>.', file)
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
            formData.append("project_name", state?.name);
            formData.append("task", "defectdetection");
            formData.append("image", selectedFile);
            formData.append("confidence", confidence);

            updateIstate({ ...istate, loader: true })
            const response = await dispatch(Defectinfer(formData))
            if (response?.payload?.status === 200) {
                toast.success(response?.payload?.data?.message, commomObj)
                updateIstate({ ...istate, onOpen: true, inferData: response?.payload?.data, loader: false })
            } else {
                toast.error(response?.payload?.data?.message, commomObj)
                updateIstate({ ...istate, loader: false })
            }
        } catch (error) {
            toast.error("Oops,something went wrong", commomObj)
            updateIstate({ ...istate, loader: false })

        }
    }
    const openAccuracy = () => {
        updateIstate({ ...istate, opendefectTraining: true })
    }
    return (
        <div>
            <div className="Small-Wrapper">
                <h6 className="Remarks">Infer Images</h6>
                <div className="CommonForm">
                    <div className="row">
                        <div className="TwoButtons" style={{ marginLeft: "764px" }}>
                            <a
                                role="buton"
                                className="Button"
                                style={{ paddingRight: "18px" }}
                                onClick={openAccuracy}
                            >
                                View Accuracy Matrix
                            </a>
                        </div>
                    </div>
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
                                <span>
                                    {/* <img src={require("../../assets/images/folder-open-big.png")} /> <br /> Drag or browser from */}
                                    device
                                </span>

                            </div>
                            {selectedFile && (
                                <div className="mt-4">
                                    <p>Preview:</p>
                                    <img
                                        src={URL.createObjectURL(selectedFile)}
                                        alt="Preview"
                                        className="max-w-full h-auto rounded shadow"
                                    />
                                </div>
                            )}
                        </div>
                        <div
                            className="form-group"
                            style={{ display: "flex", margin: "35px 0 75px 0" }}
                        >
                            <label>
                                Threshold Value-{" "}
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
                                        step={0.01}
                                        value={confidence}
                                        onChange={(value) => updateIstate({ ...istate, confidence: value })}
                                        className="custom-slider"
                                    />
                                    <div
                                        className="slider-value"
                                        style={{ left: `${(confidence / 1) * 100}%` }}
                                    >
                                        {confidence}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-7 mx-auto">
                                <div className="TwoButtons">
                                    <a
                                        role="buton"
                                        className="FillBtn"
                                        onClick={saveHandler}
                                        style={{ backgroundColor: loader ? "grey" : "#028DEC", pointerEvents: loader ? 'none' : '' }}
                                    >
                                        Start Inference
                                    </a>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <DefectInferResultModal
                output={istate}
                setOutput={updateIstate}
                userData={userData}
                state={state}
                onApply={onApply}
                onChange={onChange}
                setSelectedFile={setSelectedFile}
            />

            {opendefectTraining && <DefectTrainModal
                data={istate}
                setData={updateIstate}
                onApply={onApply}
                userData={userData}
                state={state}
                task="defectdetection"
                type="infer"
            />}
            {openVisualize && <DefectVisualize
                data={istate}
                setData={updateIstate}
                onApply={onApply}
                userData={userData}
                state={state}
                task="defectdetection"
                type="infer"
            />}
        </div>
    )
}
export default DefectInfer

