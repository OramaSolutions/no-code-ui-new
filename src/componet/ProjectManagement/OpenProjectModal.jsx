import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoClose } from 'react-icons/io5';
import { MdFolderOpen, MdCheck } from 'react-icons/md';
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchVersionList, openProjectApi } from "../../api/projectApi";
import { setVersionData } from '../../reduxToolkit/Slices/openSlices';
import { commomObj } from '../../utils';

const initialState = {
    versionNumber: '',
};

function OpenProjectModal({ istate, setIstate }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [Istate, updateIstate] = useState(initialState);
    const { versionNumber } = Istate;
    const { openModal, projectName, projectId, model } = istate;
    const { versionData, loader } = useSelector((state) => state.openProject);
    const [error, setError] = useState(false);

    const versionQuery = useQuery({
        queryKey: ["versionList", projectName],
        queryFn: async () => {
            // console.log("queryFn running...");
            const res = await fetchVersionList({ projectName });
            // console.log("QUERY RESULT => ", res);
            return res.data;
        },
        enabled: false,
    });

    useEffect(() => {
        if (versionQuery.isSuccess) {
            // console.log("res of version", versionQuery.data);
            dispatch(setVersionData(versionQuery.data));
        }
    }, [versionQuery.isSuccess]);

    // Trigger manually
    useEffect(() => {
        if (openModal && projectName) {
            // console.log("refetch called");
            versionQuery.refetch();
        }
    }, [openModal, projectName]);

    const openMutation = useMutation({
        mutationFn: openProjectApi,

        onSuccess: (res) => {
            if (res?.data?.code === 200) {
                const projectData = res.data.askedProject;

                // const redirect =
                //     model === 'objectdetection'
                //         ? '/object-detection-training'
                //         : model === 'classification'
                //             ? '/classification-training'
                //             : '/defect-detection-training';

                // navigate(redirect, {
                //     state: {
                //         name: projectData?.name,
                //         version: projectData?.versionNumber,
                //         projectId: projectData?._id,
                //     },
                // });
                const redirect =
                    model === "objectdetection"
                        ? `/object-detection-training/${projectData._id}/${projectData.name}/${projectData.versionNumber}`
                        : model === "classification"
                            ? `/classification-training/${projectData._id}/${projectData.name}/${projectData.versionNumber}`
                            : `/defect-detection-training/${projectData._id}/${projectData.name}/${projectData.versionNumber}`;

                navigate(redirect, {
                    state: {
                        name: projectData?.name,
                        version: projectData?.versionNumber,
                        projectId: projectData?._id,
                    },
                });

                setIstate({ ...istate, openModal: false, projectId: '' });
                updateIstate(initialState);
                setError(false);
            } else {
                toast.error(res?.data?.message, commomObj);
            }
        },

        onError: () => {
            toast.error('Failed to open project', commomObj);
        },
    });

    const handleclose = () => {
        setIstate({ ...istate, openModal: false, projectName: '' });
        updateIstate(initialState);
        setError(false);
    };

    const saveHandler = () => {
        if (versionNumber?.trim() === '') {
            setError(true);
            return;
        }

        const data = {
            name: projectName,
            versionNumber,
        };

        openMutation.mutate(data);
    };

    return (
        <AnimatePresence>
            {openModal && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={handleclose}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 relative">
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleclose}
                                    className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                                >
                                    <IoClose className="w-6 h-6" />
                                </motion.button>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                        <MdFolderOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Open Project</h2>
                                        <p className="text-blue-100 text-sm">Select a version to continue</p>
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-6">
                                {/* Project Name */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Project Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={projectName}
                                            readOnly
                                            className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl text-slate-800 font-semibold cursor-not-allowed"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Version Selection */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Select Version *
                                    </label>
                                    {loader ? (
                                        <div className="flex items-center justify-center py-4">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <select
                                                name="versionNumber"
                                                value={versionNumber}
                                                onChange={(e) => {
                                                    updateIstate({ ...Istate, versionNumber: e.target.value });
                                                    setError(false);
                                                }}
                                                className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-slate-800 font-medium focus:outline-none transition-all ${error && versionNumber.trim() === ''
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                                    : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
                                                    }`}
                                            >
                                                <option value="">-- Select Version --</option>
                                                {versionData?.result?.length > 0 ? (
                                                    versionData.result.map((item, index) => (
                                                        <option key={index} value={item?.versionNumber}>
                                                            {item?.versionNumber}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option disabled>No versions available</option>
                                                )}
                                            </select>
                                            <AnimatePresence>
                                                {error && versionNumber.trim() === '' && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="text-red-500 text-sm font-medium mt-2"
                                                    >
                                                        *Please select a version
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </>
                                    )}
                                </motion.div>

                                {/* Info Box */}
                                {versionData?.result?.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                                    >
                                        <p className="text-sm text-blue-800">
                                            <span className="font-semibold">Available Versions:</span>{' '}
                                            {versionData.result.length}
                                        </p>
                                    </motion.div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-6 pb-6 flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleclose}
                                    className="flex-1 px-4 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors duration-200"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={saveHandler}
                                    disabled={loader}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loader ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                        />
                                    ) : (
                                        <>
                                            <MdFolderOpen className="w-5 h-5" />
                                            <span>Open Project</span>
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

export default OpenProjectModal;
