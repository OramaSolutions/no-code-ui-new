import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { commomObj } from '../../utils';
import { remarkData , getRemarkData} from '../../reduxToolkit/Slices/projectSlices';
import { useDispatch } from "react-redux";
import { getUrl } from '../../config/config';
const initialState = {
    observation: "",
    scopeOfImprovement: "",
    numOfTries: "",
    loading: false,
}
const url = getUrl('defectdetection')

                      
const DefectRemark = ({iState,username, task,project, version,onApply ,onChange}) => {
    const [istate, updateIstate] = useState(initialState);
    const { observation, scopeOfImprovement, numOfTries, loading } = istate;
    const [files, setFiles] = useState([]); // general files
    const [hardwareFile, setHardwareFile] = useState(null); // single .pfs file
    const [showNext, setShowNext] = useState(false); // show Next button after submit
    const [existingRemark, setExistingRemark] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchRemark() {
            try {
                const response = await dispatch(getRemarkData({ url, username, task, project, version }));
                if (response?.payload?.code === 200 && (response?.payload?.remarks?.length > 0 || response?.payload?.uploaded_files?.length > 0)) {
                    setExistingRemark(response.payload.remarks.join('\n'));
                    setUploadedFiles(response.payload.uploaded_files);
                    setIsEditMode(true);
                    // Optionally parse the remark fields if you want to prefill
                    const obsMatch = response.payload.remarks.find(r => r.startsWith('Observation:'));
                    const scopeMatch = response.payload.remarks.find(r => r.startsWith('Scope of Improvement:'));
                    const triesMatch = response.payload.remarks.find(r => r.startsWith('Number of Tries:'));
                    updateIstate(prev => ({
                        ...prev,
                        observation: obsMatch ? obsMatch.replace('Observation:', '').trim() : '',
                        scopeOfImprovement: scopeMatch ? scopeMatch.replace('Scope of Improvement:', '').trim() : '',
                        numOfTries: triesMatch ? triesMatch.replace('Number of Tries:', '').trim() : '',
                    }));
                } else {
                    setIsEditMode(false);
                }
            } catch (err) {
                setIsEditMode(false);
            }
        }
        fetchRemark();
    }, [username, task, project, version, url, dispatch]);

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
                setIsEditMode(true);
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
                <a className="AddRemarksBtn">Admin Remarks</a>
                <h6 className="Remarks">Remarks</h6>
                <div className="CommonForm">
                    {existingRemark && isEditMode && !showNext ? (
                        <div style={{marginBottom: '1rem'}}>
                            <div className="form-group">
                                <label>Existing Remarks:</label>
                                <pre style={{background: '#f8f9fa', padding: '1em', borderRadius: '5px'}}>{existingRemark}</pre>
                            </div>
                            {uploadedFiles.length > 0 && (
                                <div className="form-group">
                                    <label>Uploaded Files:</label>
                                    <ul>
                                        {uploadedFiles.map((file, idx) => (
                                            <li key={idx}>{file}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : null}
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
                            <div className="ButtonCenter" style={{display: 'flex', gap: '1rem'}}>
                                <button className="Button" type="submit" disabled={loading}>{isEditMode ? 'Update' : 'Submit'}</button>
                                {isEditMode && (
                                    <button
                                        className="Button"
                                        type="button"
                                        onClick={() => {
                                            if (typeof onChange === 'function') onChange();
                                            if (typeof onApply === 'function') onApply();
                                        }}
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        </form>
                    ) : (
                        <div className="ButtonCenter" style={{marginTop: '2rem'}}>
                            <button
                                className="Button"
                                type="button"
                                onClick={() => {
                                    if (typeof onChange === 'function') onChange();
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

export default DefectRemark;
