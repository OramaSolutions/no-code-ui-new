import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { toast } from 'react-toastify';
import { commomObj } from '../../utils';
import { DataSplitImages, DataSplits, ReturnDataSplit } from '../../reduxToolkit/Slices/projectSlices';
import Loader from '../../commonComponent/Loader';
import useDebounce from './Debouncing';


function DataSplit({ onApply, userData, state, onChange }) {
    const dispatch = useDispatch()
    const AgumentedSize = window.localStorage.getItem("AgumentedSize") || 0
    const [trainingPercentage, setTrainingPercentage] = useState(80);
    const [flag, setFlag] = useState(false)
    const debouncedTrainingPercentage = useDebounce((trainingPercentage / 100).toFixed(2), 300);
    const { datasplitImages, loading } = useSelector((state) => state.project)
    const { hasChangedSteps } = useSelector((state) => state.steps);
    console.log(hasChangedSteps, "datasplitImages")

    const handleSliderChange = (value) => {
        setTrainingPercentage(value);
    };
    useEffect(() => {
        const getData = async () => {
            const res = await dispatch(ReturnDataSplit({
                username: userData?.activeUser?.userName,
                version: state?.version,
                project: state?.name,
                task: "objectdetection",
            }));
            if (res?.status === 200) {
                if (res?.payload?.data?.split_ratio) {
                    setTrainingPercentage((res?.payload?.data?.split_ratio) * 100 || 80)
                }
                setFlag(true)
            } else {
                setFlag(true)
            }
        }

        getData()
    }, []);

    useEffect(() => {
        if (flag) {
            dispatch(DataSplitImages({
                username: userData?.activeUser?.userName,
                version: state?.version,
                project: state?.name,
                task: "objectdetection",
                split_ratio: debouncedTrainingPercentage || 0.80
            }));
        }
    }, [debouncedTrainingPercentage, flag]);

    const saveHandler = () => {
        if (hasChangedSteps?.dataSplit) {
            onChange()
        }
        onApply();
    }
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
                                        {/* <img src={require("../../assets/images/esclamination.png")} /> */}
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
                                        {/* <img src={require("../../assets/images/esclamination.png")} /> */}
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
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Training Set</label>
                                        <input type="text" className="form-control" value={Math.trunc((trainingPercentage * AgumentedSize) / 100)} />
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Validation Set</label>
                                        <input type="text" className="form-control" value={Math.trunc(((100 - trainingPercentage) * AgumentedSize) / 100)} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="DataPreviewAugment">
                                        <h6>Preview Images</h6>
                                        {!loading ? <ul>
                                            {datasplitImages?.[0]?.images.length > 0 ? datasplitImages?.[0]?.images?.map((base64) => (
                                                <li>
                                                    <figure>
                                                        {base64.data && <img src={`data:image/png;base64,${base64.data}`} />}
                                                    </figure>
                                                </li>
                                            )) : <p><b>No Data Found</b></p>}

                                        </ul> : <Loader
                                            item={"200px"}
                                        />}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="DataPreviewAugment">
                                        <h6>Preview Images</h6>
                                        {!loading ? <ul>
                                            {datasplitImages?.[1]?.images.length > 0 ? datasplitImages?.[1]?.images?.map((base64) => (
                                                <li>
                                                    <figure>
                                                        {base64.data && <img src={`data:image/png;base64,${base64.data}`} />}
                                                    </figure>
                                                </li>
                                            )) : <p><b>No Data Found</b></p>}

                                        </ul> : <Loader
                                            item={"200px"}
                                        />}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-7 mx-auto">
                                    <div className="TwoButtons">
                                        <a
                                            href="dashboard-augmentations-images.html"
                                            className="OutlineBtn"
                                        >
                                            Cancel
                                        </a>
                                        <a role='button' className="FillBtn" onClick={saveHandler}>
                                            Apply
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </fieldset >
            </div >

        </>
    )
}

export default DataSplit
