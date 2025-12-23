import React, { useState, useRef, useEffect } from 'react'

import 'rc-slider/assets/index.css';

import { augmentedData, ReturnAgumentation } from '../../../reduxToolkit/Slices/projectSlices';
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { commomObj } from '../../../utils';
import ImportAgumentaion from '../ImportAgumentaion';
import { ToggleRow } from './ToggleRow';
import { SliderRow } from './SliderRow';
import { PreviewPair } from './PreviewPair';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSparkles, HiRefresh } from 'react-icons/hi';

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const augmentationsConfig = [
    {
        key: "rotation",
        label: "Rotation",
        tooltip: "Rotate image. Use probability to control how often it applies.",
        controls: [
            { stateKey: "rotate_limit", title: "Degree", min: -180, max: 180, step: 1 },
            { stateKey: "rotate_prob", title: "Probability", min: 0, max: 1, step: 0.05 },
        ],
        preview: (s) => (s.rotation ? { transform: `rotate(${s.rotate_limit}deg)` } : {}),
        toPayload: (s) => ({
            rotate_limit: clamp(s.rotate_limit, -180, 180),
            rotate_prob: clamp(s.rotate_prob, 0, 1),
        }),
    },
    {
        key: "crop",
        label: "Crop",
        tooltip: "Random crop ratios (.7, .8, .9, .95). Only probability is configurable.",
        controls: [{ stateKey: "cropProb", title: "Probability", min: 0, max: 1, step: 0.05 }],
        preview: (s) => (s.crop ? { objectFit: "cover", objectPosition: "center", overflow: "hidden" } : {}),
        toPayload: (s) => ({ crop: { p: clamp(s.cropProb, 0, 1) } }),
    },
    {
        key: "verticalFlip",
        label: "Vertical Flip",
        tooltip: "Flip vertically.",
        controls: [{ stateKey: "vertical_flip_prob", title: "Probability", min: 0, max: 1, step: 0.05 }],
        preview: (s) => (s.verticalFlip ? { transform: "scaleY(-1)" } : {}),
        toPayload: (s) => ({ vertical_flip_prob: clamp(s.vertical_flip_prob, 0, 1) }),
    },
    {
        key: "horizontalFlip",
        label: "Horizontal Flip",
        tooltip: "Flip horizontally.",
        controls: [{ stateKey: "horizontal_flip_prob", title: "Probability", min: 0, max: 1, step: 0.05 }],
        preview: (s) => (s.horizontalFlip ? { transform: "scaleX(-1)" } : {}),
        toPayload: (s) => ({ horizontal_flip_prob: clamp(s.horizontal_flip_prob, 0, 1) }),
    },
    {
        key: "brightness",
        label: "Brightness",
        title: "Brightness Strength",
        controls: [
            { stateKey: "brightness_limit", title: "Value (0–1)", min: -0.5, max: 0.5, step: 0.05 },
            { stateKey: "brightness_prob", title: "Probability", min: 0, max: 1, step: 0.05 },
        ],
        preview: (s) => {
            if (!s.brightness) return {};

            // slider: -0.5 → 0.5
            const v = clamp(s.brightness_limit, -0.5, 0.5);

            // normalize to -1 → +1
            const t = v / 0.5;

            if (t < 0) {
                // 🔽 DARKEN — stronger falloff
                // brightness range: 1 → 0.3
                const brightness = 1 + t * 0.5; // t=-1 → 0.3
                const contrast = 1 + (-t) * 0.2; // add contrast for punch

                return {
                    filter: `brightness(${brightness}) contrast(${contrast})`
                };
            }

            // 🔼 BRIGHTEN — strong washout
            // brightness range: 1 → 2.2
            const brightness = 1 + t * 1.1; // t=1 → 2.2
            const contrast = 1 - t * 0.3; // heavy highlight wash

            return {
                filter: `brightness(${brightness}) contrast(${contrast})`
            };
        },
        toPayload: (s) => ({
            brightness_limit: clamp(s.brightness_limit, -0.5, 0.5),
            brightness_prob: clamp(s.brightness_prob, 0, 1),
        }),
    },
    {
        key: "contrast",
        label: "Contrast",
        tooltip: "Adjust contrast; backend expects 0–1 limit mapped to (-limit, +limit).",
        controls: [
            { stateKey: "contrast_limit", title: "Value (0–1)", min: -0.5, max: 0.5, step: 0.05 },
            { stateKey: "contrast_prob", title: "Probability", min: 0, max: 1, step: 0.05 },
        ],
        preview: (s) => {
            if (!s.contrast) return {};

            // slider is -0.5 → 0.5
            const v = clamp(s.contrast_limit, -0.5, 0.5);

            // normalize to -1 → +1
            const t = v / 0.5;

            if (t < 0) {
                // 🔽 Low contrast (flatten image)
                // contrast range: 1 → 0.4
                const contrast = 1 + t * 0.6; // t=-1 → 0.4
                const brightness = 1 - t * 0.05; // slight lift to avoid muddy look

                return {
                    filter: `contrast(${contrast}) brightness(${brightness})`
                };
            }

            // 🔼 High contrast (punchy)
            // contrast range: 1 → 2.2
            const contrast = 1 + t * 1.2; // t=1 → 2.2
            const brightness = 1 - t * 0.1; // tame highlights slightly

            return {
                filter: `contrast(${contrast}) brightness(${brightness})`
            };
        },
        toPayload: (s) => ({
            contrast_limit: clamp(s.contrast_limit, -0.5, 0.5),
            contrast_prob: clamp(s.contrast_prob, 0, 1),
        }),
    },
    {
        key: "stauration",
        label: "Saturation",
        tooltip: "Adjust hue/saturation; backend limit 0–80.",
        controls: [
            { stateKey: "hue_saturation_limit", title: "Value (0–80)", min: 0, max: 80, step: 1 },
            { stateKey: "hue_saturation_prob", title: "Probability", min: 0, max: 1, step: 0.05 },
        ],
        preview: (s) => {
            if (!s.stauration) return {};
            const lim = clamp(s.hue_saturation_limit, 0, 80);
            // Map 0..80 to CSS saturate multiplier ~ 0.5..2.0
            const factor = 0.5 + (lim / 80) * 1.5;
            return { filter: `saturate(${factor})` };
        },
        toPayload: (s) => ({
            hue_saturation_limit: [0, clamp(s.hue_saturation_limit, 0, 80)],
            hue_saturation_prob: clamp(s.hue_saturation_prob, 0, 1),
        }),
    },
    {
        key: "noise",
        label: "Noise",
        tooltip: "Gaussian noise variance limit 10–50; prob in [0,1].",
        controls: [
            { stateKey: "gauss_noise_var_limit", title: "Variance (10–50)", min: 10, max: 50, step: 1 },
            { stateKey: "gauss_noise_prob", title: "Probability", min: 0, max: 1, step: 0.05 },
        ],
        preview: (s) => {
            if (!s.noise) return {};
            // CSS cannot add Gaussian noise directly; approximate with subtle grain look via contrast + brightness jitter
            const v = clamp(s.gauss_noise_var_limit, 10, 50);
            const strength = (v - 10) / 40; // 0..1
            const c = 1 + strength * 0.2;
            const b = 1 - strength * 0.1;
            return { filter: `contrast(${c}) brightness(${b})` };
        },
        toPayload: (s) => ({
            gauss_noise_var_limit: [10, clamp(s.gauss_noise_var_limit, 10, 50)],
            gauss_noise_prob: clamp(s.gauss_noise_prob, 0, 1),
        }),
    },
    {
        key: "blur",
        label: "Blur",
        tooltip: "Backend uses fixed kernels (3,5); only probability is configurable.",
        controls: [{ stateKey: "blur_prob", title: "Probability", min: 0, max: 1, step: 0.05 }],
        preview: (s) => {
            if (!s.blur) return {};
            // Visual hint: light blur so preview reflects effect without kernel control
            return { filter: `blur(0.5px)` };
        },
        toPayload: (s) => ({ blur_prob: clamp(s.blur_prob, 0, 1) }),
    },
];


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
    rotate_prob: 0.5,
    vertical_flip_prob: 0.5,
    horizontal_flip_prob: 0.5,
    brightness_limit: 0,
    brightness_prob: 0.5,
    contrast_limit: 0,
    contrast_prob: 0.5,
    hue_saturation_limit: 5,
    hue_saturation_prob: 0.5,
    gauss_noise_var_limit: 1,
    gauss_noise_prob: 0.5,
    blur_limit: 0,
    blur_prob: 0.5,
    cropX: 0,
    cropY: 0,
    cropXratio: 0.6,
    cropYratio: 0.6,
    num_of_images_to_be_generated: "1",
    cropProb: 0.5,
    openModal: false,
    onClose: false,
    isDirty: false,
}


