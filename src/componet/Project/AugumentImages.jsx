import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AgumentedGeneratedImage, AgumentedImage } from '../../reduxToolkit/Slices/projectSlices';
import Loader from '../../commonComponent/Loader';
import { commomObj } from '../../utils';
import { toast } from 'react-toastify';

function AugumentImages({ iState, onApply, userData, state, onChange }) {
    const { hasChangedSteps } = useSelector((state) => state.steps);
    const dispatch = useDispatch();
    const { agumentedImages, agumentedGeneratedImages, loading } = useSelector((state) => state.project)
    const [loader, setLoader] = useState(true)
    const [blobUrls, setBlobUrls] = useState([]);
    console.log(agumentedGeneratedImages, loading, "agumentedImages")

    //==========================================view preview images===========================================
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await dispatch(AgumentedImage({
                    username: userData?.activeUser?.userName,
                    version: state?.version,
                    project: state?.name,
                    task: "objectdetection",
                }));
                console.log(res, "agumenation images")
                if (res?.payload?.code === 200 && res?.payload?.images) {
                    console.log(res?.payload?.images, "res?.payload?.data")
                    const binaryString = res?.payload?.images
                    const extractedImages = binaryString?.map(img => base64ToImageUrl(img.image_base64));
                    setBlobUrls(extractedImages);
                    setLoader(false)
                } else {
                    toast.error(res?.payload?.error, commomObj)
                    setLoader(false)
                }
            } catch (err) {
                toast.error("Oops! Something went wrong", commomObj)
                console.log(err, "errr")
                setLoader(false)
            }
        }
        fetchData();
    }, []);
    //=========================================image converter===========================================
    const base64ToImageUrl = (base64) => {
        return `data:image/png;base64,${base64}`;
    };
    //============================================view all generated images===============================
    const generatedImages = async () => {
        try {
            setLoader(true)
            const res = await dispatch(AgumentedGeneratedImage({
                username: userData?.activeUser?.userName,
                version: state?.version,
                project: state?.name,
                task: "objectdetection",
            }));
            if (res?.payload?.code === 200 && res?.payload?.images) {
                console.log(res?.payload?.images, "res?.payload?.data")
                const binaryString = res?.payload?.images
                const extractedImages = binaryString?.map(img => base64ToImageUrl(img.image_base64));
                setBlobUrls(extractedImages);
                setLoader(false)
            } else {
                toast.error(res?.payload?.error, commomObj)
                setLoader(false)
            }
        } catch (err) {
            toast.error("Oops! Something went wrong", commomObj)
            console.log(err, "errr")
            setLoader(false)
        }

    }
    //=================================================next button======================================
    const saveHandler = () => {
        if (hasChangedSteps?.images) {
            onChange()
            console.log(hasChangedSteps, "hasChangedSteps")
        }
        onApply()
        setLoader(false)
    }
    return (
        <>
            <div className="Small-Wrapper">
                <h6 className="Remarks">View Augmented Images</h6>
                <div className="CommonForm">
                    <form>
                        <div className="AugmentationsBox">
                            {!loader ?
                                <ul className="PreviewAugment">
                                    {blobUrls.length > 0 ? blobUrls.map((imgSrc, index) => (
                                        <li key={index}>
                                            <figure>
                                                <img src={imgSrc} alt={`Image ${index + 1}`} />
                                            </figure>
                                        </li>
                                    )) : <h1><b><center>No Data Found</center></b></h1>}
                                </ul> : <Loader />}
                        </div>
                    </form>
                    <div className="row">
                        <div className="col-lg-7 mx-auto">
                            <div className="TwoButtons">
                                <a className="OutlineBtn" role='button' onClick={generatedImages}>
                                    View Generated Images
                                </a>
                                <a className="FillBtn" role='button' onClick={saveHandler}>
                                    Next
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default AugumentImages
