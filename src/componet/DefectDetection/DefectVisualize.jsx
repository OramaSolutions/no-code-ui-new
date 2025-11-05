import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';


function DefectVisualize({ onApply, state, userData, task, setData, data, model }) {
    const { defectTrainData } = data;
    const handleclose = () => {
        setData({ ...data, openVisualize: false })
        onApply();
    }
    const backHandler = () => {
        setData({ ...data, opendefectTraining: true, openVisualize: false })       
    }
    return (
        <div>
            <Modal
                show={data.openVisualize}
                className="ModalBox MediumModal"
            >
                <Modal.Body>
                    <div className="Category">
                        <div className="ProjectAlreadyArea bg-white">
                            <h5>Result</h5>
                            <div className="MachineBox">
                                <h5 className='text-left ml-2 mb-3'>Bad Heatmaps-</h5>
                                <ul className="PreviewAugment">
                                    {defectTrainData?.bad_heatmaps?.length > 0 ? defectTrainData?.bad_heatmaps?.map((imgSrc, index) => (
                                        <li>
                                            <figure>
                                                <img key={index} src={`data:image/png;base64,${imgSrc}`} alt={`Image ${index + 1}`} />
                                            </figure>
                                        </li>
                                    )) : <p style={{ color: "red", marginLeft: "250px" }}><b>No Data Found</b></p>}
                                </ul>
                                <h5 className='text-left ml-2 mb-3'>Good Heatmaps-</h5>
                                <ul className="PreviewAugment">
                                    {defectTrainData?.good_heatmaps?.length > 0 ? defectTrainData?.good_heatmaps?.map((imgSrc, index) => (
                                        <li>
                                            <figure>
                                                <img key={index} src={`data:image/png;base64,${imgSrc}`} alt={`Image ${index + 1}`} />
                                            </figure>
                                        </li>
                                    )) : <p style={{ color: "red", marginLeft: "250px" }}><b>No Data Found</b></p>}
                                </ul>
                            </div>
                        </div>
                        <div className="TwoButtons">
                            <a role="button" className=" Button FolderPermissionId" onClick={() => backHandler()} style={{ width: "19%" }}>
                                Back
                            </a>
                            <a className="Button FolderPermissionId" onClick={handleclose} style={{ width: "19%", marginLeft: "40%" }}>Next</a>
                        </div>
                    </div>

                </Modal.Body>
            </Modal>          
        </div>
    )
}

export default DefectVisualize
