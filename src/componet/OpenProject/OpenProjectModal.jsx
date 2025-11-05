import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal';
import { projectOpen, versionList } from '../../reduxToolkit/Slices/openSlices';
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import { commomObj } from '../../utils';
import { useNavigate } from 'react-router-dom';

const initialState = {
    versionNumber: "",
}

function OpenProjectModal({ istate, setIstate }) {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [Istate, updateIstate] = useState(initialState)
    const { versionNumber } = Istate;
    const { openModal, projectName, projectId, model } = istate;

    const { versionData, loader } = useSelector((state) => state.openProject)
    const [error, setError] = useState(false)


    useEffect(() => {
        if (openModal) {
            dispatch(versionList({ projectName: projectName }))
        }
    }, [openModal])

    const handleclose = () => {
        setIstate({ ...istate, openModal: false, projectName: '' })
    }
    const saveHandler = async () => {
        if (versionNumber?.trim() == "") {
            setError(true)
        }
        else {
            try {
                const data = { name: projectName, versionNumber }
                const res = await dispatch(projectOpen(data))
                console.log(res, "<<<<res")
                if (res?.payload?.code === 200) {
                    const projectData = res?.payload?.askedProject
                    const redirect = model == "objectdetection" ? "/object-detection-training" : model == "Classification" ? "/classification-training" : "/defect-detection-training"
                    navigate(redirect, { state: { name: projectData?.name, version: projectData?.versionNumber, projectId: projectData?._id } })
                    setIstate({ ...istate, openModal: false, projectId: "" })
                    updateIstate({ ...Istate, versionNumber: "" })
                } else {
                    toast.error(res?.payload?.message, commomObj)
                }
            } catch (err) {
                console.log(err, "err")
            }
        }
    }
    return (
        <div>
            <Modal
                show={openModal}
                className="ModalBox"
                onHide={handleclose}
            >
                <Modal.Body>
                    <div className="Category">
                        <a className="CloseModal" onClick={handleclose}>
                            ×
                        </a>
                        <h3>Open Project</h3>
                        <div className="form-group">
                            <label>Select Project</label>
                            <input
                                type="text"
                                className="form-control"
                                value={projectName}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label>Select Version</label>
                            <select
                                className="form-control"
                                name='versionNumber'
                                value={versionNumber}
                                onChange={(e) => updateIstate({ ...Istate, versionNumber: e.target.value })}
                            >
                                <option value="">--select--</option>
                                {
                                    versionData?.result?.length > 0 ?
                                        versionData?.result?.map((item) => {
                                            return (
                                                <option value={item?.versionNumber}>{item?.versionNumber}</option>
                                            )
                                        })
                                        : "No Data Found"
                                }
                            </select>
                            {error && versionNumber.trim() == "" ? <span style={{ color: "red" }}>*Required to select</span> : ""}
                        </div>
                        <a
                            className="Button FolderPermissionId"
                            onClick={saveHandler}
                        >
                            Open
                        </a>
                    </div>


                </Modal.Body>
            </Modal>
        </div>
    )
}

export default OpenProjectModal
