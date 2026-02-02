import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { MdModelTraining, MdRocketLaunch, MdMinimize } from 'react-icons/md';
import DataTransferPanel from './DataTransferPanel';

import { toast } from "react-toastify";

import axios from 'axios';
const TRAIN_STEP = {
    IDLE: "idle",
    RUNNING: "running",
    MONITOR: "monitor",
    COMPLETED: "completed",
};

function Train({ state, username, onApply, onChange, url }) {


    const [step, setStep] = useState(TRAIN_STEP.IDLE);
    const task = 'objectdetection';


    const handleStartTraining = async () => {
        try {

            setStep(TRAIN_STEP.RUNNING);

            await axios.get(`${url}train_yolov8`, {
                params: {
                    username,
                    task: "objectdetection",
                    project: state?.name,
                    version: state?.version,
                },
            });
            setStep(TRAIN_STEP.MONITOR);


        } catch (err) {
            toast.error("Failed to start training");
            setStep(TRAIN_STEP.IDLE);
        }
    };

    return (
        <div className=''>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className=" w-full pointer-events-auto overflow-hidden  space-y-8"
            >
                <div className="flex items-center gap-3">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg"
                    >
                        <MdModelTraining className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Train Model</h2>
                        <p className="text-sm text-slate-600"></p>
                    </div>
                </div>

                <div>
                    <DataTransferPanel
                        url={url}
                        username={username}
                        state={state}
                        step={step}
                        task="objectdetection"
                        onApply={onApply}
                        onComplete={() => {

                            setStep(TRAIN_STEP.COMPLETED)
                        }
                        }
                        onFail={() => setStep(TRAIN_STEP.IDLE)}
                    />
                </div>

                {/* Body */}
                {
                    step === TRAIN_STEP.IDLE && (

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                           
                            whileTap={{ scale: 0.98 }}
                            onClick={handleStartTraining}
                            className="w-full  rounded-xl mt-4 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                        >
                            <span>Start Training</span>
                        </motion.button>

                    )
                }
            </motion.div>




        </div>
    );
}

export default Train;
