import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { MdClose, MdCheckCircle, MdError } from 'react-icons/md';

import { DefectModalTrain, InferAccuracy } from '../../../reduxToolkit/Slices/defectSlices';
import { toast } from 'react-toastify';
import { commomObj } from '../../../utils';

function DefectTrainModal({ data, setData, onApply, state, userData, type, model }) {
    const dispatch = useDispatch();
    const { defectTrainData, inferAccuracyData, loading } = useSelector((state) => state.defectDetection);
    const newData = type === "infer" ? inferAccuracyData : defectTrainData;

    useEffect(() => {
        const getData = async () => {
            const res = await dispatch(DefectModalTrain({ 
                username: userData?.activeUser?.userName, 
                version: state?.version, 
                project: state?.name, 
                task: "defectdetection", 
                model: model 
            }));
            
            if (!res?.payload?.confusion_matrix) {
                toast.error(res?.payload?.message, commomObj);
            } else {
                setData(prev => ({ 
                    ...prev, 
                    isTrainDataLoaded: true, 
                    defectTrainData: res?.payload 
                }));
            }
        };

        const getAccuracyData = async () => {
            const res = await dispatch(InferAccuracy({ 
                username: userData?.activeUser?.userName, 
                version: state?.version, 
                project: state?.name, 
                task: "defectdetection", 
                model: model 
            }));
            
            if (!res?.payload?.confusion_matrix) {
                toast.error(res?.payload?.message, commomObj);
            }
        };

        if (data.opendefectTraining && !data.isTrainDataLoaded && type !== "infer") {
            getData();
        } else if (type === "infer") {
            getAccuracyData();
        }
    }, [data.opendefectTraining]);

    const handleClose = () => {
        setData({ ...data, opendefectTraining: false });
    };

    const openModal = () => {
        setData((prev) => ({ 
            ...prev, 
            openVisualize: true, 
            opendefectTraining: false 
        }));
    };

    // Animation variants
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const modalVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.95,
            y: -20
        },
        visible: { 
            opacity: 1, 
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 500
            }
        },
        exit: { 
            opacity: 0, 
            scale: 0.95,
            y: 20,
            transition: { duration: 0.2 }
        }
    };

    return (
        <AnimatePresence mode="wait">
            {data.opendefectTraining && (
                <motion.div
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    onClick={handleClose}
                >
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                    >
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">
                               Training and Accuracy Matrix
                            </h3>
                            <button
                                onClick={handleClose}
                                className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                            >
                                <MdClose className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                            {!loading ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {/* Table */}
                                    <div className="overflow-x-auto rounded-xl border border-slate-200 mb-6">
                                        <table className="w-full">
                                            <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-slate-200">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                                        Class
                                                    </th>
                                                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                                                        Correct Predictions
                                                        <br />
                                                        <span className="text-[10px] font-normal text-slate-500">(n)</span>
                                                    </th>
                                                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                                                        Incorrect Predictions
                                                        <br />
                                                        <span className="text-[10px] font-normal text-slate-500">(n)</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 bg-white">
                                                {newData?.confusion_matrix && Object.keys(newData?.confusion_matrix)?.length > 0 ? (
                                                    <>
                                                        <motion.tr
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.3 }}
                                                            className="hover:bg-slate-50 transition-colors"
                                                        >
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                                                    <span className="text-sm font-semibold text-slate-900">
                                                                        Class <code className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">&lt;good&gt;</code>
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <MdCheckCircle className="w-5 h-5 text-green-600" />
                                                                    <span className="text-lg font-bold text-slate-900">
                                                                        {newData?.confusion_matrix?.Class_good?.Correct_Predictions}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <MdError className="w-5 h-5 text-red-600" />
                                                                    <span className="text-lg font-bold text-slate-900">
                                                                        {newData?.confusion_matrix?.Class_good?.Incorrect_Predictions}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        </motion.tr>
                                                        <motion.tr
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.4 }}
                                                            className="hover:bg-slate-50 transition-colors"
                                                        >
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                                                                    <span className="text-sm font-semibold text-slate-900">
                                                                        Class <code className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs">&lt;bad&gt;</code>
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <MdCheckCircle className="w-5 h-5 text-green-600" />
                                                                    <span className="text-lg font-bold text-slate-900">
                                                                        {newData?.confusion_matrix?.Class_bad?.Correct_Predictions}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <MdError className="w-5 h-5 text-red-600" />
                                                                    <span className="text-lg font-bold text-slate-900">
                                                                        {newData?.confusion_matrix?.Class_bad?.Incorrect_Predictions}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        </motion.tr>
                                                    </>
                                                ) : (
                                                    <tr>
                                                        <td colSpan={3} className="px-6 py-12 text-center">
                                                            <div className="flex flex-col items-center gap-3">
                                                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                                                                    <MdError className="w-8 h-8 text-slate-400" />
                                                                </div>
                                                                <p className="text-slate-600 font-medium">No Data Found</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Action Button */}
                                    <div className="flex justify-end">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={type === "infer" ? handleClose : openModal}
                                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                                        >
                                            {type === "infer" ? "Next" : "Visualize Results"}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-12"
                                >
                                    {type !== "infer" && (
                                        <h5 className="text-xl font-bold text-slate-800 mb-4">
                                            Training is in Process
                                        </h5>
                                    )}
                                    
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full mb-4"
                                    />
                                    
                                    {type !== "infer" && (
                                        <p className="text-sm text-slate-600">
                                            Please be patient, it may take some time
                                        </p>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default DefectTrainModal;
