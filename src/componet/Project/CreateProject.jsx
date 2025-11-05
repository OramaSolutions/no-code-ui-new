import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { commomObj } from '../../utils';
import { checkProject, createProject } from '../../reduxToolkit/Slices/projectSlices';
import CreateVersion from './CreateVersion';
import CheckVersion from './CheckVersion';


const initialState = {
    projectName: "",
    openVersion: false,
    openModal: false,
}

function CreateProject({ istate, setIstate }) {
    const [show, setShow] = useState(initialState)
    const [error, setError] = useState(false)
    const { projectName, openVersion, openModal } = show;
    const { open, model } = istate;
    const dispatch = useDispatch();

    const handleclose = () => {
        setIstate({ ...istate, open: false, model: "" })
    }
    const inputHandler = (e) => {
        const { name, value } = e.target;
        setShow({ ...show, [name]: value })
    }
    const saveHandler = async () => {
        try {
            if (!projectName.trim()) {
                setError(true)
            } else {
                const data = { model, name: projectName }
                const response = await dispatch(checkProject(data))
                console.log(response,"checking the toast message")
                if (response?.payload?.code === 200) {
                    toast.success(response?.payload?.message, commomObj);
                    setShow({ ...show, openVersion: true })
                    setIstate({ ...istate, open: false })
                }
                else if(response?.payload?.code === 402) {
                    toast.error(response?.payload?.message, commomObj);
                    setShow({ ...show, openModal: true })
                    setIstate({ ...istate, open: false })

                }else{
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
                show={open}
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
                            <label>New Project</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Project Name"
                                name='projectName'
                                value={projectName}
                                onChange={inputHandler}
                            />
                            {error && (!projectName.trim()) ? <span style={{ color: 'red' }} >"*Required to fill"</span> : ""}
                        </div>
                        {/* <button class="Button">Create New Project</button> */}
                        <a
                            className="Button"
                            onClick={saveHandler}
                        >
                            Create New Project
                        </a>


                    </div>

                </Modal.Body>
            </Modal>
            <CreateVersion
                show={show}
                setShow={setShow}
                model={model}
            />
            {openModal ? <CheckVersion
                show={show}
                setShow={setShow}
                model={model}
                istate={istate}
                setIstate={setIstate}
            /> : ""}
        </>
    )
}

export default CreateProject
