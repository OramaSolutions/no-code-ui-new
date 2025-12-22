import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AgumentedGeneratedImage, AgumentedImage } from '../../reduxToolkit/Slices/projectSlices';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { commomObj } from '../../utils';
import { HiPhotograph } from 'react-icons/hi';
import { MdCheckCircle, MdClose } from 'react-icons/md';

function AugumentImages({ onApply, username, state, onChange, url }) {
    const { hasChangedSteps } = useSelector((state) => state.steps);
    const dispatch = useDispatch();
    const { agumentedImages, agumentedGeneratedImages, loading } = useSelector((state) => state.project);
    const [loader, setLoader] = useState(true);
    const [blobUrls, setBlobUrls] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchThumbnails = async () => {
            console.log('Fetching dataset thumbnails...');
            try {
                const response = await fetch(
                    `${url}get_thumbnails?username=${username}&task=objectdetection&project=${state?.name}&version=${state?.version}&thumbnail_name=preview_images_thumbnails`,
                    { method: 'GET' }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Thumbnails API response:", data);

                if (data?.thumbnails && data.thumbnails.length > 0) {
                    setBlobUrls(data.thumbnails);
                    setLoader(false);
                } else {
                    toast.error('No thumbnails found', commomObj);
                    setLoader(false);
                }
            } catch (err) {
                console.error("Error fetching thumbnails:", err);
                toast.error("Oops! Something went wrong", commomObj);
                setLoader(false);
            }
        };

        fetchThumbnails();
    }, [url, username, state?.name, state?.version]);

    const base64ToImageUrl = (base64) => {
        return `data:image/png;base64,${base64}`;
    };

    const generatedImages = async () => {
        try {
            const payload = {
                username: username,
                version: state?.version,
                project: state?.name,
                task: "objectdetection",
            };
            setLoader(true);
            const res = await dispatch(AgumentedGeneratedImage({ payload, url }));
            if (res?.payload?.code === 200 && res?.payload?.images) {
                console.log(res?.payload?.images, "res?.payload?.data");
                const binaryString = res?.payload?.images;
                const extractedImages = binaryString?.map(img => base64ToImageUrl(img.image_base64));
                setBlobUrls(extractedImages);
                setLoader(false);
            } else {
                toast.error(res?.payload?.error, commomObj);
                setLoader(false);
            }
        } catch (err) {
            toast.error("Oops! Something went wrong", commomObj);
            console.log(err, "errr");
            setLoader(false);
        }
    };

    const saveHandler = () => {
        if (hasChangedSteps?.images) {
            onChange();
            console.log(hasChangedSteps, "hasChangedSteps");
        }
        onApply();
        setLoader(false);
    };

    const openImageModal = (imgSrc, index) => {
        setSelectedImage({ src: imgSrc, index });
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8 "
            >
                {/* Header Section */}
                <div className="flex items-center gap-3">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg"
                    >
                        <HiPhotograph className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Augmented Images</h2>
                        <p className="text-sm text-slate-600">Preview your augmented dataset images</p>
                    </div>
                </div>

                {/* Image Gallery */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
                >
                    <div className="p-6">
                        {loader ? (
                            <div className="flex items-center justify-center min-h-[400px]">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
                                />
                            </div>
                        ) : blobUrls.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {blobUrls.map((imgSrc, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05, duration: 0.3 }}
                                        whileHover={{ scale: 1.05, zIndex: 10 }}
                                        onClick={() => openImageModal(imgSrc, index)}
                                        className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                    >
                                        <img
                                            src={imgSrc}
                                            alt={`Augmented Image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            whileHover={{ opacity: 1 }}
                                            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-2"
                                        >
                                            <span className="text-white text-xs font-medium">#{index + 1}</span>
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
                                <HiPhotograph className="w-20 h-20 mb-4 opacity-30" />
                                <p className="text-xl font-semibold">No Data Found</p>
                                <p className="text-sm mt-2">No augmented images available to display</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center gap-4"
                >
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={saveHandler}
                        disabled={loader}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <span>Next</span>
                        <MdCheckCircle className="w-5 h-5" />
                    </motion.button>
                </motion.div>

                {/* Image Count Badge */}
                {!loader && blobUrls.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex justify-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-full">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-slate-700">
                                {blobUrls.length} {blobUrls.length === 1 ? 'image' : 'images'} loaded for preview
                            </span>
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {/* Image Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeImageModal}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Close Button */}
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            onClick={closeImageModal}
                            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
                        >
                            <MdClose className="w-6 h-6" />
                        </motion.button>

                        {/* Image Container */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-5xl max-h-[90vh]  rounded-sm overflow-hidden shadow-2xl"
                        >
                            <img
                                src={selectedImage.src}
                                alt={`Augmented Image ${selectedImage.index + 1}`}
                                className="w-full h-full object-contain rounded-sm"
                            />
                            
                            {/* Image Number Badge */}
                            {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                                Image #{selectedImage.index + 1} of {blobUrls.length}
                            </div> */}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default AugumentImages;
