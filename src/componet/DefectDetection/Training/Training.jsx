import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { MdModelTraining, MdRocketLaunch, MdCheckCircle, MdOutlineVisibility } from "react-icons/md";
import { toast } from "react-toastify";

import { DefectModalTrain } from "../../../reduxToolkit/Slices/defectSlices";
import DefectTrainPanel from "./DefectTrainPanel";
import DefectVisualizePanel from "./DefectVisualizePanel";

const TRAIN_STEP = {
    IDLE: "idle",
    RUNNING: "running",
    MONITOR: "monitor",
    VISUALIZE: "visualize",
    COMPLETED: "completed",
};

function Train({ state, username, onApply }) {
    const dispatch = useDispatch();
    const [step, setStep] = useState(TRAIN_STEP.IDLE);
    const [error, setError] = useState(null);

    const task = "defectdetection";

    const handleStartTraining = async () => {
        try {
            setError(null);
            setStep(TRAIN_STEP.RUNNING);
            // for now we are sending model (TODO- remove model dependency)
            await dispatch(
                DefectModalTrain({
                    username,
                    project: state?.name,
                    version: state?.version,
                    task,
                    model: 'padim'
                })
            ).unwrap();

            // console.log('>>>setting to monitor after api')

            setStep(TRAIN_STEP.MONITOR);
        } catch (err) {
            const message =
                err?.message ||
                err?.error ||
                "Failed to start training";

            toast.error(message);
            setError(message);
            setStep(TRAIN_STEP.IDLE);
        }
    };

    const handleVisualize = () => {
        console.time('VisualizeTransition');
        setStep(TRAIN_STEP.VISUALIZE);

        // Check render time
        setTimeout(() => {
            console.timeEnd('VisualizeTransition');
            console.log('Transition completed');
        }, 0);
    };

    return (
        <div className="w-full">
            {/* ================= IDLE ================= */}
            {step === TRAIN_STEP.IDLE && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-lg border border-blue-100"
                >
                    <div className="flex flex-col items-center gap-8">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                            <MdModelTraining className="w-16 h-16 text-white" />
                        </div>

                        <div className="text-center space-y-3">
                            <h3 className="text-2xl font-bold text-gray-800">Ready to Train</h3>
                            <p className="text-gray-600 max-w-md">
                                Start training your defect detection model with the selected dataset
                            </p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full bg-red-50 border border-red-200 rounded-xl p-4"
                            >
                                <div className="flex items-center gap-2 text-red-700">
                                    <MdCheckCircle className="w-5 h-5" />
                                    <span className="font-medium">{error}</span>
                                </div>
                            </motion.div>
                        )}

                        <button
                            onClick={handleStartTraining}
                            className="w-full max-w-md py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg group"
                        >
                            <MdRocketLaunch className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            Start Training
                        </button>
                    </div>
                </motion.div>
            )}

            {/* ================= RUNNING ================= */}
            {step === TRAIN_STEP.RUNNING && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-12 shadow-lg border border-blue-100"
                >
                    <div className="flex flex-col items-center gap-8">
                        <div className="relative">
                            <div className="w-24 h-24 border-8 border-blue-100 rounded-full" />
                            <div className="absolute top-0 left-0 w-24 h-24 border-8 border-transparent border-t-blue-500 rounded-full animate-spin" />
                        </div>
                        <div className="text-center space-y-2">
                            <h4 className="text-xl font-bold text-gray-800">Training in progress</h4>
                            <p className="text-gray-600">Please do not refresh or change window...</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ================= MONITOR ================= */}
            {step === TRAIN_STEP.MONITOR && (
                <DefectTrainPanel
                    onVisualize={handleVisualize}
                    onFail={(msg) => {
                        setError(msg || "Training failed");
                        setStep(TRAIN_STEP.IDLE);
                    }}
                />
            )}

            {/* ================= VISUALIZE ================= */}
            {step === TRAIN_STEP.VISUALIZE && (
                <DefectVisualizePanel
                    state={state}
                    onBack={() => setStep(TRAIN_STEP.MONITOR)}
                    onApply={() => {
                        setStep(TRAIN_STEP.COMPLETED);
                        onApply();
                    }}
                />
            )}
        </div>
    );
}

export default Train;