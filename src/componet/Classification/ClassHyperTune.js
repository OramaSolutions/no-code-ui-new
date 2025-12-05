import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { commomObj } from '../../utils';
import { toast } from 'react-toastify';
import { hyperTune, HypetTuneModal } from '../../reduxToolkit/Slices/projectSlices';
import Slider from "rc-slider";
import TrainModel from '../Project/TrainModel';
import { ClasshyperTune, ClassHypetTuneModal, ReturnClassHypertune } from '../../reduxToolkit/Slices/classificationSlices';
import { getUrl } from '../../config/config';
const url = getUrl('classification')

const initialState = {
    imgsz: "640",
    batch: "12",
    epochs: "100",
    mosaic: null,
    patience: null,
    device: "0",
    fliplr: null,
    flipud: null,
    close_mosaic: null,
    // optimizer: '',
    // learning_rate: '',
    // dropout_rate: '',
    // momentum: '',
    erasing: '',
    advanced: 0,
    loader: false,
    openModal: false,
    isDirty: false,
    hsv_h: '',
    hsv_s: '',
    hsv_v: '',
    degrees: '',
    translate: '',
    scale: '',
    shear: '',
}

//   <div className="form-group">
//                                     <label>Optimizer</label>
//                                     <input type="text" className="form-control" name="optimizer" value={optimizer} onChange={inputHandler} />
//                                 </div>
//                                 <div className="form-group">
//                                     <label>Learning Rate</label>
//                                     <input type="text" className="form-control" name="learning_rate" value={learning_rate} onChange={inputHandler} />
//                                 </div>
//                                 <div className="form-group">
//                                     <label>Dropout Rate</label>
//                                     <input type="text" className="form-control" name="dropout_rate" value={dropout_rate} onChange={inputHandler} />
//                                 </div>
//                                 <div className="form-group">
//                                     <label>Momentum</label>
//                                     <input type="text" className="form-control" name="momentum" value={momentum} onChange={inputHandler} />
//                                 </div>

