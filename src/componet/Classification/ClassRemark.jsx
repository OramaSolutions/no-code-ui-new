import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { commomObj } from '../../utils';
import { remarkData } from '../../reduxToolkit/Slices/projectSlices';
import { useDispatch } from "react-redux";
import { getUrl } from '../../config/config';
const initialState = {
    observation: "",
    scopeOfImprovement: "",
    numOfTries: "",
    loading: false,
}
const url = getUrl('classification')
//  iState={iState}
//                         updateIstate={updateIstate}
//                         state={state}
//                         userData={userData}
//                         onApply={() => handleApply('remark')}
//                         onChange={() => handleChange("remark")}


function ClassRemark({ username, task, project, version, onApply, ...props }) {
    const [istate, updateIstate] = useState(initialState);
    const { observation, scopeOfImprovement, numOfTries, loading } = istate;
    const [files, setFiles] = useState([]); // general files
    const [hardwareFile, setHardwareFile] = useState(null); // single .pfs file
    const [showNext, setShowNext] = useState(false); // show Next button after submit
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const inputHandler = (e) => {
        const { name, value } = e.target;
        updateIstate({ ...istate, [name]: value });
    };

    const fileHandler = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const hardwareFileHandler = (e) => {
        setHardwareFile(e.target.files && e.target.files[0] ? e.target.files[0] : null);
    };

    const saveHandler = async (e) => {
        e.preventDefault();
        try {
            updateIstate((prev) => ({ ...prev, loading: true }));
            // Build remark text from fields (no hardwareSetting text)
            const remarkText = `Observation: ${observation}\nScope of Improvement: ${scopeOfImprovement}\nNumber of Tries: ${numOfTries}`;
            const formData = new FormData();
            formData.append('username', username || '');
            formData.append('task', task || 'classification');
            formData.append('project', project || '');
            formData.append('version', version || '');
            formData.append('remark', remarkText);
            files.forEach((file) => {
                formData.append('files', file);
            });
            if (hardwareFile) {
                formData.append('files', hardwareFile);
            }
            const response = await dispatch(remarkData({ payload: formData, url }));
            if (response?.payload?.code === 201) {
                updateIstate((prev) => ({ ...prev, loading: false }));
                toast.success(response?.payload?.message, commomObj);
                setShowNext(true); // Show Next button
                // Do not call onApply here, wait for Next button
            } else {
                toast.error(response?.payload?.message || response?.payload?.error, commomObj);
                updateIstate((prev) => ({ ...prev, loading: false }));
            }
        } catch (error) {
            toast.error("Oops, something went wrong", commomObj);
            console.error("Error uploading file:", error);
            updateIstate((prev) => ({ ...prev, loading: false }));
        }
    };

    return (
        <div>
            <div className="Small-Wrapper">
                <a className="AddRemarksBtn">
                    Admin Remarks
                </a>
                <h6 className="Remarks">Remarks</h6>
                <div className="CommonForm">
                    {!showNext ? (
                        <form onSubmit={saveHandler} encType="multipart/form-data">
                            <div className="form-group">
                                <label>Observations</label>
                                <textarea
                                    rows={3}
                                    className="form-control"
                                    placeholder="Enter your Observations"
                                    name="observation"
                                    value={observation}
                                    onChange={inputHandler}
                                />
                            </div>
                            <div className="form-group">
                                <label>Scope of Improvement</label>
                                <textarea
                                    rows={3}
                                    className="form-control"
                                    placeholder="Enter your Scope of Improvement"
                                    name="scopeOfImprovement"
                                    value={scopeOfImprovement}
                                    onChange={inputHandler}
                                />
                            </div>
                            <div className="form-group">
                                <label>Number of Tries</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter Number of Tries"
                                    name="numOfTries"
                                    value={numOfTries}
                                    onWheel={(e) => e.target.blur()}
                                    onChange={inputHandler}
                                />
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <fieldset disabled="">
                                        <div className="form-group">
                                            <label>Date</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={new Date().toISOString().split("T")[0]}
                                                readOnly
                                            />
                                        </div>
                                    </fieldset>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Hardware Settings (.pfs file)</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept=".pfs"
                                            onChange={hardwareFileHandler}
                                        />
                                        {hardwareFile && <span style={{fontSize:'0.9em'}}>{hardwareFile.name}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Attach Files (.pdf, .pfs allowed)</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    multiple
                                    accept=".pdf,.pfs"
                                    onChange={fileHandler}
                                />
                            </div>
                            <div className="ButtonCenter">
                                <button className="Button" type="submit" disabled={loading}>Submit</button>
                            </div>
                        </form>
                    ) : (
                        <div className="ButtonCenter" style={{marginTop: '2rem'}}>
                            <button
                                className="Button"
                                type="button"
                                onClick={() => {
                                    if (typeof props.onChange === 'function') props.onChange();
                                    if (typeof onApply === 'function') onApply();
                                }}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ClassRemark;
