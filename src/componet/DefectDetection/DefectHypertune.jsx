import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { commomObj } from '../../utils';
import { toast } from 'react-toastify';

import Slider from "rc-slider";
import TrainModel from '../Project/TrainModel';
import { DefecthyperTune, DefectModal, ReturnDefectHypertune } from '../../reduxToolkit/Slices/defectSlices';
import axios from 'axios';

import Loader from '../../commonComponent/Loader';
import { getUrl } from '../../config/config';

const url = getUrl('defectdetection')

const initialState = {
    model: "",
    image_size: "256",
    model_size: "small",
    test_split_mode: "from_dir",
    test_split: 0.2,
    apply: false,
    tile_size: "",
    stride: "",
    use_random_tiling: false,
    random_tile_count: "16",
    center_crop: "224",
    advanced: false,
    loader: false,
    openModal: false,
    isDirty: false,
}

function DefectHypertune({ onApply, state, userData, onChange, trainingStatus }) {
    const dispatch = useDispatch();
    const [istate, updateIstate] = useState(initialState)
    const { openModal, loader, advanced, model, image_size, model_size, apply, tile_size, test_split, test_split_mode, stride, use_random_tiling, random_tile_count, center_crop, isDirty, trainingPercentage } = istate;
    const { hasChangedSteps } = useSelector((state) => state.steps);
    const { defectModal } = useSelector((state) => state.defectDetection)
    console.log(istate, "istate")
    //========================================pre-trained model============================================
    useEffect(() => {
        dispatch(DefectModal({
            username: userData?.activeUser?.userName,
            version: state?.version,
            project: state?.name,
            task: "defectdetection",
        }));
        const fetchData = async () => {
            try {
                if (trainingStatus) {
                    updateIstate({ ...istate, loader: false, openModal: true })
                }
                const res = await dispatch(ReturnDefectHypertune({
                    username: userData?.activeUser?.userName,
                    version: state?.version,
                    project_name: state?.name,
                    task: "defectdetection",
                }));
                console.log(res, "response of defectdetection ")
                if (res?.payload?.status === 200) {
                    const data = res?.payload?.data
                    updateIstate((prev) => ({
                        ...prev,
                        model: data?.config?.model || "",
                        image_size: data?.config?.image_size || "256",
                        model_size: data?.config?.model_size || "small",
                        test_split_mode: data?.config?.test_split_mode || "",
                        test_split: data?.config?.test_split || 0.2,
                        apply: data?.config?.apply || false,
                        tile_size: data?.config?.tile_size || "",
                        stride: data?.config?.stride || "",
                        use_random_tiling: data?.config?.use_random_tiling || false,
                        random_tile_count: data?.config?.random_tile_count || "",
                        center_crop: data?.config?.center_crop || "False",
                        // trainingPercentage: res?.payload?.data?.config?. trainingPercentage ||80,
                        isDirty: true,
                    }))
                }
            } catch (err) {
                console.log(err, "err hypertune")
            }
        }
        fetchData();
    }, []);
    //===========================================input handler==========================================
    const inputHandler = (e) => {
        const { name, value, checked } = e.target;
        if (name == "use_random_tiling" || name == "apply") {
            updateIstate((prev) => ({ ...prev, [name]: checked, isDirty: false }))
        }
        else {
            updateIstate((prev) => ({ ...prev, [name]: value, isDirty: false }))
        }
    }
    //==========================================slider change===========================================    
    const handleSliderChange = (value) => {
        updateIstate((prev) => ({ ...prev, test_split: value, isDirty: false }))
    };
    //=============================================save handler========================================
    const saveHandler = async () => {
        if (isDirty || hasChangedSteps?.HyperTune == false) {
            const res = await axios.get(`${url}get_train_infer?username=${userData?.activeUser?.userName}&task=defectdetection&project_name=${state?.name}&version=${state?.version}`)
            console.log(res, "response of training")
            if (res?.status === 200 && res?.data?.status != "training_completed") {
                updateIstate({ ...istate, loader: false, openModal: true })
                onChange();
                return
            } else {
                onApply();
                return;
            }
        }
        const data = { username: userData?.activeUser?.userName, version: state?.version, project_name: state?.name, task: "defectdetection", model, image_size: Number(image_size) == 0 ? 256 : Number(image_size), model_size, test_split_mode, test_split: Number(test_split) == 0 ? 0.2 : Number(test_split), apply, tile_size: Number(tile_size) == 0 ? null : Number(tile_size), stride: Number(stride) == 0 ? null : Number(stride), use_random_tiling, random_tile_count: Number(random_tile_count) == 0 ? 16 : Number(random_tile_count), center_crop: Number(center_crop) == 0 ? 224 : Number(center_crop) }
        try {
            updateIstate({ ...istate, loader: true })
            const response = await dispatch(DefecthyperTune(data))
            console.log(response, "response of defect hypertune")
            if (response?.payload?.status === 200) {
                toast.success(response?.payload?.message, commomObj)
                updateIstate({ ...istate, loader: false, openModal: true })
                onChange();
            } else {
                toast.error(response?.payload?.message, commomObj)
                updateIstate({ ...istate, loader: false })
            }
        } catch (error) {
            toast.error(error?.payload?.message, commomObj)
            updateIstate({ ...istate, loader: false })
            console.error("Error uploading file:", error);
        }
    }
    return (
        <div>
            <div className="Small-Wrapper">
                <h6 className="Remarks">Tune Hyper Parameters</h6>
                <div className="CommonForm">
                    <form>
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
                                    <span style={{ color: 'green' }}>Validation Set: {(test_split).toFixed(2)}</span>
                                    {' - '}
                                    <span style={{ color: 'red' }}>Training Set: {(1 - test_split).toFixed(2)}</span>
                                </div>
                                <div
                                    className="slider-background"
                                    style={{ '--training-percent': `${trainingPercentage}%` }}
                                />
                                <Slider
                                    min={0}
                                    max={1}
                                    value={test_split}
                                    step={0.01}
                                    onChange={handleSliderChange}
                                    railClassName="custom-slider-rail"
                                    trackClassName="custom-slider-track"
                                    handleClassName="custom-slider-handle"
                                    className="custom-slider"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>
                                Choose model type{" "}
                                <span
                                    className="EsclamSpan"
                                    data-toggle="tooltip"
                                    title="Choose effecient for easy tasks(classes are less than 5 and dataset size is <600, small if classes are >5, dataset size is >1000.  Choose medium if dataset size is big and features to detect are hard to locate."
                                >
                                    {/* <img src={require("../../assets/images/esclamination.png")} /> */}
                                </span>
                            </label>
                            <select
                                className="form-control"
                                name='model'
                                onChange={inputHandler}
                            >
                                <option value="">Choose model type</option>
                                {defectModal?.length > 0 ?
                                    defectModal?.map((item, i) => {
                                        return (
                                            <option selected={item == model} value={item}>{item}</option>
                                        )
                                    }) : <p>No Data found.</p>
                                }
                            </select>
                        </div>
                        <h6 className="Remarks">Set Values</h6>
                        <article>
                            <div className="Heading">
                                <h3>Hyper Parameters</h3>
                                <h3>Values</h3>
                            </div>
                            <div className="SetValueBox">
                                <p>
                                    Image Size{" "}
                                    {/* <img
                                        src={require("../../assets/images/esclamination.png")}
                                        data-toggle="tooltip"
                                        title="Increase the image size if objects to be detected are too small. Common sizes 640, 1280,1600( only use with efficient)."
                                    /> */}
                                </p>
                                <div className="form-group">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Numeric Input"
                                        name='image_size'
                                        value={image_size}
                                        onWheel={(e) => e.target.blur()}
                                        onChange={inputHandler}
                                    />
                                </div>
                            </div>
                            <div className="SetValueBox">
                                <p>
                                    Model Size{" "}
                                    {/* <img
                                        src={require("../../assets/images/esclamination.png")}
                                        data-toggle="tooltip"
                                        title="Change training device "
                                    /> */}
                                </p>
                                <div className="form-group">
                                    <ul className="GpuCpuRadio">
                                        <li>
                                            <label className="Radio">
                                                {" "}
                                                Small
                                                <input type="radio"
                                                    name="model_size"
                                                    value="small"
                                                    checked={model_size == "small" ? true : false}
                                                    onChange={inputHandler}
                                                />
                                                <span className="checkmark" />
                                            </label>
                                        </li>
                                        <li>
                                            <label className="Radio">
                                                {" "}
                                                Large
                                                <input
                                                    type="radio"
                                                    name="model_size"
                                                    value="large"
                                                    checked={model_size == "large" ? true : false}
                                                    onChange={inputHandler}
                                                />
                                                <span className="checkmark" />
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </article>
                    </form>
                    {advanced ?
                        <div>
                            <article>
                                <div className="Heading">
                                    <h3>Hyper Parameters</h3>
                                    <h3>Values</h3>
                                </div>
                                <div className="SetValueBox">
                                    <p>
                                        Center_Crop{" "}
                                        {/* <img
                                            src={require("../../assets/images/esclamination.png")}
                                            data-toggle="tooltip"
                                            title="Train the dataset as a single class. Effective in defectdetection (scratches, dents, etc) as defect"
                                        /> */}
                                    </p>
                                    <div className="form-group">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Numeric Input"
                                            name="center_crop"
                                            value={center_crop}
                                            onWheel={(e) => e.target.blur()}
                                            onChange={inputHandler}
                                        />
                                    </div>
                                </div>
                                {/* <div className="SetValueBox">
                                    <p>
                                        Test Split Ratio{" "}
                                        <img
                                            src={require("../../assets/images/esclamination.png")}
                                            data-toggle="tooltip"
                                            title="Number of consistent iterations to wait for before terminating the training. Helpful if learning is slow."
                                        />
                                    </p>
                                    <div className="form-group">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Numeric Input"
                                            name="test_split"
                                            value={test_split}
                                            onWheel={(e) => e.target.blur()}
                                            onChange={inputHandler}
                                        />
                                    </div>
                                </div> */}
                                <div className="SetValueBox">
                                    <p>
                                        ValMode{" "}
                                        {/* <img
                                            src={require("../../assets/images/esclamination.png")}
                                            data-toggle="tooltip"
                                            title="Change training device "
                                        /> */}
                                    </p>
                                    <div className="form-group">
                                        <ul className="GpuCpuRadio">
                                            <li>
                                                <label className="Radio">
                                                    {" "}
                                                    Dir
                                                    <input type="radio"
                                                        name="test_split_mode"
                                                        value="from_dir"
                                                        checked={test_split_mode == "from_dir" ? true : false}
                                                        onChange={inputHandler}
                                                    />
                                                    <span className="checkmark" />
                                                </label>
                                            </li>
                                            <li>
                                                <label className="Radio">
                                                    {" "}
                                                    Synthetic
                                                    <input
                                                        type="radio"
                                                        name="test_split_mode"
                                                        value="synthetic"
                                                        checked={test_split_mode == "synthetic" ? true : false}
                                                        onChange={inputHandler}
                                                    />
                                                    <span className="checkmark" />
                                                </label>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="Heading">
                                    <h3>Tiling</h3>
                                </div>
                                <div className="SetValueBox">
                                    <p>
                                        Apply{" "}
                                        {/* <img
                                            src={require("../../assets/images/esclamination.png")}
                                            data-toggle="tooltip"
                                            title="Number of consistent iterations to wait for before terminating the training. Helpful if learning is slow."
                                        /> */}
                                    </p>
                                    <div className="form-group">
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                name='apply'
                                                value={apply}
                                                checked={apply}
                                                onChange={inputHandler}

                                            />
                                            <span className="slider" />
                                        </label>
                                    </div>
                                </div>
                                <div className="SetValueBox">
                                    <p>
                                        Tile_Size{" "}
                                        {/* <img
                                            src={require("../../assets/images/esclamination.png")}
                                            data-toggle="tooltip"
                                            title="Number of consistent iterations to wait for before terminating the training. Helpful if learning is slow."
                                        /> */}
                                    </p>
                                    <div className="form-group">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Numeric Input"
                                            name="tile_size"
                                            value={tile_size}
                                            onWheel={(e) => e.target.blur()}
                                            onChange={inputHandler}
                                        />
                                    </div>
                                </div>
                                <div className="SetValueBox">
                                    <p>
                                        Stride{" "}
                                        {/* <img
                                            src={require("../../assets/images/esclamination.png")}
                                            data-toggle="tooltip"
                                            title="Number of consistent iterations to wait for before terminating the training. Helpful if learning is slow."
                                        /> */}
                                    </p>
                                    <div className="form-group">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Numeric Input"
                                            name="stride"
                                            value={stride}
                                            onWheel={(e) => e.target.blur()}
                                            onChange={inputHandler}
                                        />
                                    </div>
                                </div>
                                <div className="SetValueBox">
                                    <p>
                                        Random_Tiling{" "}
                                        {/* <img
                                            src={require("../../assets/images/esclamination.png")}
                                            data-toggle="tooltip"
                                            title="Train the dataset as a single class. Effective in defectdetection (scratches, dents, etc) as defect"
                                        /> */}
                                    </p>
                                    <div className="form-group">
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                name='use_random_tiling'
                                                value={use_random_tiling}
                                                checked={use_random_tiling}
                                                onChange={inputHandler}

                                            />
                                            <span className="slider" />
                                        </label>
                                    </div>
                                </div>
                                <div className="SetValueBox">
                                    <p>
                                        Tile_Count{" "}
                                        {/* <img
                                            src={require("../../assets/images/esclamination.png")}
                                            data-toggle="tooltip"
                                            title="Number of consistent iterations to wait for before terminating the training. Helpful if learning is slow."
                                        /> */}
                                    </p>
                                    <div className="form-group">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Numeric Input"
                                            name="random_tile_count"
                                            value={random_tile_count}
                                            onWheel={(e) => e.target.blur()}
                                            onChange={inputHandler}
                                        />
                                    </div>
                                </div>

                            </article>
                        </div> : ""}
                    <div className="text-center" style={{ padding: "35px 0" }}>
                        {!advanced ? <a
                            role='button'
                            className="AdvanceSettingsCss "
                            onClick={(e) => updateIstate({ ...istate, advanced: true })}
                        >
                            Advance Settings
                        </a> :
                            <a
                                role='button'
                                className="AdvanceSettingsCss"
                                onClick={(e) => updateIstate({ ...istate, advanced: false })}
                            >
                                Hide Advance Settings
                            </a>}
                    </div>
                    <div className="row">
                        <div className="col-lg-7 mx-auto">
                            <div className="TwoButtons">
                                <a className="ResetBtn" onClick={() => updateIstate(initialState)}>
                                    Reset
                                </a>
                                <a
                                    className="FillBtn"
                                    role='button'
                                    onClick={saveHandler}
                                    style={{ backgroundColor: loader ? "grey" : "#028DEC", pointerEvents: loader ? 'none' : '' }}
                                >
                                    Apply
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <TrainModel
                initialData={istate}
                setState={updateIstate}
                onApply={onApply}
                userData={userData}
                state={state}
                task="defectdetection"
                apiPoint=""
            />
        </div>
    )
}

export default DefectHypertune
