import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { commomObj } from '../../../utils';
import { toast } from 'react-toastify';
import { hyperTune, HypetTuneModal, ReturnHypertune } from '../../../reduxToolkit/Slices/projectSlices';
import Slider from "rc-slider";
import TrainModel from '../../Project/TrainModel';

const initialState = {
    pre_trained_model: "",
    imgsz: 640,
    batch: 32,
    epochs: 60,
    mosaic: 0,
    close_mosaic: 0,
    device: 0,
    dropout: 0,
    fliplr: 0,
    flipud: 0,
    patience: 20,
    single_cls: false,
    validation_conf: 0.25,
    advanced: false,
    loader: false,
    openModal: false,
    isDirty: false
}

function HyperTune({ onApply, state, userData, onChange, url }) {
    const dispatch = useDispatch();
    const [istate, updateIstate] = useState(initialState)
    const { openModal, validation_conf, loader, advanced, mosaic, pre_trained_model, imgsz, batch, epochs, close_mosaic, device, dropout, fliplr, flipud, patience, single_cls, isDirty } = istate;
    const { hypertuneModel } = useSelector((state) => state.project)
    // console.log('hypertuneModel', hypertuneModel)
    const { hasChangedSteps } = useSelector((state) => state.steps);
   
    //==========================================pre-trained model============================================
    useEffect(() => {
        const payload = {
            username: userData?.activeUser?.userName,
            version: state?.version,
            project: state?.name,
            task: "objectdetection",
        }
        dispatch(HypetTuneModal({ payload, url }));

        const fetchData = async () => {
            try {
                const payload = {
                    username: userData?.activeUser?.userName,
                    version: state?.version,
                    project: state?.name,
                    task: "objectdetection",
                }
                const res = await dispatch(ReturnHypertune({ payload, url }));
                if (res?.payload?.status === 200) {
                    // console.log(">>>>.", res?.payload?.data?.single_cls, res?.payload?.data?.single_cls === 'true')
                    updateIstate((prev) => ({
                        ...prev,
                        pre_trained_model: res?.payload?.data?.model?.split?.("/")?.at(-1) || "",
                        imgsz: res?.payload?.data?.imgsz || 640,
                        batch: res?.payload?.data?.batch || 32,
                        epochs: res?.payload?.data?.epochs || 60,
                        mosaic: res?.payload?.data?.mosaic || 0,
                        close_mosaic: res?.data?.payload?.close_mosaic || 0,
                        device: res?.payload?.data?.device || 0,
                        dropout: res?.payload?.data?.dropout || 0,
                        fliplr: res?.payload?.data?.fliplr || 0,
                        flipud: res?.payload?.data?.flipud || 0,
                        patience: res?.payload?.data?.patience || 20,
                        single_cls: res?.payload?.data?.single_cls === "true",
                        validation_conf: res?.payload?.data?.validation_conf || 0.25,
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
    // const inputHandler = (e) => {
    //     const { name, value, checked } = e.target;
    //     if (name == "flipud" || name == "fliplr" || name == "close_mosaic" || name == "mosaic") {
    //         updateIstate((prev) => ({ ...prev, [name]: checked ? 1 : 0, isDirty: true }))
    //     } else if (name == "single_cls") {
    //         updateIstate((prev) => ({ ...prev, [name]: checked ? "True" : "False", isDirty: true }))
    //     }
    //     else {
    //         updateIstate((prev) => ({ ...prev, [name]: value, isDirty: true }))
    //     }
    // }

    const inputHandler = (e) => {
        const { name, value, checked, type } = e.target;

        // Boolean checkbox mapped to "True"/"False" for backend single_cls
        if (name === "single_cls") {
            console.log(name, checked, "nameeee")
            updateIstate((prev) => ({
                ...prev,
                [name]: checked ? "true" : "false",
                isDirty: true,
            }));
            return;
        }


        if (name === "close_mosaic") {
            if (value > epochs) {
                return toast.error("Close mosaic value should not be greater than epochs value", commomObj)
            }
            updateIstate((prev) => ({
                ...prev,
                [name]: value === "" ? "" : Number(value),
                isDirty: true,
            }));
            return;
        }

        // Numeric text/number inputs
        const numericFields = new Set([
            "imgsz",
            "batch",
            "epochs",
            "patience",

        ]);

        if (numericFields.has(name)) {
            // Allow empty to let user clear field; otherwise coerce to number
            updateIstate((prev) => ({
                ...prev,
                [name]: value === "" ? "" : Number(value),
                isDirty: true,
            }));
            return;
        }

        // Radio/select values stay as strings
        const stringFields = new Set(["pre_trained_model", "device"]);
        if (stringFields.has(name)) {
            updateIstate((prev) => ({
                ...prev,
                [name]: value,
                isDirty: true,
            }));
            return;
        }

        // Fallback: store as-is
        updateIstate((prev) => ({
            ...prev,
            [name]: value,
            isDirty: true,
        }));
    };

    //=============================================save handler======================================
    const saveHandler = async () => {
        console.log('save handler called')
        if (!isDirty ) {
            console.log('onApply in the if called')
            onApply();
            return;
        }
        const formData = new FormData();
        formData.append("username", userData?.activeUser?.userName);
        formData.append("version", state?.version);
        formData.append("project", state?.name);
        formData.append("task", "objectdetection");
        formData.append("pre_trained_model", pre_trained_model);
        formData.append("batch", batch || 32);
        formData.append("epochs", epochs || 60);
        formData.append("imgsz", imgsz || 640);
        formData.append("mosaic", mosaic || 0);
        formData.append("close_mosaic", close_mosaic || 0);
        formData.append("device", device || 0);
        formData.append("dropout", dropout || 0);
        formData.append("fliplr", fliplr || 0);
        formData.append("flipud", flipud || 0);
        formData.append("patience", patience || 20);
        formData.append("single_cls", single_cls);
        formData.append("validation_conf", validation_conf || 0.25);

        try {
            console.log('in try upsate')
            updateIstate({ ...istate, loader: true })
            const response = await dispatch(hyperTune({ payload: formData, url }))
            console.log("File responseeeeeeeeee", response);
            if (response?.payload?.code === 200) {
                toast.success(response?.payload?.message, commomObj)
                updateIstate({ ...istate, loader: false, openModal: true })
                onChange();
            }
        } catch (error) {
            toast.error(error?.payload?.message, commomObj)
            updateIstate({ ...istate, loader: false })
            console.error("Error uploading file:", error);
        }
    }
    return (
        <>
            <div className="Small-Wrapper">
                <h6 className="Remarks">Tune Hyper Parameters</h6>
                <div className="CommonForm">
                    <form>
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
                                name='pre_trained_model'
                                onChange={inputHandler}
                            >
                                <option value="">Choose model type</option>
                                {hypertuneModel?.models?.length > 0 ?
                                    hypertuneModel?.models?.map((item, i) => {
                                        return (
                                            <option selected={item == pre_trained_model} value={item}>{item}</option>
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
                                        name='imgsz'
                                        value={imgsz}
                                        onWheel={(e) => e.target.blur()}
                                        onChange={inputHandler}
                                    />
                                </div>
                            </div>
                            <div className="SetValueBox">
                                <p>
                                    Batch Size{" "}
                                    {/* <img
                                        src={require("../../assets/images/esclamination.png")}
                                        data-toggle="tooltip"
                                        title="Number of images to pass in one go. If training is giving error, reduce the batch size."
                                    /> */}
                                </p>
                                <div className="form-group">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Numeric Input"
                                        name='batch'
                                        value={batch}
                                        onWheel={(e) => e.target.blur()}
                                        onChange={inputHandler}
                                    />
                                </div>
                            </div>
                            <div className="SetValueBox">
                                <p>
                                    Epochs{" "}
                                    {/* <img
                                        src={require("../../assets/images/esclamination.png")}
                                        data-toggle="tooltip"
                                        title="Max number of training iterations"
                                    /> */}
                                </p>
                                <div className="form-group">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Numeric Input"
                                        name='epochs'
                                        value={epochs}
                                        onWheel={(e) => e.target.blur()}
                                        onChange={inputHandler}
                                    />
                                </div>
                            </div>
                            <div className="SetValueBox">
                                <p>
                                    Mosaic{" "}
                                    {/* <img
                                        src={require("../../assets/images/esclamination.png")}
                                        data-toggle="tooltip"
                                        title="Disable if images are similar and object size is small"
                                    /> */}
                                </p>
                                {/* <div className="form-group">
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name='mosaic'
                                            value={mosaic}
                                            checked={mosaic}
                                            onChange={inputHandler}
                                        />
                                        <span className="slider" />
                                    </label>
                                </div> */}
                                <div className="form-group">
                                    <div className="RangeBox">
                                        <div className="RangeHeading">
                                            <label>Min Val</label>
                                            <label>Max Value</label>
                                        </div>
                                        <div className='slider-container'>
                                            <Slider
                                                min={0}
                                                max={1}
                                                step={0.1}
                                                value={mosaic}
                                                onChange={(value) => updateIstate({ ...istate, mosaic: value })}
                                                className="custom-slider"
                                            />
                                            <div
                                                className="slider-value"
                                                style={{ left: `${(mosaic / 1) * 100}%` }} // Adjust position based on slider value
                                            >
                                                {mosaic?.toFixed(1)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="SetValueBox">
                                <p>
                                    Fliplr{" "}
                                    {/* <img
                                        src={require("../../assets/images/esclamination.png")}
                                        data-toggle="tooltip"
                                        title="Probabity of images to flip left to right during the time of training"
                                    /> */}
                                </p>
                                {/* <div className="form-group">
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name='fliplr'
                                            value={fliplr}
                                            checked={fliplr}
                                            onChange={inputHandler}
                                        />
                                        <span className="slider" />
                                    </label>
                                </div> */}
                                <div className="form-group">
                                    <div className="RangeBox">
                                        <div className="RangeHeading">
                                            <label>Min Val</label>
                                            <label>Max Value</label>
                                        </div>
                                        <div className='slider-container'>
                                            <Slider
                                                min={0}
                                                max={1}
                                                step={0.1}
                                                value={fliplr}
                                                onChange={(value) => updateIstate({ ...istate, fliplr: value })}
                                                className="custom-slider"
                                            />
                                            <div
                                                className="slider-value"
                                                style={{ left: `${(fliplr / 1) * 100}%` }} // Adjust position based on slider value
                                            >
                                                {fliplr?.toFixed(1)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="SetValueBox">
                                <p>
                                    Flipud{" "}
                                    {/* <img
                                        src={require("../../assets/images/esclamination.png")}
                                        data-toggle="tooltip"
                                        title="Probability of images to flip upside down at the time of training"
                                    /> */}
                                </p>
                                {/* <div className="form-group">
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name='flipud'
                                            value={flipud}
                                            checked={flipud}
                                            onChange={inputHandler}
                                        />
                                        <span className="slider" />
                                    </label>
                                </div> */}
                                <div className="form-group">
                                    <div className="RangeBox">
                                        <div className="RangeHeading">
                                            <label>Min Val</label>
                                            <label>Max Value</label>
                                        </div>
                                        <div className='slider-container'>
                                            <Slider
                                                min={0}
                                                max={1}
                                                step={0.1}
                                                value={flipud}
                                                onChange={(value) => updateIstate({ ...istate, flipud: value })}
                                                className="custom-slider"
                                            />
                                            <div
                                                className="slider-value"
                                                style={{ left: `${(flipud / 1) * 100}%` }} // Adjust position based on slider value
                                            >
                                                {flipud?.toFixed(1)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="SetValueBox">
                                <p>
                                    Validation Confidence{" "}
                                    {/* <img
                                        src={require("../../assets/images/esclamination.png")}
                                        data-toggle="tooltip"
                                        title="Confidence for validating training"
                                    /> */}
                                </p>
                                <div className="form-group">
                                    <div className="RangeBox">
                                        <div className="RangeHeading">
                                            <label>Min Val</label>
                                            <label>Max Value</label>
                                        </div>
                                        <div className='slider-container'>
                                            <Slider
                                                min={0}
                                                max={1}
                                                step={0.1}
                                                value={validation_conf}
                                                onChange={(value) => updateIstate({ ...istate, validation_conf: value })}
                                                className="custom-slider"
                                            />
                                            <div
                                                className="slider-value"
                                                style={{ left: `${(validation_conf / 1) * 100}%` }} // Adjust position based on slider value
                                            >
                                                {validation_conf?.toFixed(1)}
                                            </div>
                                        </div>
                                    </div>
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
                                        Single Class{" "}
                                        {/* <img
                                            src={require("../../assets/images/esclamination.png")}
                                            data-toggle="tooltip"
                                            title="Train the dataset as a single class. Effective in Defect Detection (scratches, dents, etc) as defect"
                                        /> */}
                                    </p>
                                    <div className="form-group">
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                name='single_cls'
                                                value={single_cls}
                                                checked={single_cls}
                                                onChange={inputHandler}

                                            />
                                            <span className="slider" />
                                        </label>
                                    </div>
                                </div>
                                <div className="SetValueBox">
                                    <p>
                                        Device{" "}
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
                                                    GPU
                                                    <input type="radio"
                                                        name="device"
                                                        value="0"
                                                        checked={device == "0" ? true : false}
                                                        onChange={inputHandler}
                                                    />
                                                    <span className="checkmark" />
                                                </label>
                                            </li>
                                            <li>
                                                <label className="Radio">
                                                    {" "}
                                                    CPU
                                                    <input
                                                        type="radio"
                                                        name="device"
                                                        value="cpu"
                                                        checked={device == "cpu" ? true : false}
                                                        onChange={inputHandler}
                                                    />
                                                    <span className="checkmark" />
                                                </label>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="SetValueBox">
                                    <p>
                                        Patience{" "}
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
                                            name="patience"
                                            value={patience}
                                            onWheel={(e) => e.target.blur()}
                                            onChange={inputHandler}
                                        />
                                    </div>
                                </div>
                                <div className="SetValueBox">
                                    <p>
                                        Close Mosaic{" "}
                                        {/* <img
                                            src={require("../../assets/images/esclamination.png")}
                                            data-toggle="tooltip"
                                            title="Add mosaicing in the last 10 epochs to mitigate overfitting."
                                        /> */}
                                    </p>
                                    {/* <div className="form-group">
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                name="close_mosaic"
                                                value={close_mosaic}
                                                checked={close_mosaic}
                                                onChange={inputHandler}
                                            />
                                            <span className="slider" />
                                        </label>
                                    </div> */}
                                    <div className="form-group">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Numeric Input"
                                            name="close_mosaic"
                                            value={close_mosaic}
                                            onWheel={(e) => e.target.blur()}
                                            onChange={inputHandler}
                                        />
                                    </div>
                                </div>
                                <div className="SetValueBox">
                                    <p>
                                        Dropout{" "}
                                        {/* <img
                                            src={require("../../assets/images/esclamination.png")}
                                            data-toggle="tooltip"
                                            title="Dropout"
                                        /> */}
                                    </p>
                                    {/* <div className="form-group">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Numeric Input"
                                            name="dropout"
                                            value={dropout}
                                            max={0.5}
                                            step="0.01"
                                            onWheel={(e) => e.target.blur()}
                                            onChange={inputHandler}
                                        />
                                    </div> */}
                                    <div className="form-group">
                                        <div className="RangeBox">
                                            <div className="RangeHeading">
                                                <label>Min Val</label>
                                                <label>Max Value</label>
                                            </div>
                                            <div className='slider-container'>
                                                <Slider
                                                    min={0}
                                                    max={0.5}
                                                    step={0.1}
                                                    value={dropout}
                                                    onChange={(value) => updateIstate({ ...istate, dropout: value })}
                                                    className="custom-slider"
                                                />
                                                <div
                                                    className="slider-value"
                                                    style={{ left: `${(dropout / 1) * 100}%` }} // Adjust position based on slider value
                                                >
                                                    {dropout?.toFixed(1)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div> : ""}
                    <div className="text-center" style={{ padding: "35px 0" }}>
                        {!advanced ? <a
                            role='button'
                            className="AdvanceSettingsCss "
                            onClick={(e) => updateIstate({ ...istate, advanced: TextTrackCueList })}
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
                                <a className="OutlineBtn">
                                    Cancel
                                </a>
                                <a className="ResetBtn" onClick={() => updateIstate(initialState)}>
                                    Reset
                                </a>
                                <a
                                    className="FillBtn"
                                    role='button'
                                    onClick={saveHandler}
                                    style={{ pointerEvents: loader ? 'none' : '' }}
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
                task="objectdetection"
                apiPoint="train_yolov8"
            />
        </>
    )
}

export default HyperTune
