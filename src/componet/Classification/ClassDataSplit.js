import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { toast } from 'react-toastify';
import { commomObj } from '../../utils';
import Loader from '../../commonComponent/Loader';
import useDebounce from '../Project/Debouncing';
import { ClassDataSplitImages, ReturnClassDataSplit, PreviewDataSplitImages } from '../../reduxToolkit/Slices/classificationSlices';
import { getUrl } from '../../config/config';

const url = getUrl('classification')

function ClassDataSplit({ onApply, userData, state }) {
    const dispatch = useDispatch()
    const AgumentedSize = window.localStorage.getItem("AgumentedSize") || 0
    const [trainingPercentage, setTrainingPercentage] = useState(80);
    const [dataSplitCompleted, setDataSplitCompleted] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const { datasplitImages, previewImages, loading, previewLoading } = useSelector((state) => state.classification)
    const { hasChangedSteps } = useSelector((state) => state.steps);

    const handleSliderChange = (value) => {
        setTrainingPercentage(value);
    };

    // Load existing data split configuration on component mount
    useEffect(() => {
        const getData = async () => {
            const payload = {
                username: userData?.activeUser?.userName,
                version: state?.version,
                project: state?.name,
                task: "classification",
            }
            const res = await dispatch(ReturnClassDataSplit({
                payload, url
            }));
            // console.log(res, "return response of data split")
            if (res?.payload?.status === 200) {
                if (res?.payload?.data?.split_ratio) {
                    setTrainingPercentage((res?.payload?.data?.split_ratio) * 100 || 80)
                }
                // Check if data split was already completed
                if (res?.payload?.data?.split_completed) {
                    setDataSplitCompleted(true);
                }
            }
        }
        getData()
    }, []);

    // Handle Apply button click - perform data split
    const handleApply = async () => {
        try {
            const payload = {
                username: userData?.activeUser?.userName,
                version: state?.version,
                project: state?.name,
                task: "classification",
                split_ratio: (trainingPercentage / 100).toFixed(2)
            }

            const res = await dispatch(ClassDataSplitImages({
                payload, url
            }));
            console.log('>>', res)
            if (res?.payload?.code === 200) {
                setDataSplitCompleted(true);
                toast.success("Data split completed successfully!");
                onApply(); // Call parent's onApply
            } else {
                toast.error("Failed to split data. Please try again.");
            }
        } catch (error) {
            console.error("Error splitting data:", error);
            toast.error("An error occurred while splitting data.");
        }
    };

    // Handle Preview button click - load preview images
    const handlePreview = async () => {
        try {
            const payload = {
                username: userData?.activeUser?.userName,
                version: state?.version,
                project: state?.name,
                task: "classification"
            }

            const res = await dispatch(PreviewDataSplitImages({
                payload, url
            }));

            if (res?.payload?.status === 200) {
                setShowPreview(true);
            } else {
                toast.error("Failed to load preview images.");
            }
        } catch (error) {
            console.error("Error loading preview:", error);
            toast.error("An error occurred while loading preview images.");
        }
    };

    return (
        <>
            <div className="Small-Wrapper">
                <h6 className="Remarks">Data Split Ratio</h6>
                <fieldset disabled="">
                    <div className="CommonForm">
                        <form>
                            <div className="form-group">
                                <label>
                                    Size of Data Set{" "}
                                    <span
                                        className="EsclamSpan"
                                        data-toggle="tooltip"
                                        title="Augmented images size"
                                    >
                                        <img src={require("../../assets/images/esclamination.png")} />
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={AgumentedSize}
                                    disabled={true}
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    Select ratio to divide the dataset into training and validation sets
                                    based on a specified ratio{" "}
                                    <span
                                        className="EsclamSpan"
                                        data-toggle="tooltip"
                                        title="Divides the dataset in training and validation set and training should always be 80% or above"
                                    >
                                        <img src={require("../../assets/images/esclamination.png")} />
                                    </span>
                                </label>
                            </div>
                            <div className="DataSplitRatioBox">
                                <div className="custom-slider-container">
                                    <div className="custom-status-labels">
                                        <span style={{ color: 'green' }}>Training Set: {trainingPercentage}%</span>
                                        {' - '}
                                        <span style={{ color: 'red' }}>Validation Set: {100 - trainingPercentage}%</span>
                                    </div>
                                    <div
                                        className="slider-background"
                                        style={{ '--training-percent': `${trainingPercentage}%` }}
                                    />
                                    <Slider
                                        min={0}
                                        max={100}
                                        value={trainingPercentage}
                                        onChange={handleSliderChange}
                                        railClassName="custom-slider-rail"
                                        trackClassName="custom-slider-track"
                                        handleClassName="custom-slider-handle"
                                        className="custom-slider"
                                        disabled={dataSplitCompleted} // Disable slider after split is completed
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Training Set</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={Math.trunc((trainingPercentage * AgumentedSize) / 100)}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Validation Set</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={Math.trunc(((100 - trainingPercentage) * AgumentedSize) / 100)}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Show preview images only if showPreview is true */}
                            {showPreview && (
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="DataPreviewAugment">
                                            <h6>Training Set Preview</h6>
                                            {!previewLoading ? (
                                                <ul>
                                                    {previewImages?.images?.filter(img => img.data_type === 'train')?.length > 0 ?
                                                        previewImages.images
                                                            .filter(img => img.data_type === 'train')
                                                            .map((image, index) => (
                                                                <li key={index}>
                                                                    <figure>
                                                                        <img src={`data:image/png;base64,${image.data}`} alt={image.filename} />
                                                                    </figure>
                                                                </li>
                                                            )) : <p><b>No Training Data Found</b></p>
                                                    }
                                                </ul>
                                            ) : (
                                                <Loader item={"200px"} />
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="DataPreviewAugment">
                                            <h6>Validation Set Preview</h6>
                                            {!previewLoading ? (
                                                <ul>
                                                    {previewImages?.images?.filter(img => img.data_type === 'val')?.length > 0 ?
                                                        previewImages.images
                                                            .filter(img => img.data_type === 'val')
                                                            .map((image, index) => (
                                                                <li key={index}>
                                                                    <figure>
                                                                        <img src={`data:image/png;base64,${image.data}`} alt={image.filename} />
                                                                    </figure>
                                                                </li>
                                                            )) : <p><b>No Validation Data Found</b></p>
                                                    }
                                                </ul>
                                            ) : (
                                                <Loader item={"200px"} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="row">
                                <div className="col-lg-7 mx-auto">
                                    <div className="TwoButtons">
                                        {!dataSplitCompleted ? (
                                            <a
                                                role='button'
                                                className="FillBtn"
                                                onClick={handleApply}
                                                disabled={loading}
                                            >
                                                {loading ? 'Splitting...' : 'Apply'}
                                            </a>
                                        ) : (
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <a
                                                    role='button'
                                                    className="OutlineBtn"
                                                    onClick={handlePreview}
                                                    disabled={previewLoading}
                                                >
                                                    {previewLoading ? 'Loading...' : 'Preview Images'}
                                                </a>
                                                <a
                                                    role='button'
                                                    className="FillBtn"
                                                    onClick={() => onApply()}
                                                >
                                                    Continue
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </fieldset>
            </div>
        </>
    )
}

export default ClassDataSplit
