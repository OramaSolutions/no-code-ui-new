import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../../reduxToolkit/Slices/projectSlices';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { commomObj } from '../../utils';
import { IoClose } from 'react-icons/io5';
import { MdNumbers } from 'react-icons/md';

const initialState = {
    versionNumber: "",
};

function CreateVersion({ show, setShow, model }) {
    const [istate, setIstate] = useState(initialState);
    const [error, setError] = useState(false);
    const { versionNumber } = istate;
    const { openVersion, projectName } = show;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const redirect = model === "objectdetection"
        ? "/object-detection-training"
        : model === "Classification"
            ? "/classification-training"
            : "/defect-detection-training";

    const handleClose = () => {
        setShow({ ...show, openVersion: false });
        setIstate(initialState);
        setError(false);
    };

    const inputHandler = (e) => {
        const { name, value } = e.target;
        setIstate({ ...istate, [name]: value });
        if (error) setError(false);
    };

    const saveHandler = async () => {
        try {
            if (!versionNumber || !versionNumber.trim()) {
                setError(true);
            } else {
                const data = { model, name: projectName, versionNumber };
                const response = await dispatch(createProject(data));

                if (response?.payload?.code === 200 || response?.payload?.code === 201) {
                    toast.success(response?.payload?.message, commomObj);
                    setShow({ ...show, openVersion: false });
                    navigate(redirect, {
                        state: {
                            name: response?.payload?.data?.name || response?.payload?.addBanner?.name,
                            version: response?.payload?.data?.versionNumber || response?.payload?.addBanner?.versionNumber,
                            projectId: response?.payload?.data?._id || response?.payload?.addBanner?._id
                        }
                    });
                } else {
                    toast.error(response?.payload?.message, commomObj);
                }
            }
        } catch (err) {
            console.log(err, "err");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            saveHandler();
        }
    };

    return (
        <AnimatePresence>
            {openVersion && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 relative">
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                                >
                                    <IoClose className="w-6 h-6" />
                                </motion.button>
                                <h2 className="text-2xl font-bold text-white">Create Version</h2>
                                <p className="text-purple-100 text-sm mt-1">
                                    Add a new version for <span className="font-semibold">{projectName}</span>
                                </p>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Version Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MdNumbers className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <motion.input
                                            whileFocus={{ scale: 1.01 }}
                                            type="text"
                                            name="versionNumber"
                                            value={versionNumber}
                                            onChange={inputHandler}
                                            onKeyPress={handleKeyPress}
                                            placeholder="e.g., 1.0.0"
                                            className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none ${error && !versionNumber.trim()
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                                    : 'border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10'
                                                }`}
                                        />
                                    </div>
                                    <AnimatePresence>
                                        {error && !versionNumber.trim() && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="text-red-500 text-sm font-medium"
                                            >
                                                *Required to fill
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 pb-6 flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleClose}
                                    className="flex items-center justify-evenly flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-md transition-colors duration-200 gap-2"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={saveHandler}
                                    className="flex items-center justify-evenly flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-md transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    Create Version
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

export default CreateVersion;