function Augumentation({ state, username, onApply, onChange, url }) {
    const { hasChangedSteps } = useSelector((state) => state.steps);
    const DatasetSize = JSON.parse(window.localStorage.getItem("DataSize")) || {}
    const [iState, updateIstate] = useState(initialState)
    const { openModal, onClose, cropProb, cropX, cropY, rotation, crop, verticalFlip, horizontalFlip, brightness, contrast, stauration, noise, blur, rotate_limit, rotate_prob, vertical_flip_prob, horizontal_flip_prob, brightness_limit, brightness_prob, contrast_limit, contrast_prob, hue_saturation_limit, hue_saturation_prob, gauss_noise_var_limit, gauss_noise_prob, blur_limit, blur_prob, num_of_images_to_be_generated, isDirty } = iState
    // console.log(iState, "istateeeeee")
    const abortControllerReff = useRef();
    const dispatch = useDispatch()
    const [sampleImageUrl, setSampleImageUrl] = useState(null);

    const STATS_STORAGE_KEY = `project_stats:${state?.name}:${state?.version}:objectdetection`;
    const projectStats =
        JSON.parse(window.localStorage.getItem(STATS_STORAGE_KEY)) || {};

    const labeledImages = projectStats.labeledImages ?? 0;
    const totalImages = projectStats.totalImages ?? 0

    // for return data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const payload = {
                    username: username,
                    version: state?.version,
                    project: state?.name,
                    task: "objectdetection",
                }
                const res = await dispatch(ReturnAgumentation({ payload, url }));
                if (res?.payload?.status === 200) {
                    // const augData = res?.payload?.data?.augmentations


                    // const asUpper = (v, fallback = 0) => Array.isArray(v) ? (v[1] ?? fallback) : (v ?? fallback);
                    const asUpper = (v, fallback) =>
                        Array.isArray(v) ? (v[1] ?? fallback) : (v ?? fallback);

                    const asSigned = (v, fallback = 0) => {
                        if (!Array.isArray(v)) return v ?? fallback;

                        const lo = v[0] ?? 0;
                        const hi = v[1] ?? 0;

                        if (hi !== 0 && lo === 0) return hi;   // positive only
                        if (lo !== 0 && hi === 0) return lo;   // negative only

                        // both sides non-zero → pick dominant magnitude
                        return Math.abs(hi) >= Math.abs(lo) ? hi : lo;
                    };


                    const augData = res?.payload?.data?.augmentations ?? {};

                    const brightnessSigned = asSigned(augData?.brightness_limit, 0);
                    const contrastSigned = asSigned(augData?.contrast_limit, 0);

                    const noiseUpper = asUpper(augData?.gauss_noise_var_limit, undefined);
                    const noiseOn =
                        typeof noiseUpper === "number" && noiseUpper >= 10;
                    updateIstate((prev) => ({
                        ...prev,
                        rotation: !!augData?.rotate_limit,
                        crop: !!augData?.crop?.p,
                        verticalFlip: !!augData?.vertical_flip_prob,
                        horizontalFlip: !!augData?.horizontal_flip_prob,
                        brightness: brightnessSigned !== 0,
                        contrast: contrastSigned !== 0,
                        stauration: asUpper(augData?.hue_saturation_limit, 0) > 0,
                        noise: noiseOn,
                        blur: !!augData?.blur_prob,
                        rotate_limit: augData?.rotate_limit ?? 0,
                        rotate_prob: augData?.rotate_prob ?? 0,
                        vertical_flip_prob: augData?.vertical_flip_prob ?? 0,
                        horizontal_flip_prob: augData?.horizontal_flip_prob ?? 0,
                        brightness_limit: clamp(brightnessSigned, -0.5, 0.5),
                        brightness_prob: clamp(augData?.brightness_prob ?? 0, 0, 1),
                        contrast_limit: clamp(contrastSigned, -0.5, 0.5),
                        contrast_prob: clamp(augData?.contrast_prob ?? 0, 0, 1),
                        hue_saturation_limit: clamp(asUpper(augData?.hue_saturation_limit, 20), 0, 80),
                        hue_saturation_prob: clamp(augData?.hue_saturation_prob ?? 0, 0, 1),
                        gauss_noise_var_limit: clamp(asUpper(augData?.gauss_noise_var_limit, 10), 10, 50),
                        gauss_noise_prob: clamp(augData?.gauss_noise_prob ?? 0, 0, 1),
                        blur_prob: clamp(augData?.blur_prob ?? 0, 0, 1),
                        cropProb: clamp(augData?.crop?.p ?? 0, 0, 1),
                        num_of_images_to_be_generated: res?.payload?.data?.multiplier || "1",
                        isDirty: true,
                    }));

                }
            } catch (err) {
                toast.error("Oops! Something went wrong", commomObj)
            }
        }
        fetchData();
    }, [])

    // for sample image
    useEffect(() => {
        const fetchSampleImage = async () => {
            try {
                const params = new URLSearchParams({
                    username: username,
                    task: "objectdetection",
                    project: state?.name,
                    version: state?.version
                });
                const response = await fetch(`${url}return_sample_for_aug?${params.toString()}`);
                if (response.ok) {
                    const blob = await response.blob();
                    setSampleImageUrl(URL.createObjectURL(blob));
                }
            } catch (err) {
                console.error("Failed to fetch sample image", err);
            }
        };
        fetchSampleImage();
    }, [username, state]);

    const sanitizePayload = (a) => {
        const out = { ...a };
        if (typeof out.rotate_limit === 'number') out.rotate_limit = clamp(out.rotate_limit, -180, 180);
        if (typeof out.rotate_prob === 'number') out.rotate_prob = clamp(out.rotate_prob, 0, 1);

        // if (out.brightness_limit) out.brightness_limit = [0, clamp(out.brightness_limit[1] ?? 0, 0, 1)];
        // if (typeof out.brightness_limit === "number")
        //     out.brightness_limit = [clamp(out.brightness_limit, -0.5, 0.5)]
        if (typeof out.brightness_limit === "number") {
            const v = clamp(out.brightness_limit, -0.5, 0.5);

            if (v > 0) {
                out.brightness_limit = [0, v];
            } else if (v < 0) {
                out.brightness_limit = [v, 0];
            } else {
                out.brightness_limit = [0, 0];
            }
        }

        if (typeof out.brightness_prob === 'number') out.brightness_prob = clamp(out.brightness_prob, 0, 1);

        // if (out.contrast_limit) out.contrast_limit = [0, clamp(out.contrast_limit[1] ?? 0, 0, 1)];

        if (typeof out.contrast_limit === "number") {
            const v = clamp(out.contrast_limit, -0.5, 0.5);

            if (v > 0) {
                out.contrast_limit = [0, v];
            } else if (v < 0) {
                out.contrast_limit = [v, 0];
            } else {
                out.contrast_limit = [0, 0];
            }
        }

        if (typeof out.contrast_prob === 'number') out.contrast_prob = clamp(out.contrast_prob, 0, 1);

        if (out.hue_saturation_limit) out.hue_saturation_limit = [0, clamp(out.hue_saturation_limit[1] ?? 0, 0, 80)];
        if (typeof out.hue_saturation_prob === 'number') out.hue_saturation_prob = clamp(out.hue_saturation_prob, 0, 1);

        if (out.gauss_noise_var_limit) out.gauss_noise_var_limit = [10, clamp(out.gauss_noise_var_limit[1] ?? 10, 10, 50)];
        if (typeof out.gauss_noise_prob === 'number') out.gauss_noise_prob = clamp(out.gauss_noise_prob, 0, 1);

        if (typeof out.blur_prob === 'number') out.blur_prob = clamp(out.blur_prob, 0, 1);

        if (out.crop?.p !== undefined) out.crop.p = clamp(out.crop.p, 0, 1);

        if (typeof out.vertical_flip_prob === 'number') out.vertical_flip_prob = clamp(out.vertical_flip_prob, 0, 1);
        if (typeof out.horizontal_flip_prob === 'number') out.horizontal_flip_prob = clamp(out.horizontal_flip_prob, 0, 1);

        return out;
    };

    const buildAugPayload = (state) => {
        const merged = augmentationsConfig.reduce((acc, aug) => ({ ...acc, ...aug.toPayload(state) }), {});
        // Prune inactive augmentations based on toggles
        if (!state.rotation) {
            delete merged.rotate_limit;
            delete merged.rotate_prob;
        }
        if (!state.crop) {
            delete merged.crop;
        }
        if (!state.verticalFlip) {
            delete merged.vertical_flip_prob;
        }
        if (!state.horizontalFlip) {
            delete merged.horizontal_flip_prob;
        }
        if (!state.brightness) {
            delete merged.brightness_limit;
            delete merged.brightness_prob;
        }
        if (!state.contrast) {
            delete merged.contrast_limit;
            delete merged.contrast_prob;
        }
        if (!state.stauration) {
            delete merged.hue_saturation_limit;
            delete merged.hue_saturation_prob;
        }
        if (!state.noise) {
            delete merged.gauss_noise_var_limit;
            delete merged.gauss_noise_prob;
        }
        if (!state.blur) {
            delete merged.blur_prob;
        }
        return { augmentations: sanitizePayload(merged) };
    };


    const checkHandler = (e) => {
        const { name, checked, value } = e.target;
        updateIstate({ ...iState, [name]: name === "num_of_images_to_be_generated" ? value : checked, isDirty: true })
    }

    const inputHandler = (value, name) => {
        updateIstate({ ...iState, [name]: value, isDirty: true })
    }

    const saveHandler = async () => {
        // console.log('save handler called,isDirty:', isDirty, 'hasChangedSteps:', hasChangedSteps);
        // if (!isDirty || hasChangedSteps?.augmented == false) {
        //     window.localStorage.setItem("AgumentedSize", (DatasetSize?.Size) * num_of_images_to_be_generated)
        //     onApply()
        //     return;
        // }
        if (!num_of_images_to_be_generated) {
            toast.error("Please Selelct The no. of Images to be generated", commomObj)
        }
        else {
            try {
                abortControllerReff.current = new AbortController();
                updateIstate({ ...iState, openModal: true })


                const augmentations = buildAugPayload(iState);
                const jsonString = JSON.stringify(augmentations);
                const formData = new FormData();
                formData.append("json_data", jsonString);



                formData.append("username", username);
                formData.append("version", state?.version)
                formData.append("project", state?.name);
                formData.append("task", "objectdetection");
                formData.append("json_data", jsonString);
                formData.append("multiplier", num_of_images_to_be_generated);

                // for (let pair of formData.entries()) {
                //     console.log(`${pair[0]}:`, pair[1]);
                // }

                const response = await dispatch(augmentedData({ payload: formData, signal: abortControllerReff.current.signal, url }))
                console.log(response, "augmentations response")
                if (response?.payload?.code === 201) {
                    updateIstate({ ...iState, openModal: false })
                    toast.success(response?.payload?.message, commomObj)
                    window.localStorage.setItem("AgumentedSize", (labeledImages) * num_of_images_to_be_generated)
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
            console.log('agumentation operation aborted');
        }
    };
    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
            >
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="flex w-full items-center justify-between gap-6 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                        {/* Left: Icon + Title */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center shadow">
                                <HiSparkles className="w-6 h-6 text-white" />
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-slate-800">
                                    Data Augmentation
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Configure image transformations
                                </p>
                            </div>
                        </div>

                        {/* Right: Stats */}
                        <div className="flex flex-col items-end min-w-[160px]">
                            <div className="text-sm text-slate-500 mb-1">
                                Labeled Images
                            </div>

                            <div className="text-lg font-semibold text-slate-800">
                                {labeledImages}
                                <span className="text-slate-400 font-normal">
                                    {" / "}{totalImages}
                                </span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full h-2 mt-2 rounded-full bg-slate-200 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                                    style={{
                                        width: `${(labeledImages / totalImages) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>


                    {/* <motion.button
                        whileHover={{ scale: 1.05, rotate: 180 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={resetHandler}
                        className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    >
                        <HiRefresh className="w-5 h-5" />
                    </motion.button> */}
                </div>

                {/* Number of Images Input */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 rounded-2xl border border-indigo-200"
                >
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Images to Generate (Multiplier)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            name="num_of_images_to_be_generated"
                            value={iState.num_of_images_to_be_generated}
                            onChange={checkHandler}
                            min="1"
                            className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-semibold text-indigo-700"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                            Total: {(labeledImages || 0) * (iState.num_of_images_to_be_generated || 1)} images
                        </div>
                    </div>
                </motion.div>

                {/* Augmentations List with Inline Previews */}
                <div className="space-y-3">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
                        Augmentation Controls
                    </h3>

                    {augmentationsConfig.map((aug, index) => (
                        <motion.div
                            key={aug.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-xl p-2 border border-slate-200 shadow-sm space-y-2 "
                        >
                            {/* Toggle */}
                            <ToggleRow
                                name={aug.key}
                                label={aug.label}
                                checked={iState[aug.key]}
                                onChange={checkHandler}
                                tooltip={aug.tooltip}
                            />

                            {/* Sliders (when toggle is ON) */}
                            <AnimatePresence>
                                {iState[aug.key] && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-1 pl-4 border-l-2 border-indigo-200"
                                    >
                                        {aug.controls.map((ctrl) => (
                                            <SliderRow
                                                key={ctrl.stateKey}
                                                title={ctrl.title}
                                                min={ctrl.min}
                                                max={ctrl.max}
                                                step={ctrl.step}
                                                value={iState[ctrl.stateKey]}
                                                onChange={(val) => inputHandler(val, ctrl.stateKey)}
                                            />
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Preview (when toggle is ON and image is loaded) */}
                            <AnimatePresence>
                                {iState[aug.key] && sampleImageUrl && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="pt-4 border-t border-slate-200"
                                    >
                                        <PreviewPair
                                            original={sampleImageUrl}
                                            transformed={sampleImageUrl}
                                            transformStyle={aug.preview(iState)}
                                            label={`${aug.label} Preview`}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-4 justify-center pt-6"
                >
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={resetHandler}
                        className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all"
                    >
                        Reset All
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={saveHandler}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                        <HiSparkles className="w-5 h-5" />
                        Apply Augmentations
                    </motion.button>
                </motion.div>
            </motion.div>

            {/* Import Modal */}
            <ImportAgumentaion
                onOpen={iState.openModal}
                onClose={iState.onClose}
                istate={iState}
                setIstate={updateIstate}
                handleCancel={handleCancel}
            />
        </>
    );

}

export default Augumentation
