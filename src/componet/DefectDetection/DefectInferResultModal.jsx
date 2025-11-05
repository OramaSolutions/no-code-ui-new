import React, { useEffect, useState } from 'react'
import Loader from '../../commonComponent/Loader'
import Modal from 'react-bootstrap/Modal';

import axios from 'axios';

import { getUrl } from '../../config/config';

const url = getUrl('defectdetection')

function DefectInferResultModal({ output, setOutput, state, userData, onApply, onChange, setSelectedFile }) {
    const { inferData, onOpen } = output;
    const closeHandler = () => {
        setOutput((prev) => ({ ...prev, onOpen: !onOpen, confidence: "" }))
        setSelectedFile(null)
    }
    const remarkHandler = () => {
        console.log('remarkHandler called');
        onChange()
        onApply()
    }

    return (
        <>
            <Modal
                show={onOpen}
                className={inferData?.status == "NG" ? "ModalBox ModalRed " : "ModalBox ModalGreen "}
            > <div className="Category" >
                    <>
                        <div className="ProjectAlreadyArea" style={{ height: "auto", background: "  transparent" }}>
                            <h5>Result Image</h5>
                            <h4 style={{ textAlign: "left", display: "flex", justifyContent: "space-between", margin: "0 0 5px 0" }}>Status
                                <h3 style={{ textAlign: "right", fontSize: "16px" }}>{inferData?.status}</h3>
                            </h4>
                            {inferData ?
                                <>
                                    <figure>
                                        <h4 className='inferModal'>Score-{(inferData?.anomaly_score || 0)?.toFixed(2)}</h4>
                                        <img src={`data:image/png;base64,${inferData?.heatmap}`} height={300} width={"100%"} />
                                    </figure>
                                </>
                                : "No Image Found"}
                            <div className="col-lg-5 mx-auto">
                                <div className="flex gap-2 flex-row justify-between max-w-64">
                                    <a role="button" className="    " onClick={() => closeHandler()}>
                                        Infer More Images
                                    </a>
                                    <a role="button" className="" onClick={remarkHandler}>
                                        Continue & Add Remark
                                    </a>
                                </div>
                            </div>
                        </div>
                    </>
                </div>
            </Modal>

        </>

    )
}

export default DefectInferResultModal

