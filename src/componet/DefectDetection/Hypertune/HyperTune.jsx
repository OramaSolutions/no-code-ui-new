import React, { useState, useEffect } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { commomObj } from '../../../utils';
import { DefecthyperTune, DefectModal, ReturnDefectHypertune } from '../../../reduxToolkit/Slices/defectSlices';
import TrainModel from '../../Project/TrainingModals/TrainModel';
import { HiAdjustments } from 'react-icons/hi';
import ModelSelector from './ModelSelector';
import BasicParameters from './BasicParameters';
import AdvancedParameters from './AdvancedParameters';
import ActionButtons from './ActionButtons';

const initialState = {
    model: "",
    image_size: "256",
    batch: '32',
    epochs: '50',
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
};

function HyperTune({ onApply, state, username, onChange, url }) {
    const dispatch = useDispatch();
    const [istate, updateIstate] = useState(initialState);
    const { defectModal } = useSelector((state) => state.defectDetection);
    const { hasChangedSteps } = useSelector((state) => state.steps);

    useEffect(() => {
        const payload = {
            username: username,
            version: state?.version,
            project: state?.name,
            task: 'defectdetection',
        };
        dispatch(DefectModal({
            username: username,
            version: state?.version,
            project: state?.name,
            task: "defectdetection",
        }));

        const fetchData = async () => {
            try {
                const res = await dispatch(ReturnDefectHypertune({
                    username: username,
                    version: state?.version,
                    project_name: state?.name,
                    task: "defectdetection",
                }));
                

                const data = res?.payload?.config
                // console.log('res', data)
                updateIstate((prev) => ({
                    ...prev,
                    model: data?.model || "",
                    image_size: data?.image_size || "256",
                    model_size: data?.model_size || "small",
                    test_split_mode: data?.test_split_mode || "from_dir",
                    test_split: data?.test_split || 0.2,
                    apply: data?.apply || false,
                    tile_size: data?.tile_size || "",
                    stride: data?.stride || "",
                    use_random_tiling: data?.use_random_tiling || false,
                    random_tile_count: data?.random_tile_count || "",
                    center_crop: data?.center_crop || "224",
                    isDirty: true,
                }));

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
        if (!istate.model || istate.model.trim() === '') {
            toast.error('Please select a model type before applying', commomObj);
            return;
        }

        if (!istate.isDirty) {
            onApply();
            return;
        }

        const data = {
            username: username,
            version: state?.version,
            project_name: state?.name,
            task: "defectdetection",
            model: istate.model,
            batch: Number(istate.batch) == 0 ? 32 : Number(istate.batch),
            epochs: Number(istate.epochs) == 0 ? 50 : Number(istate.epochs),
            image_size: Number(istate.image_size) == 0 ? 256 : Number(istate.image_size),
            model_size: istate.model_size,
            test_split_mode: istate.test_split_mode,
            test_split: Number(istate.test_split) == 0 ? 0.2 : Number(istate.test_split),
            apply: istate.apply,
            tile_size: Number(istate.tile_size) == 0 ? null : Number(istate.tile_size),
            stride: Number(istate.stride) == 0 ? null : Number(istate.stride),
            use_random_tiling: istate.use_random_tiling,
            random_tile_count: Number(istate.random_tile_count) == 0 ? 16 : Number(istate.random_tile_count),
            center_crop: Number(istate.center_crop) == 0 ? 224 : Number(istate.center_crop)
        };

        try {
            updateIstate({ ...istate, loader: true });
            console.log('Submitting hypertune data:', data);
            const response = await dispatch(DefecthyperTune(data));
            console.log('DefecthyperTune response:', response);
            if (response?.payload?.status === 200) {
                toast.success(response?.payload?.message, commomObj);
                updateIstate({ ...istate, loader: false, openModal: true });
                onChange();
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
                            models={defectModal || []}
                            selectedModel={istate.model}
                            modelSize={istate.model_size}
                            onModelChange={(value) => inputHandler('model', value)}
                            onModelSizeChange={(value) => inputHandler('model_size', value)}
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
                    isModelSelected={!!istate.model && istate.model.trim() !== ''}
                />
            </motion.div>

            <TrainModel
                initialData={istate}
                setState={updateIstate}
                onApply={onApply}
                username={username}
                state={state}
                task="defectdetection"
                apiPoint=""
            />
        </>
    );
}

export default HyperTune;
