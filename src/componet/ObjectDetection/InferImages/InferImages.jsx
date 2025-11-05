import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { commomObj } from '../../../utils';
import { inferImages } from '../../../reduxToolkit/Slices/projectSlices';
import { MdPhotoCamera } from 'react-icons/md';
import ImageUploadZone from './ImageUploadZone';
import ImagePreview from './ImagePreview';
import ConfidenceSlider from './ConfidenceSlider';
import InferActions from './InferActions';
import InferResultModal from './InferResultModal';

const initialstate = {
    conf: 0.5,
    onOpen: false,
};

function InferImages({ userData, state, url, onApply, onChange }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [istate, updateIstate] = useState(initialstate);
    const [imagePreview, setImagePreview] = useState(null);
    const [resultImage, setResultImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const { conf, onOpen } = istate;
    const dispatch = useDispatch();

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            setSelectedFile(null);
            setImagePreview(null);
            toast.error('Please select a valid image file (jpg, png, etc.)', commomObj);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
        maxFiles: 1,
    });

    const saveHandler = async () => {
        if (!selectedFile) {
            toast.error('Please select an image to infer', commomObj);
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('username', userData?.activeUser?.userName);
            formData.append('version', state?.version);
            formData.append('project', state?.name);
            formData.append('task', 'objectdetection');
            formData.append('file', selectedFile);
            formData.append('conf', conf);

            const response = await dispatch(inferImages({ payload: formData, url })).unwrap();
            const imgUrl = URL.createObjectURL(response.data);
            setResultImage(imgUrl);
            updateIstate({ ...istate, onOpen: true });
            toast.success('Inference successful', commomObj);
        } catch (error) {
            let errorMsg = 'Oops, something went wrong';
            if (error && error.data && error.data.message) {
                errorMsg = error.data.message;
            } else if (error && error.message) {
                errorMsg = error.message;
            }
            toast.error(errorMsg, commomObj);
            console.error('Error uploading file:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setSelectedFile(null);
        setImagePreview(null);
    };

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

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
                        <MdPhotoCamera className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Image Inference</h2>
                        <p className="text-sm text-slate-600">Upload an image to run inference on your trained model</p>
                    </div>
                </div>

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
                >
                    <div className="p-8 space-y-8">
                        {/* Image Upload */}
                        <ImageUploadZone
                            getRootProps={getRootProps}
                            getInputProps={getInputProps}
                            selectedFile={selectedFile}
                            onClear={handleClear}
                        />

                        {/* Image Preview */}
                        {imagePreview && (
                            <ImagePreview imagePreview={imagePreview} fileName={selectedFile?.name} />
                        )}

                        {/* Confidence Slider */}
                        <ConfidenceSlider
                            conf={conf}
                            onChange={(value) => updateIstate({ ...istate, conf: value })}
                        />
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <InferActions
                    loading={loading}
                    onInfer={saveHandler}
                    hasImage={!!selectedFile}
                />
            </motion.div>

            <InferResultModal
                onOpen={onOpen}
                output={istate}
                setOutput={updateIstate}
                userData={userData}
                state={state}
                onApply={onApply}
                onChange={onChange}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                url={url}
                resultImage={resultImage}
            />
        </>
    );
}

export default InferImages;
