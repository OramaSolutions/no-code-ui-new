import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { commomObj } from '../../../utils';
import { hyperTune, HypetTuneModal, ReturnHypertune } from '../../../reduxToolkit/Slices/projectSlices';

import { HiAdjustments } from 'react-icons/hi';
import ModelSelector from './ModelSelector';
import BasicParameters from './BasicParameters';
import AdvancedParameters from './AdvancedParameters';
import ActionButtons from './ActionButtons';

// "erasing": float(erasing),
//                 "scale": float(scale),
//                 "translate": float(translate),
//                 "shear": float(shear),
//                 "hsv_h": float(hsv_h),
//                 "hsv_s": float(hsv_s),
//                 "hsv_v": float(hsv_v),

const initialState = {
    pre_trained_model: '',
    imgsz: 640,
    batch: 32,
    epochs: 60,
    mosaic: 0,
    close_mosaic: 0,
    device: '0',
    dropout: 0,
    fliplr: 0,
    flipud: 0,
    patience: 20,
    single_cls: false,
    validation_conf: 0.25,
    erasing: 0,
    scale: 0,
    translate: 0,
    shear: 0,
    hsv_h: 0,
    hsv_s: 0,
    hsv_v: 0,
    advanced: false,
    loader: false,
    
    isDirty: false,
};

function HyperTune({ onApply, state, username, onChange, url }) {

    const dispatch = useDispatch();
    const [istate, updateIstate] = useState(initialState);
    const { hypertuneModel } = useSelector((state) => state.project);
    const { hasChangedSteps } = useSelector((state) => state.steps);

    useEffect(() => {
        const payload = {
            username: username,
            version: state?.version,
            project: state?.name,
            task: 'objectdetection',
        };
        dispatch(HypetTuneModal({ payload, url }));

        const fetchData = async () => {
            try {
                const res = await dispatch(ReturnHypertune({ payload, url }));
                if (res?.payload?.status === 200) {
                    updateIstate((prev) => ({
                        ...prev,
                        pre_trained_model: res?.payload?.data?.model?.split?.('/')?.at(-1) || '',
                        imgsz: res?.payload?.data?.imgsz || 640,
                        batch: res?.payload?.data?.batch || 32,
                        epochs: res?.payload?.data?.epochs || 60,
                        mosaic: res?.payload?.data?.mosaic || 0,
                        close_mosaic: res?.payload?.data?.close_mosaic || 0,
                        device: res?.payload?.data?.device || '0',
                        dropout: res?.payload?.data?.dropout || 0,
                        fliplr: res?.payload?.data?.fliplr || 0,
                        flipud: res?.payload?.data?.flipud || 0,
                        patience: res?.payload?.data?.patience || 20,
                        single_cls: res?.payload?.data?.single_cls === 'true',
                        validation_conf: res?.payload?.data?.validation_conf || 0.25,
                        erasing: res?.payload?.data?.erasing || 0,
                        scale: res?.payload?.data?.scale || 0,
                        translate: res?.payload?.data?.translate || 0,
                        shear: res?.payload?.data?.shear || 0,
                        hsv_h: res?.payload?.data?.hsv_h || 0,
                        hsv_s: res?.payload?.data?.hsv_s || 0,
                        hsv_v: res?.payload?.data?.hsv_v || 0,
                        isDirty: true,
                    }));
                }
            } catch (err) {
                console.error('Error fetching hypertune data:', err);
            }
        };
        fetchData();
    }, []);

    const inputHandler = (name, value) => {
        if (name === 'single_cls') {
            updateIstate((prev) => ({
                ...prev,
                [name]: value ? 'true' : 'false',
                isDirty: true,
            }));
            return;
        }

        if (name === 'close_mosaic') {
            if (value > istate.epochs) {
                return toast.error('Close mosaic value should not be greater than epochs value', commomObj);
            }
        }

        updateIstate((prev) => ({
            ...prev,
            [name]: value,
            isDirty: true,
        }));
    };

    const saveHandler = async () => {
        if (!istate.pre_trained_model || istate.pre_trained_model.trim() === '') {
            toast.error('Please select a model type before applying', commomObj);
            return;
        }

        if (!istate.isDirty) {
            onApply();
            return;
        }

        const formData = new FormData();
        formData.append('username', username);
        formData.append('version', state?.version);
        formData.append('project', state?.name);
        formData.append('task', 'objectdetection');
        formData.append('pre_trained_model', istate.pre_trained_model);
        formData.append('batch', istate.batch || 32);
        formData.append('epochs', istate.epochs || 60);
        formData.append('imgsz', istate.imgsz || 640);
        formData.append('mosaic', istate.mosaic || 0);
        formData.append('close_mosaic', istate.close_mosaic || 0);
        formData.append('device', istate.device || '0');
        formData.append('dropout', istate.dropout || 0);
        formData.append('fliplr', istate.fliplr || 0);
        formData.append('flipud', istate.flipud || 0);
        formData.append('patience', istate.patience || 20);
        formData.append('single_cls', istate.single_cls);
        formData.append('validation_conf', istate.validation_conf || 0.25);

        formData.append('erasing', istate.erasing || 0);
        formData.append('scale', istate.scale || 0);
        formData.append('translate', istate.translate || 0);
        formData.append('shear', istate.shear || 0);
        formData.append('hsv_h', istate.hsv_h || 0);
        formData.append('hsv_s', istate.hsv_s || 0);
        formData.append('hsv_v', istate.hsv_v || 0);

        try {
            updateIstate({ ...istate, loader: true });
            const response = await dispatch(hyperTune({ payload: formData, url }));
            if (response?.payload?.code === 200) {
                toast.success(response?.payload?.message, commomObj);
           
                // onChange();
                   onApply();
            }
        } catch (error) {
            toast.error(error?.payload?.message, commomObj);
            updateIstate({ ...istate, loader: false });
            console.error('Error uploading file:', error);
        }
    };

    const handleReset = () => {
        updateIstate(initialState);
    };

    const toggleAdvanced = () => {
        updateIstate((prev) => ({ ...prev, advanced: !prev.advanced }));
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8 "
            >
                {/* Header */}
                <div className="flex items-center gap-3">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg"
                    >
                        <HiAdjustments className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Hyperparameter Tuning</h2>
                        <p className="text-sm text-slate-600">Configure training parameters for optimal model performance</p>
                    </div>
                </div>

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
                >
                    <div className="p-4 space-y-8">
                        {/* Model Selector */}
                        <ModelSelector
                            models={hypertuneModel?.models || []}
                            selectedModel={istate.pre_trained_model}
                            onModelChange={(value) => inputHandler('pre_trained_model', value)}
                        />

                        {/* Basic Parameters */}
                        <BasicParameters
                            values={istate}
                            onValueChange={inputHandler}
                        />

                        {/* Advanced Settings Toggle */}
                        <div className="flex justify-center pt-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={toggleAdvanced}
                                className="px-6 py-2 text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2 border-2 border-indigo-200 hover:border-indigo-300 rounded-xl transition-colors"
                            >
                                {istate.advanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
                            </motion.button>
                        </div>

                        {/* Advanced Parameters */}
                        {istate.advanced && (
                            <AdvancedParameters
                                values={istate}
                                onValueChange={inputHandler}
                            />
                        )}
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <ActionButtons
                    onReset={handleReset}
                    onApply={saveHandler}
                    loading={istate.loader}
                    isModelSelected={!!istate.pre_trained_model && istate.pre_trained_model.trim() !== ''}
                />
            </motion.div>

           
        </>
    );
}

export default HyperTune;
