import React, { useState, useRef, useEffect } from 'react'
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';
import CustomHandle from '../../commonComponent/Tooltip';
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { commomObj } from '../../utils';
import ImportAgumentaion from '../Project/ImportAgumentaion'

import { ClassAugumentedData, ReturnClassAgumentation } from '../../reduxToolkit/Slices/classificationSlices';
import { getUrl } from '../../config/config';
const url = getUrl('classification')
const initialState = {
    rotation: false,
    crop: false,
    verticalFlip: false,
    horizontalFlip: false,
    brightness: false,
    contrast: false,
    stauration: false,
    noise: false,
    blur: false,
    rotate_limit: 0,
    rotate_prob: 0,
    vertical_flip_prob: 0,
    horizontal_flip_prob: 0,
    brightness_limit: 0,
    brightness_prob: 0,
    contrast_limit: 0,
    contrast_prob: 0,
    hue_saturation_limit: 0,
    hue_saturation_prob: 0,
    gauss_noise_var_limit: 0,
    gauss_noise_prob: 0,
    blur_limit: 0,
    blur_prob: 0,
    cropVal: 0,

    cropProb: 0,
    num_of_images_to_be_generated: "1",
    openModal: false,
    onClose: false,
    isDirty: false,
}

function Classagumentation({ initial, setIstate, state, userData, onApply, onChange }) {
    const { hasChangedSteps } = useSelector((state) => state.steps);
    const DatasetSize = JSON.parse(window.localStorage.getItem("ClassDataSize")) || {}
    const [iState, updateIstate] = useState(initialState)
    const { openModal, onClose, cropProb, cropVal, rotation, crop, verticalFlip, horizontalFlip, brightness, contrast, stauration, noise, blur, rotate_limit, rotate_prob, vertical_flip_prob, horizontal_flip_prob, brightness_limit, brightness_prob, contrast_limit, contrast_prob, hue_saturation_limit, hue_saturation_prob, gauss_noise_var_limit, gauss_noise_prob, blur_limit, blur_prob, num_of_images_to_be_generated, isDirty } = iState
    const abortControllerReff = useRef();
    const dispatch = useDispatch()
    // console.log(hasChangedSteps, "hasChangedSteps Agumentation")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const payload = {
                    username: userData?.activeUser?.userName,
                    version: state?.version,
                    project: state?.name,
                    task: "classification",
                }
                const res = await dispatch(ReturnClassAgumentation({
                    payload, url
                }));
                if (res?.payload?.status === 200) {
                    updateIstate((prev) => ({
                        ...prev,
                        rotation: res?.payload?.data?.augmentations?.augmentations?.rotate_limit ? true : false,
                        crop: res?.payload?.data?.augmentations?.augmentations?.crop?.xmax ? true : false,
                        verticalFlip: res?.payload?.data?.augmentations?.augmentations?.vertical_flip_prob ? true : false,
                        horizontalFlip: res?.payload?.data?.augmentations?.augmentations?.horizontal_flip_prob ? true : false,
                        brightness: res?.payload?.data?.augmentations?.augmentations?.brightness_limit?.[1] ? true : false,
                        contrast: res?.payload?.data?.augmentations?.augmentations?.contrast_limit?.[1] ? true : false,
                        stauration: res?.payload?.data?.augmentations?.augmentations?.hue_saturation_limit?.[1] ? true : false,
                        noise: res?.payload?.data?.augmentations?.augmentations?.gauss_noise_var_limit?.[1] ? true : false,
                        blur: res?.payload?.data?.augmentations?.augmentations?.blur_limit?.[1] ? true : false,
                        rotate_limit: res?.payload?.data?.augmentations?.augmentations?.rotate_limit || 0,
                        rotate_prob: res?.payload?.data?.augmentations?.augmentations?.rotate_prob || 0,
                        vertical_flip_prob: res?.payload?.data?.augmentations?.augmentations?.vertical_flip_prob || 0,
                        horizontal_flip_prob: res?.payload?.data?.augmentations?.augmentations?.horizontal_flip_prob || 0,
                        brightness_limit: res?.payload?.data?.augmentations?.augmentations?.brightness_limit?.[1] || 5,
                        brightness_prob: res?.payload?.data?.augmentations?.augmentations?.brightness_prob || 0,
                        contrast_limit: res?.payload?.data?.augmentations?.augmentations?.contrast_limit?.[1] || 5,
                        contrast_prob: res?.payload?.data?.augmentations?.augmentations?.contrast_prob || 0,
                        hue_saturation_limit: res?.payload?.data?.augmentations?.augmentations?.hue_saturation_limit?.[1] || 5,
                        hue_saturation_prob: res?.payload?.data?.augmentations?.augmentations?.hue_saturation_prob || 0,
                        gauss_noise_var_limit: res?.payload?.data?.augmentations?.augmentations?.gauss_noise_var_limit?.[1] || 0,
                        gauss_noise_prob: res?.payload?.data?.augmentations?.augmentations?.gauss_noise_prob || 0,
                        blur_limit: res?.payload?.data?.augmentations?.augmentations?.blur_limit?.[1] || 0,
                        blur_prob: res?.payload?.data?.augmentations?.augmentations?.blur_prob || 0,
                        cropVal: res?.payload?.data?.augmentations?.augmentations?.cropVal || 0,

                        num_of_images_to_be_generated: res?.payload?.data?.num_of_images_to_be_generated || "1",
                        cropProb: res?.payload?.data?.augmentations?.crop?.p || 0,
                        isDirty: true,
                    }))
                }
            } catch (err) {
                toast.error("Oops! Something went wrong", commomObj)
            }
        }
        fetchData();
    }, [])

    const checkHandler = (e) => {
        const { name, checked, value } = e.target;
        if (name == "num_of_images_to_be_generated") {
            updateIstate({ ...iState, [name]: value, isDirty: false })
        } else {
            updateIstate({ ...iState, [name]: checked, isDirty: false })
        }
    }
    const inputHandler = (value, name) => {
        // console.log('val and name', value, name)
        updateIstate({ ...iState, [name]: value, isDirty: false })
    }
    const saveHandler = async () => {
        if (isDirty || hasChangedSteps?.augumented == false) {
            window.localStorage.setItem("AgumentedSize", (DatasetSize?.Size) * num_of_images_to_be_generated)
            onApply()
            return;
        }
        if (!num_of_images_to_be_generated) {
            toast.error("Please Selelct The no. of Images to be generated", commomObj)
        }
        else {
            try {
                abortControllerReff.current = new AbortController();
                updateIstate({ ...iState, openModal: true })
                const augmentations = {
                    ...(rotation ? {
                        rotate_limit,
                        rotate_prob
                    } : {}),

                    ...(verticalFlip ? {
                        vertical_flip_prob
                    } : {}),

                    ...(horizontalFlip ? {
                        horizontal_flip_prob
                    } : {}),

                    ...(brightness ? {
                        brightness_limit,
                        brightness_prob
                    } : {}),

                    ...(contrast ? {
                        contrast_limit,
                        contrast_prob
                    } : {}),

                    // ...(stauration ? {
                    //     hue_saturation_limit: [0, hue_saturation_limit],
                    //     hue_saturation_prob
                    // } : {}),

                    // ...(noise ? {
                    //     gauss_noise_var_limit: [0, gauss_noise_var_limit],
                    //     gauss_noise_prob
                    // } : {}),

                    ...(blur ? {
                        blur_limit,
                        blur_prob
                    } : {}),

                    ...(crop ? {
                        crop: {
                            p: cropProb,
                            cropVal
                        }
                    } : {}),
                };

                const jsonString = JSON.stringify(augmentations);
                const formData = new FormData();
                formData.append("username", userData?.activeUser?.userName);
                formData.append("version", state?.version);
                formData.append("project", state?.name);
                formData.append("task", "classification");
                formData.append("json_data", jsonString);
                formData.append("multiplier", num_of_images_to_be_generated || 1);
                const response = await dispatch(ClassAugumentedData({ payload:formData, signal: abortControllerReff.current.signal, url }))
                if (response?.payload?.code === 201) {
                    updateIstate({ ...iState, openModal: false })
                    toast.success(response?.payload?.message, commomObj)
                    window.localStorage.setItem("AgumentedSize", (DatasetSize?.Size) * num_of_images_to_be_generated)
                    onChange();
                    onApply()
                } else {
                    toast.error(response?.payload?.message, commomObj)
                    updateIstate({ ...iState, openModal: true, onClose: true })
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    updateIstate({ ...iState, openModal: true, onClose: false })
                } else {
                    console.error("Error uploading file:", error);
                    toast.error("Something went Wrong", commomObj)
                    updateIstate({ ...iState, openModal: true, onClose: true })
                }
            }
        }
    }
    const resetHandler = () => {
        updateIstate(initialState)
    }
    const handleCancel = () => {
        if (abortControllerReff?.current) {
            abortControllerReff?.current?.abort();
            // console.log('agumentation operation aborted');
        }
    };
    return (
        <div>
            <div className="Small-Wrapper">
                <h6 className="Remarks">Add Augmentations</h6>
                <h6>Note-</h6>
                <p>*Apply augmentations to increase dataset size and improve accuracy. Minimum generated images should be around 500 to get decent results.</p>
                <div className="CommonForm">
                    <form>
                        <fieldset disabled="">
                            <div className="form-group">
                                <label>
                                    Size of Data Set{" "}
                                    <span
                                        className="EsclamSpan"
                                        data-toggle="tooltip"
                                        title="Total uploaded images"
                                    >
                                        <img src={require("../../assets/images/esclamination.png")} />
                                    </span>
                                </label>
                                <input type="text" className="form-control" value={DatasetSize?.Size || 0} disabled={true} />
                            </div>
                        </fieldset>
                        <div className="form-group">
                            <label>
                                Enter the Multiplier for no. of Images to be Generated:{" "}
                                <span
                                    className="EsclamSpan"
                                    data-toggle="tooltip"
                                    title="desired dataset size after augmentation"
                                >
                                    <img src={require("../../assets/images/esclamination.png")} />
                                </span>
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter no. of Images to be Generated"
                                name='num_of_images_to_be_generated'
                                value={num_of_images_to_be_generated}
                                onWheel={(e) => e.target.blur()}
                                onChange={checkHandler}
                            />
                        </div>
                        <h6 className="Remarks">Select the Augmentations</h6>
                        <div className="AugmentationsBox">
                            <div className="form-group">
                                <label className="CheckBox">
                                    {" "}

                                    Rotation
                                    <img
                                        src={require("../../assets/images/esclamination.png")}
                                        data-toggle="tooltip"
                                        title="Rotate the image by certain degress. Helpful if object orientation keeps changing"
                                    />
                                    <input
                                        type="checkbox"
                                        name='rotation'
                                        checked={rotation}
                                        onChange={checkHandler}
                                    />
                                    <span className="checkmark" />
                                </label>
                            </div>
                            <div className="RangeArea">
                                <h1>Degree</h1>
                                <div className="RangeBox">
                                    <div className="RangeHeading">
                                        <label>Min. Val</label>
                                        <label>Max. Val</label>
                                    </div>
                                    <div className='slider-container'>
                                        <Slider
                                            min={0}
                                            max={45}
                                            step={1}
                                            value={rotate_limit}
                                            onChange={(value) => inputHandler(value, "rotate_limit")}
                                            className="custom-slider"
                                        // disabled={!rotation}
                                        />
                                        <div
                                            className="slider-value"
                                            style={{ left: `${(rotate_limit / 45) * 100}%` }} // Adjust position based on slider value
                                        >
                                            {rotate_limit?.toFixed(1)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="RangeArea">
                                <h1>Probabiliy</h1>
                                <div className="RangeBox">
                                    <div className="RangeHeading">
                                        <label>Min. Val</label>
                                        <label>Max. Val</label>
                                    </div>
                                    <div className='slider-container'>
                                        <Slider
                                            min={0}
                                            max={1}
                                            step={0.1}
                                            value={rotate_prob}
                                            onChange={(value) => inputHandler(value, "rotate_prob")}
                                            className="custom-slider"
                                            handle={CustomHandle}
                                        />
                                        <div
                                            className="slider-value"
                                            style={{ left: `${(rotate_prob / 1) * 100}%` }} // Adjust position based on slider value
                                        >
                                            {rotate_prob?.toFixed(1)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h1
                                style={{
                                    color: "#070E05",
                                    fontSize: 18,
                                    margin: "0 0 30px 0",
                                    fontStyle: "italic"
                                }}
                            >
                                Preview Augmented Sample Images
                            </h1>
                            <ul className="PreviewAugment">
                                <li>
                                    <figure>
                                        {DatasetSize?.image && <img src={DatasetSize?.image} />}
                                    </figure>
                                </li>
                                <li>
                                    <figure>
                                        <img
                                            src={DatasetSize?.image}
                                            alt="Augmented"
                                            style={{
                                                transform: rotation ? `rotate(${rotate_limit}deg)` : "",
                                            }}
                                        />
                                    </figure>
                                </li>
                            </ul>
                        </div>
                        <div className="AugmentationsBox">
                            <div className="form-group">
                                <label className="CheckBox">
                                    {" "}
                                    Crop
                                    <img
                                        src={require("../../assets/images/esclamination.png")}
                                        data-toggle="tooltip"
                                        title="Zoom the image and apply this if object distance keeps changing"
                                    />
                                    <input
                                        type="checkbox"
                                        name='crop'
                                        checked={crop}
                                        onChange={checkHandler}
                                    />
                                    <span className="checkmark" />
                                </label>
                            </div>
                            <div className="RangeArea">
                                <h1>Crop</h1>
                                <div className="RangeBox">
                                    <div className="RangeHeading">
                                        <label>Min. Val</label>
                                        <label>Max. Val</label>
                                    </div>
                                    <div className='slider-container'>
                                        <Slider
                                            min={0}
                                            max={0.5}
                                            step={0.01}
                                            value={cropVal}
                                            onChange={(value) => inputHandler(value, "cropVal")}
                                            className="custom-slider"
                                        />
                                        <div
                                            className="slider-value"
                                            style={{ left: `${(cropVal / 800) * 100}%` }} // Adjust position based on slider value
                                        >
                                            {cropVal?.toFixed(1)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="RangeArea">
                                <h1>Probabiliy</h1>
                                <div className="RangeBox">
                                    <div className="RangeHeading">
                                        <label>Min. Val</label>
                                        <label>Max. Val</label>
                                    </div>
                                    <div className='slider-container'>
                                        <Slider
                                            min={0}
                                            max={1}
                                            step={0.1}
                                            value={cropProb}
                                            onChange={(value) => inputHandler(value, "cropProb")}
                                            className="custom-slider"
                                        />
                                        <div
                                            className="slider-value"
                                            style={{ left: `${(cropProb / 1) * 100}%` }} // Adjust position based on slider value
                                        >
                                            {cropProb?.toFixed(1)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h1
                                style={{
                                    color: "#070E05",
                                    fontSize: 18,
                                    margin: "0 0 30px 0",
                                    fontStyle: "italic"
                                }}
                            >
                                Preview Augmented Sample Images
                            </h1>
                            <ul className="PreviewAugment">
                                <li>
                                    <figure>
                                        <img src={DatasetSize?.image} />
                                    </figure>
                                </li>
                                <li>
                                    <figure style={{
                                        width: '100%', // or inherit from parent/container
                                        height: '100%', // or set a maxHeight if needed
                                        overflow: 'hidden',
                                        margin: 0,
                                        padding: 0,
                                        position: 'relative'
                                    }}>
                                        <img
                                            src={DatasetSize?.image}
                                            style={crop ? {
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transform: `scale(${1 / (1 - 2 * cropVal)})`,
                                                transformOrigin: 'center center'
                                            } : {}}
                                        />
                                    </figure>
                                </li>
                            </ul>
                        </div>
                        <div className="AugmentationsBox">
                            <div className="form-group">
                                <label className="CheckBox">
                                    {" "}
                                    Vertical Flip
                                    <img
                                        src={require("../../assets/images/esclamination.png")}
                                        data-toggle="tooltip"
                                        title="mirrors the image on vertical axis"
                                    />
                                    <input type="checkbox"
                                        name='verticalFlip'
                                        checked={verticalFlip}
                                        onChange={checkHandler}
                                    />
                                    <span className="checkmark" />
                                </label>
                            </div>
                            <div className="RangeArea">
                                <h1>Probabiliy</h1>
                                <div className="RangeBox">
                                    <div className="RangeHeading">
                                        <label>Min. Val</label>
                                        <label>Max. Val</label>
                                    </div>
                                    <div className='slider-container'>
                                        <Slider
                                            min={0}
                                            max={1}
                                            step={0.1}
                                            value={vertical_flip_prob}
                                            onChange={(value) => inputHandler(value, "vertical_flip_prob")}
                                            className="custom-slider"
                                        />
                                        <div
                                            className="slider-value"
                                            style={{ left: `${(vertical_flip_prob / 1) * 100}%` }} // Adjust position based on slider value
                                        >
                                            {vertical_flip_prob.toFixed(1)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h1
                                style={{
                                    color: "#070E05",
                                    fontSize: 18,
                                    margin: "0 0 30px 0",
                                    fontStyle: "italic"
                                }}
                            >
                                Preview Augmented Sample Images
                            </h1>
                            <ul className="PreviewAugment">
                                <li>
                                    <figure>
                                        <img src={DatasetSize?.image} />
                                    </figure>
                                </li>
                                <li>
                                    <figure>
                                        <img
                                            src={DatasetSize?.image}
                                            style={{
                                                transform: verticalFlip ? "scaleY(-1)" : "",
                                            }}
                                        />
                                    </figure>
                                </li>
                            </ul>
                        </div>
                        <div className="AugmentationsBox">
                            <div className="form-group">
                                <label className="CheckBox">
                                    {" "}
                                    Horizontal Flip
                                    <img
                                        src={require("../../assets/images/esclamination.png")}
                                        data-toggle="tooltip"
                                        title="mirrors the image on Horizontal axis"
                                    />
                                    <input
                                        type="checkbox"
                                        name='horizontalFlip'
                                        checked={horizontalFlip}
                                        onChange={checkHandler}
                                    />
                                    <span className="checkmark" />
                                </label>
                            </div>
                            <div className="RangeArea">
                                <h1>Probabiliy</h1>
                                <div className="RangeBox">
                                    <div className="RangeHeading">
                                        <label>Min. Val</label>
                                        <label>Max. Val</label>
                                    </div>
                                    <div className='slider-container'>
                                        <Slider
                                            min={0}
                                            max={1}
                                            step={0.1}
                                            value={horizontal_flip_prob}
                                            onChange={(value) => inputHandler(value, "horizontal_flip_prob")}
                                            className="custom-slider"
                                        />
                                        <div
                                            className="slider-value"
                                            style={{ left: `${(horizontal_flip_prob / 1) * 100}%` }} // Adjust position based on slider value
                                        >
                                            {horizontal_flip_prob.toFixed(1)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h1
                                style={{
                                    color: "#070E05",
                                    fontSize: 18,
                                    margin: "0 0 30px 0",
                                    fontStyle: "italic"
                                }}
                            >
                                Preview Augmented Sample Images
                            </h1>
                            <ul className="PreviewAugment">
                                <li>
                                    <figure>
                                        <img src={DatasetSize?.image} />
                                    </figure>
                                </li>
                                <li>
                                    <figure>
                                        <img
                                            src={DatasetSize?.image}
                                            style={{
                                                transform: horizontalFlip ? "scaleX(-1)" : "",
                                            }}
                                        />

                                    </figure>
                                </li>
                            </ul>
                        </div>
                        <div className="AugmentationsBox">
                            <div className="form-group">
                                <label className="CheckBox">
                                    {" "}
                                    Brightness
                                    <img
                                        src={require("../../assets/images/esclamination.png")}
                                        data-toggle="tooltip"
                                        title="Brighten and darken the image by a cerain value. Hepful if lighting keeps changing"
                                    />
                                    <input
                                        type="checkbox"
                                        name='brightness'
                                        checked={brightness}
                                        onChange={checkHandler}
                                    />
                                    <span className="checkmark" />
                                </label>
                            </div>
                            <div className="RangeArea">
                                <h1>Value</h1>
                                <div className="RangeBox">
                                    <div className="RangeHeading">
                                        <label>Min. Val </label>
                                        <label>Max. Val</label>
                                    </div>
                                    <div className='slider-container'>
                                        <Slider
                                            min={-20}
                                            max={20}
                                            step={1}
                                            value={brightness_limit}
                                            onChange={(value) => inputHandler(value, "brightness_limit")}
                                            className="custom-slider"
                                        />
                                        <div
                                            className="slider-value"
                                            style={{ left: `${((brightness_limit + 20) / 40) * 100}%` }}
                                        >
                                            {brightness_limit.toFixed(1)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="RangeArea">
                                <h1>Probabiliy</h1>
                                <div className="RangeBox">
                                    <div className="RangeHeading">
                                        <label>Min. Val</label>
                                        <label>Max. Val</label>
                                    </div>
                                    <div className='slider-container'>
                                        <Slider
                                            min={0}
                                            max={1}
                                            step={0.1}
                                            value={brightness_prob}
                                            onChange={(value) => inputHandler(value, "brightness_prob")}
                                            className="custom-slider"
                                        />
                                        <div
                                            className="slider-value"
                                            style={{ left: `${(brightness_prob / 1) * 100}%` }} // Adjust position based on slider value
                                        >
                                            {brightness_prob.toFixed(1)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h1
                                style={{
                                    color: "#070E05",
                                    fontSize: 18,
                                    margin: "0 0 30px 0",
                                    fontStyle: "italic"
                                }}
                            >
                                Preview Augmented Sample Images
                            </h1>
                            <ul className="PreviewAugment">
                                <li>
                                    <figure>
                                        <img src={DatasetSize?.image} />
                                    </figure>
                                </li>
                                <li>
                                    <figure>
                                        <img
                                            src={DatasetSize?.image}
                                            style={
                                                brightness
                                                    ? { filter: `brightness(${1 + brightness_limit / 100})` }
                                                    : {}
                                            }
                                        />
                                    </figure>
                                </li>
                            </ul>
                        </div>
                        <div className="AugmentationsBox">
                            <div className="form-group">
                                <label className="CheckBox">
                                    {" "}
                                    Contrast
                                    <img
                                        src={require("../../assets/images/esclamination.png")}
                                        data-toggle="tooltip"
                                        title="Increase the contrast and helpful if lighting keeps changing and objects appear diffrent"
                                    />
                                    <input
                                        type="checkbox"
                                        name='contrast'
                                        checked={contrast}
                                        onChange={checkHandler}
                                    />
                                    <span className="checkmark" />
                                </label>
                            </div>
                            <div className="RangeArea">
                                <h1>Value</h1>
                                <div className="RangeBox">
                                    <div className="RangeHeading">
                                        <label>Min. Val</label>
                                        <label>Max. Val</label>
                                    </div>
                                    <div className='slider-container'>
                                        <Slider
                                            min={0}
                                            max={10}
                                            step={0.1}
                                            value={contrast_limit}
                                            onChange={(value) => inputHandler(value, "contrast_limit")}
                                            className="custom-slider"
                                        />
                                        <div
                                            className="slider-value"
                                            style={{ left: `${(contrast_limit / 10) * 100}%` }} // Adjust position based on slider value
                                        >
                                            {contrast_limit.toFixed(1)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="RangeArea">
                                <h1>Probabiliy</h1>
                                <div className="RangeBox">
                                    <div className="RangeHeading">
                                        <label>Min. Val</label>
                                        <label>Max. Val</label>
                                    </div>
                                    <div className='slider-container'>
                                        <Slider
                                            min={0}
                                            max={1}
                                            step={0.1}
                                            value={contrast_prob}
                                            onChange={(value) => inputHandler(value, "contrast_prob")}
                                            className="custom-slider"
                                        />
                                        <div
                                            className="slider-value"
                                            style={{ left: `${(contrast_prob / 1) * 100}%` }} // Adjust position based on slider value
                                        >
                                            {contrast_prob.toFixed(1)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h1
                                style={{
                                    color: "#070E05",
                                    fontSize: 18,
                                    margin: "0 0 30px 0",
                                    fontStyle: "italic"
                                }}
                            >
                                Preview Augmented Sample Images
                            </h1>
                            <ul className="PreviewAugment">
                                <li>
                                    <figure>
                                        <img src={DatasetSize?.image} />
                                    </figure>
                                </li>
                                <li>
                                    <figure>
                                        <img
                                            src={DatasetSize?.image}
                                            style={{ filter: contrast ? `contrast(${contrast_limit * 20}%)` : {} }}
                                        />
                                    </figure>
                                </li>
                            </ul>
                        </div>
                        {/* <div className="AugmentationsBox">
                            <div className="form-group">
                                <label className="CheckBox">
                                    {" "}
                                    Saturation
                                    <img
                                        src={require("../../assets/images/esclamination.png")}
                                        data-toggle="tooltip"
                                        title="Changes the saturation of the image and helpful if shape remains the same but color changes"
                                    />
                                    <input
                                        type="checkbox"
                                        name='stauration'
                                        checked={stauration}
                                        onChange={checkHandler}
                                    />
                                    <span className="checkmark" />
                                </label>
                            </div>
                            <div className="RangeArea">
                                <h1>Value</h1>
                                <div className="RangeBox">
                                    <div className="RangeHeading">
                                        <label>Min. Val</label>
                                        <label>Max. Val</label>
                                    </div>
                                    <div className='slider-container'>
                                        <Slider
                                            min={0}
                                            max={10}
                                            step={0.1}
                                            value={hue_saturation_limit}
                                            onChange={(value) => inputHandler(value, "hue_saturation_limit")}
                                            className="custom-slider"
                                        />
                                        <div
                                            className="slider-value"
                                            style={{ left: `${(hue_saturation_limit / 10) * 100}%` }}                                         >
                                            {hue_saturation_limit.toFixed(1)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="RangeArea">
                                <h1>Probabiliy</h1>
                                <div className="RangeBox">
                                    <div className="RangeHeading">
                                        <label>Min. Val</label>
                                        <label>Max. Val</label>
                                    </div>
                                    <div className='slider-container'>
                                        <Slider
                                            min={0}
                                            max={1}
                                            step={0.1}
                                            value={hue_saturation_prob}
                                            onChange={(value) => inputHandler(value, "hue_saturation_prob")}
                                            className="custom-slider"
                                        />
                                        <div
                                            className="slider-value"
                                            style={{ left: `${(hue_saturation_prob / 1) * 100}%` }}
                                        >
                                            {hue_saturation_prob.toFixed(1)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h1
                                style={{
                                    color: "#070E05",
                                    fontSize: 18,
                                    margin: "0 0 30px 0",
                                    fontStyle: "italic"
                                }}
                            >
                                Preview Augmented Sample Images
                            </h1>
                            <ul className="PreviewAugment">
                                <li>
                                    <figure>
                                        <img src={DatasetSize?.image} />
                                    </figure>
                                </li>
                                <li>
                                    <figure>
                                        <img
                                            src={DatasetSize?.image}
                                            style={{

                                                filter: stauration ? `saturate(${hue_saturation_limit})` : {}
                                            }}
                                        />
                                    </figure>
                                </li>
                            </ul>
                        </div> */}
                        <div className="AugmentationsBox">
                            <div className="form-group">
                                <label className="CheckBox">
                                    {" "}
                                    Noise{" "}
                                    <img
                                        src={require("../../assets/images/esclamination.png")}
                                        data-toggle="tooltip"
                                        title="Add noise to image and this is helpful in outdoor conditions or where noise keeps coming (0.5 pixels is optimal)"
                                    />
                                    <input
                                        type="checkbox"
                                        name='noise'
                                        checked={noise}
                                        onChange={checkHandler}
                                    />
                                    <span className="checkmark" />
                                </label>
                            </div>
                            <div className="RangeArea">
                                <h1>Pixel</h1>
                                <div className="RangeBox">
                                    <div className="RangeHeading">
                                        <label>Min. Val</label>
                                        <label>Max. Val</label>
                                    </div>
                                    <div className='slider-container'>
                                        <Slider
                                            min={0}
                                            max={5}
                                            step={0.1}
                                            value={gauss_noise_var_limit}
                                            onChange={(value) => inputHandler(value, "gauss_noise_var_limit")}
                                            className="custom-slider"
                                        />
                                        <div
                                            className="slider-value"
                                            style={{ left: `${(gauss_noise_var_limit / 5) * 100}%` }}
                                        >
                                            {gauss_noise_var_limit.toFixed(1)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="RangeArea">
                                <h1>Probabiliy</h1>
                                <div className="RangeBox">
                                    <div className="RangeHeading">
                                        <label>Min. Val</label>
                                        <label>Max. Val</label>
                                    </div>
                                    <div className='slider-container'>
                                        <Slider
                                            min={0}
                                            max={1}
                                            step={0.1}
                                            value={gauss_noise_prob}
                                            onChange={(value) => inputHandler(value, "gauss_noise_prob")}
                                            className="custom-slider"
                                        />
                                        <div
                                            className="slider-value"
                                            style={{ left: `${(gauss_noise_prob / 1) * 100}%` }}
                                        >
                                            {gauss_noise_prob.toFixed(1)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h1
                                style={{
                                    color: "#070E05",
                                    fontSize: 18,
                                    margin: "0 0 30px 0",
                                    fontStyle: "italic"
                                }}
                            >
                                Preview Augmented Sample Images
                            </h1>
                            <ul className="PreviewAugment">
                                <li>
                                    <figure>
                                        <img src={DatasetSize?.image} />
                                    </figure>
                                </li>
                                <li>
                                    <figure>
                                        <img
                                            src={DatasetSize?.image}
                                            style={{
                                                filter: noise ? `contrast(${gauss_noise_var_limit}) brightness(${1 / gauss_noise_var_limit})` : "",
                                            }}
                                        />
                                    </figure>
                                </li>
                            </ul>
                        </div>
                        <div className="AugmentationsBox">
                            <div className="form-group">
                                <label className="CheckBox">
                                    {" "}
                                    Blur
                                    <img
                                        src={require("../../assets/images/esclamination.png")}
                                        data-toggle="tooltip"
                                        title="Blurs the image and this is helpful if the object is high speed"
                                    />
                                    <input
                                        type="checkbox"
                                        name='blur'
                                        checked={blur}
                                        onChange={checkHandler}
                                    />
                                    <span className="checkmark" />
                                </label>
                            </div>
                            <div className="RangeArea">
                                <h1>Pixel</h1>
                                <div className="RangeBox">
                                    <div className="RangeHeading">
                                        <label>Min. Val</label>
                                        <label>Max. Val</label>
                                    </div>
                                    <div className='slider-container'>
                                        <Slider
                                            min={0}
                                            max={1}
                                            step={0.1}
                                            value={blur_limit}
                                            onChange={(value) => inputHandler(value, "blur_limit")}
                                            className="custom-slider"
                                        />
                                        <div
                                            className="slider-value"
                                            style={{ left: `${(blur_limit) * 100}%` }}
                                        >
                                            {blur_limit.toFixed(1)}px
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="RangeArea">
                                <h1>Probabiliy</h1>
                                <div className="RangeBox">
                                    <div className="RangeHeading">
                                        <label>Min. Val</label>
                                        <label>Max. Val</label>
                                    </div>
                                    <div className='slider-container'>
                                        <Slider
                                            min={0}
                                            max={1}
                                            step={0.1}
                                            value={blur_prob}
                                            onChange={(value) => inputHandler(value, "blur_prob")}
                                            className="custom-slider"
                                        />
                                        <div
                                            className="slider-value"
                                            style={{ left: `${(blur_prob / 1) * 100}%` }} // Adjust position based on slider value
                                        >
                                            {blur_prob.toFixed(1)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h1
                                style={{
                                    color: "#070E05",
                                    fontSize: 18,
                                    margin: "0 0 30px 0",
                                    fontStyle: "italic"
                                }}
                            >
                                Preview Augmented Sample Images
                            </h1>
                            <ul className="PreviewAugment">
                                <li>
                                    <figure>
                                        <img src={DatasetSize?.image} />
                                    </figure>
                                </li>
                                <li>
                                    <figure>
                                        <img
                                            src={DatasetSize?.image}
                                            style={{
                                                filter: blur ? `blur(${blur_limit}px)` : "",
                                            }}
                                        />
                                    </figure>
                                </li>
                            </ul>
                        </div>
                    </form>
                    <div className="row">
                        <div className="col-lg-7 mx-auto">
                            <div className="TwoButtons">
                                <a className="OutlineBtn" role='button' onClick={handleCancel}>
                                    Cancel
                                </a>
                                <a role="button" onClick={resetHandler} className="ResetBtn">
                                    Reset
                                </a>
                                <a role='button' className="FillBtn" onClick={saveHandler}>
                                    Apply
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <ImportAgumentaion
                    onOpen={openModal}
                    onClose={onClose}
                    istate={iState}
                    setIstate={updateIstate}
                    handleCancel={handleCancel} />

            </div>
        </div>
    )
}

export default Classagumentation