function ClassHyperTune({ onApply, state, userData, onChange }) {
    const dispatch = useDispatch();
    const [istate, updateIstate] = useState(initialState)
    const { loader, advanced, imgsz, batch, epochs, mosaic, patience, device, fliplr, flipud, close_mosaic, optimizer, learning_rate, dropout_rate, momentum, erasing, isDirty, pre_trained_model } = istate;
    const { classhypertuneModel } = useSelector((state) => state.classification)
    const { hasChangedSteps } = useSelector((state) => state.steps);

    //==========================================pre-trained model============================================
    useEffect(() => {
        const payload = {
            username: userData?.activeUser?.userName,
            version: state?.version,
            project: state?.name,
            task: "classification",
        }
        dispatch(ClassHypetTuneModal({
            payload, url
        }));
        const fetchData = async () => {
            try {
                const payload = {
                    username: userData?.activeUser?.userName,
                    version: state?.version,
                    project: state?.name,
                    task: "classification",
                }
                const res = await dispatch(ReturnClassHypertune({
                    payload, url
                }));
                if (res?.payload?.status === 200) {
                    updateIstate((prev) => ({
                        ...prev,
                        pre_trained_model: res?.payload?.data?.model_path?.split?.("/")?.at(-1) || "",
                        imgsz: res?.payload?.data?.imgsz || "640",
                        batch: res?.payload?.data?.batch || "12",
                        epochs: res?.payload?.data?.epochs || "100",
                        mosaic: res?.payload?.data?.mosaic || 0,
                        close_mosaic: res?.data?.payload?.close_mosaic || 0,
                        device: res?.payload?.data?.device || "0",
                        dropout: res?.payload?.data?.dropout || "0",
                        fliplr: res?.payload?.data?.fliplr || 0,
                        flipud: res?.payload?.data?.flipud || 0,
                        patience: res?.payload?.data?.patience || "0",
                        single_class: res?.payload?.data?.single_class || "False",
                        vaidation_conf: res?.payload?.data?.vaidation_conf || 0.25,
                        isDirty: true,
                    }))
                }
            } catch (err) {
                // console.log(err, "err hypertune")
            }
        }
        fetchData();
    }, []);
    //===========================================input handler==========================================
    const inputHandler = (e) => {
        const { name, value, checked, type } = e.target;
        if (type === 'checkbox') {
            updateIstate((prev) => ({ ...prev, [name]: checked ? 1 : 0, isDirty: false }))
        } else {
            updateIstate((prev) => ({ ...prev, [name]: value, isDirty: false }))
        }
    }
    //=============================================save handler========================================
    const saveHandler = async () => {
        // Scroll to model selection if not selected
        // console.log('pre_trained_model', pre_trained_model)
        if (!pre_trained_model) {
            toast.error("Please select a model type first.", commomObj);
            const modelSelect = document.getElementById("model-select-dropdown");
            if (modelSelect) {
                modelSelect.scrollIntoView({ behavior: "smooth", block: "center" });
                modelSelect.focus();
            }
            return;
        }
        if (isDirty) {
            onApply();
           
            return;
        }
     
        const formData = new FormData();
        formData.append("username", userData?.activeUser?.userName);
        formData.append("version", state?.version);
        formData.append("project", state?.name);
        formData.append("task", "classification");
        formData.append("model_name", pre_trained_model || "");
        formData.append("imgsz", imgsz);
        formData.append("batch", batch);
        formData.append("epochs", epochs);
        formData.append("mosaic", mosaic);
        formData.append("patience", patience);
        formData.append("device", device);
        formData.append("fliplr", fliplr);
        formData.append("flipud", flipud);
        formData.append("close_mosaic", close_mosaic);
        // formData.append("optimizer", optimizer);
        // formData.append("learning_rate", learning_rate);
        // formData.append("dropout_rate", dropout_rate);
        // formData.append("momentum", momentum);
        formData.append("erasing", erasing);
        formData.append("hsv_h", istate.hsv_h);
        formData.append("hsv_s", istate.hsv_s);
        formData.append("hsv_v", istate.hsv_v);
        formData.append("degrees", istate.degrees);
        formData.append("translate", istate.translate);
        formData.append("scale", istate.scale);
        formData.append("shear", istate.shear);
        try {
            updateIstate({ ...istate, loader: true })
            const response = await dispatch(ClasshyperTune({ payload:formData, url }))
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
        <div>
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
                                    <img src={require("../../assets/images/esclamination.png")} />
                                </span>
                            </label>
                            <select
                                className="form-control"
                                name='pre_trained_model'
                                onChange={inputHandler}
                                id="model-select-dropdown"
                            >
                                <option value="">Choose model type</option>
                                {classhypertuneModel?.classification?.length > 0 ?
                                    classhypertuneModel?.classification?.map((item, i) => {
                                        const itemm = item?.split?.('/')?.at(-1)
                                        return (
                                            <option key={itemm} value={itemm}>{itemm}</option>
                                        )
                                    }) : <option>No Data found.</option>
                                }
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Image Size</label>
                            <input type="text" className="form-control" name="imgsz" value={imgsz} onChange={inputHandler} />
                        </div>
                        <div className="form-group">
                            <label>Batch Size</label>
                            <input type="text" className="form-control" name="batch" value={batch} onChange={inputHandler} />
                        </div>
                        <div className="form-group">
                            <label>Epochs</label>
                            <input type="text" className="form-control" name="epochs" value={epochs} onChange={inputHandler} />
                        </div>
                        <div className="form-group">
                            <label>Mosaic <span className='text-xs text-gray-500'>Default 0</span></label>
                            <input type="text" className="form-control" name="mosaic" value={mosaic} onChange={inputHandler} />
                        </div>
                        <div className="form-group">
                            <label>Patience <span className='text-xs text-gray-500'>Default 20</span></label>
                            <input type="text" className="form-control" name="patience" value={patience} onChange={inputHandler} />
                        </div>
                        <div className="form-group">
                            <label>Device</label>
                            <select className="form-control" name="device" value={device} onChange={inputHandler}>
                                <option value="0">GPU</option>
                                <option value="cpu">CPU</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Flip LR <span className='text-xs text-gray-500'>Default 0</span></label>
                            <input type="text" className="form-control" name="fliplr" value={fliplr} onChange={inputHandler} />
                        </div>
                        <div className="form-group">
                            <label>Flip UD <span className='text-xs text-gray-500'>Default 0</span></label>
                            <input type="text" className="form-control" name="flipud" value={flipud} onChange={inputHandler} />
                        </div>
                        <div className="form-group">
                            <label>Erasing <span className='text-xs text-gray-500'>Default 0</span></label>
                            <input type="text" className="form-control" name="erasing" value={erasing} onChange={inputHandler} />
                        </div>
                        {advanced ? (
                            <div>

                                <div className="form-group">
                                    <label>Close Mosaic <span className='text-xs text-gray-500'>Default 10</span></label>
                                    <input type="text" className="form-control" name="close_mosaic" value={close_mosaic} onChange={inputHandler} />
                                </div>
                                <div className="form-group">
                                    <label>HSV H <span className='text-xs text-gray-500'>Default 0</span></label>
                                    <input type="text" className="form-control" name="hsv_h" value={istate.hsv_h} onChange={inputHandler} />
                                </div>
                                <div className="form-group">
                                    <label>HSV S <span className='text-xs text-gray-500'>Default 0</span></label>
                                    <input type="text" className="form-control" name="hsv_s" value={istate.hsv_s} onChange={inputHandler} />
                                </div>
                                <div className="form-group">
                                    <label>HSV V <span className='text-xs text-gray-500'>Default 0</span></label>
                                    <input type="text" className="form-control" name="hsv_v" value={istate.hsv_v} onChange={inputHandler} />
                                </div>
                                <div className="form-group">
                                    <label>Degrees <span className='text-xs text-gray-500'>Default 0</span></label>
                                    <input type="text" className="form-control" name="degrees" value={istate.degrees} onChange={inputHandler} />
                                </div>
                                <div className="form-group">
                                    <label>Translate <span className='text-xs text-gray-500'>Default 0</span></label>
                                    <input type="text" className="form-control" name="translate" value={istate.translate} onChange={inputHandler} />
                                </div>
                                <div className="form-group">
                                    <label>Scale <span className='text-xs text-gray-500'>Default 0</span></label>
                                    <input type="text" className="form-control" name="scale" value={istate.scale} onChange={inputHandler} />
                                </div>
                                <div className="form-group">
                                    <label>Shear <span className='text-xs text-gray-500'>Default 0</span></label>
                                    <input type="text" className="form-control" name="shear" value={istate.shear} onChange={inputHandler} />
                                </div>
                            </div>
                        ) : null}
                    </form>
                    <div className="text-center" style={{ padding: "35px 0" }}>
                        {advanced ? (
                            <a role='button' className="AdvanceSettingsCss" onClick={() => updateIstate({ ...istate, advanced: 0 })}>
                                Hide Advanced Settings
                            </a>
                        ) : (
                            <a role='button' className="AdvanceSettingsCss" onClick={() => updateIstate({ ...istate, advanced: 1 })}>
                                Show Advanced Settings
                            </a>
                        )}
                    </div>
                    <div className="row">
                        <div className="col-lg-7 mx-auto">
                            <div className="TwoButtons">
                                <a className="OutlineBtn">Cancel</a>
                                <a className="ResetBtn" onClick={() => updateIstate(initialState)}>Reset</a>
                                <a className="FillBtn" role='button' onClick={saveHandler} style={{ pointerEvents: loader ? 'none' : '' }}>Apply</a>
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
                task="classification"
                apiPoint="train_yolov8_cls"
            />
        </div>
    )
}

export default ClassHyperTune
