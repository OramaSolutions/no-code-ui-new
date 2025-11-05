import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { createProject } from '../../reduxToolkit/Slices/projectSlices';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { commomObj } from '../../utils';

const initialState = {
    versionNumber: "",
}

function CreateVersion({ show, setShow, model }) {
    const [istate, setIstate] = useState(initialState)
    const [error, setError] = useState(false)
    const { versionNumber } = istate;
    const { openVersion, projectName } = show;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const redirect = model == "objectdetection" ? "/object-detection-training" : model == "Classification" ? "/classification-training" : "/defect-detection-training"

    const handleclose = () => {
        setShow({ ...show, openVersion: false })
    }
    const inputHandler = (e) => {
        const { name, value } = e.target;
        setIstate({ ...istate, [name]: value })
    }
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
            console.log(err, "err")
        }
    }

    return (
        <>
            <Modal
                show={openVersion}
                className="ModalBox"
                onHide={handleclose}
            >
                <Modal.Body>
                    <div className="Category">
                        <a className="CloseModal" onClick={() => handleclose()}>
                            ×
                        </a>

                        <h3>New Project</h3>
                        <div className="form-group">
                            <label>Create Version</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Version"
                                name='versionNumber'
                                value={versionNumber}
                                onChange={inputHandler}
                            />
                            {error && (!versionNumber.trim()) ? <span style={{ color: 'red' }} >"*Required to fill"</span> : ""}
                        </div>
                        <a
                            className="Button"
                            onClick={saveHandler}
                        >
                            Create Version
                        </a>


                    </div>

                </Modal.Body>
            </Modal>
        </>
    )
}

export default CreateVersion
