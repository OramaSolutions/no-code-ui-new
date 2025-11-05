import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { commomObj } from '../../../utils';
import { remarkData, getRemarkData } from '../../../reduxToolkit/Slices/projectSlices';
import { getUrl } from '../../../config/config';
import { MdNoteAlt } from 'react-icons/md';
import ExistingRemarks from './ExistingRemarks';
import RemarksForm from './RemarksForm';
import RemarksActions from './RemarksActions';

const initialState = {
    observation: '',
    scopeOfImprovement: '',
    numOfTries: '',
    loading: false,
};

const url = getUrl('objectdetection');

const Remarks = ({ username, task, project, version, onApply, onChange }) => {
    const [istate, updateIstate] = useState(initialState);
    const { observation, scopeOfImprovement, numOfTries, loading } = istate;
    const [files, setFiles] = useState([]);
    const [hardwareFile, setHardwareFile] = useState(null);
    const [showNext, setShowNext] = useState(false);
    const [existingRemark, setExistingRemark] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchRemark() {
            try {
                const response = await dispatch(getRemarkData({ url, username, task, project, version }));
                if (response?.payload?.code === 200 && (response?.payload?.remarks?.length > 0 || response?.payload?.uploaded_files?.length > 0)) {
                    setExistingRemark(response.payload.remarks.join('\n'));
                    setUploadedFiles(response.payload.uploaded_files);
                    setIsEditMode(true);

                    const obsMatch = response.payload.remarks.find((r) => r.startsWith('Observation:'));
                    const scopeMatch = response.payload.remarks.find((r) => r.startsWith('Scope of Improvement:'));
                    const triesMatch = response.payload.remarks.find((r) => r.startsWith('Number of Tries:'));

                    updateIstate((prev) => ({
                        ...prev,
                        observation: obsMatch ? obsMatch.replace('Observation:', '').trim() : '',
                        scopeOfImprovement: scopeMatch ? scopeMatch.replace('Scope of Improvement:', '').trim() : '',
                        numOfTries: triesMatch ? triesMatch.replace('Number of Tries:', '').trim() : '',
                    }));
                } else {
                    setIsEditMode(false);
                }
            } catch (err) {
                setIsEditMode(false);
            }
        }
        fetchRemark();
    }, [username, task, project, version, url, dispatch]);

    const inputHandler = (e) => {
        const { name, value } = e.target;
        updateIstate({ ...istate, [name]: value });
    };

    const fileHandler = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const hardwareFileHandler = (e) => {
        setHardwareFile(e.target.files && e.target.files[0] ? e.target.files[0] : null);
    };

    const saveHandler = async (e) => {
        e.preventDefault();
        try {
            updateIstate((prev) => ({ ...prev, loading: true }));
            const remarkText = `Observation: ${observation}\nScope of Improvement: ${scopeOfImprovement}\nNumber of Tries: ${numOfTries}`;
            const formData = new FormData();
            formData.append('username', username || '');
            formData.append('task', task || 'classification');
            formData.append('project', project || '');
            formData.append('version', version || '');
            formData.append('remark', remarkText);

            files.forEach((file) => {
                formData.append('files', file);
            });

            if (hardwareFile) {
                formData.append('files', hardwareFile);
            }

            const response = await dispatch(remarkData({ payload: formData, url }));
            if (response?.payload?.code === 201) {
                updateIstate((prev) => ({ ...prev, loading: false }));
                toast.success(response?.payload?.message, commomObj);
                setShowNext(true);
                setIsEditMode(true);
            } else {
                toast.error(response?.payload?.message || response?.payload?.error, commomObj);
                updateIstate((prev) => ({ ...prev, loading: false }));
            }
        } catch (error) {
            toast.error('Oops, something went wrong', commomObj);
            console.error('Error uploading file:', error);
            updateIstate((prev) => ({ ...prev, loading: false }));
        }
    };

    const handleNext = () => {
        if (typeof onChange === 'function') onChange();
        if (typeof onApply === 'function') onApply();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
            {/* Header */}
            <div className="flex items-center gap-3">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg"
                >
                    <MdNoteAlt className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Admin Remarks</h2>
                    <p className="text-sm text-slate-600">Add observations and improvement notes for this training session</p>
                </div>
            </div>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
            >
                <div className="p-8 space-y-6">
                    {/* Existing Remarks */}
                    {existingRemark && isEditMode && !showNext && (
                        <ExistingRemarks existingRemark={existingRemark} uploadedFiles={uploadedFiles} />
                    )}

                    {/* Form or Next Button */}
                    {!showNext ? (
                        <RemarksForm
                            observation={observation}
                            scopeOfImprovement={scopeOfImprovement}
                            numOfTries={numOfTries}
                            hardwareFile={hardwareFile}
                            files={files}
                            loading={loading}
                            isEditMode={isEditMode}
                            inputHandler={inputHandler}
                            fileHandler={fileHandler}
                            hardwareFileHandler={hardwareFileHandler}
                            saveHandler={saveHandler}
                            onNext={handleNext}
                        />
                    ) : (
                        <RemarksActions onNext={handleNext} showNextOnly={true} />
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Remarks;
