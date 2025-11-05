import React, { useEffect, useState } from 'react'
import Loader from '../../commonComponent/Loader'
import Modal from 'react-bootstrap/Modal';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function InferResultModal({ onOpen, output, setOutput, state, userData, selectedFile, setSelectedFile, url }) {
    const navigate = useNavigate();
    const [imageData, setImageData] = useState("")
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        if (onOpen && selectedFile) {
            const fetchImageData = async () => {
                if (onOpen && selectedFile) {
                    try {
                        setLoading(true);
                        const timestamp = new Date().getTime();
                        const inferUrl = `${url}infer_yolov8?username=${userData?.activeUser?.userName}&task=objectdetection&project=${state?.name}&version=${state?.version}&timestamp=${timestamp}`;
                        const response = await axios.get(inferUrl, {
                            responseType: 'blob', // ✅ critical for binary/image data
                        });
                        const imageBlob = response.data;
                        const imageUrl = URL.createObjectURL(imageBlob);
                        setImageData(imageUrl);
                        setLoading(false);
                    } catch (error) {
                        console.error("Error fetching image data", error);
                        setLoading(null);
                    }
                }
            };

            fetchImageData();
        }
    }, [onOpen, selectedFile]);

    const closeHandler = () => {
        setOutput((prev) => ({ ...prev, onOpen: !onOpen }))
        setSelectedFile(null)
        setImageData("")
        setLoading(null)
    }
    return (
        <>
            <Modal
                show={onOpen}
                className="ModalBox ModalWidth75"
            >
                <Modal.Body >
                    <div className="Category" >
                        <>
                            <div className="ProjectAlreadyArea" style={{ height: "auto" }}>
                                <h5>Result Image</h5>
                                {!loading ?
                                    <figure>
                                        <img src={imageData} height={550} />
                                    </figure>
                                    : <Loader
                                        className="text-align-end"
                                        item={"440px"}
                                        style={{
                                            textAlign: "justify !important"
                                        }}
                                    />}
                                <div className="col-lg-5 mx-auto">
                                    <div className="TwoButtons">
                                        <a role="button" className="OutlineBtn" onClick={() => closeHandler()}>
                                            Continue
                                        </a>
                                        <a role='button' className="FillBtn" onClick={() => navigate("")}>
                                            Remark
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </>
                    </div>
                </Modal.Body>
            </Modal>

        </>

    )
}

export default InferResultModal
