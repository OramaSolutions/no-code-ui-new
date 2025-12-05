import React, { useEffect, useState } from 'react'
import Loader from '../../commonComponent/Loader'
import Modal from 'react-bootstrap/Modal';

import axios from 'axios';
import { getUrl } from '../../config/config';
const url = getUrl('classification')
function ClassInferResultModal({ onOpen, prediction, setOutput, state, userData, selectedFile, preview, setPreview, onChange, onApply }) {
    const [loading, setLoading] = useState(null);
    const [inferPrediction, setInferprediction] = useState([]);

    useEffect(() => {
        if (onOpen && selectedFile) {
            const fetchImageData = async () => {
                try {
                    setLoading(true);
                    const URL = `${url}top_${prediction}_accuracy?username=${userData?.activeUser?.userName}&task=classification&project=${state?.name}&version=${state?.version}`;
                    const response = await axios.get(URL);
                    // console.log('response', response.data, prediction)
                    setInferprediction(response?.data?.[`top_${prediction}_accuracy`]);
                    setLoading(false);

                } catch (error) {
                    console.error("Error fetching image data", error);
                    setLoading(null);
                }
            };
            fetchImageData();
        }
    }, [onOpen, selectedFile, prediction]);

    const closeHandler = () => {
        setOutput(prev => ({ ...prev, onOpen: false }));
        setPreview(null)
    }
    const remarkHandler = () => {
        console.log('remarkHandler called');
        onChange()
        onApply()
    }

    return (
        <Modal show={onOpen} className="ModalBox ModalWidth50">
            <div className="ProjectAlreadyArea" style={{ height: "auto" }}>
                <div className="ProjectAlready">
                    <h2>Classification Infer Result</h2>

                    {preview && (
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <img
                                src={preview}
                                alt="Uploaded preview"
                                style={{ maxWidth: '100%', maxHeight: '300px' }}
                            />
                        </div>
                    )}

                    <p>The Top {prediction} Predictions are- </p>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>ClassName</th>
                                <th>Confidence</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading ?
                                inferPrediction?.length > 0 ?
                                    inferPrediction?.map((item, i) => (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{item?.classname}</td>
                                            <td>{item?.conf}</td>
                                        </tr>
                                    ))
                                    :
                                    <tr>
                                        <td colSpan={3}><h3>No Data found</h3></td>
                                    </tr>
                                : <Loader />
                            }
                        </tbody>
                    </table>
                    <div className="TwoButtons">
                        <a role="button" className="OutlineBtn" onClick={closeHandler}>
                            Continue
                        </a>
                        <a role="button" className="OutlineBtn" onClick={remarkHandler}>
                            Add Remarks
                        </a>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ClassInferResultModal