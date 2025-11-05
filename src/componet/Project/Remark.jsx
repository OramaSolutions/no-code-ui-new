import React, { useState } from 'react'
import { useLocation,useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { commomObj } from '../../utils';
import { remarkData } from '../../reduxToolkit/Slices/projectSlices';
import { useDispatch, useSelector } from "react-redux";

const initialState = {
    projectId: "",
    ovservation: "",
    scopeOfImprovement: "",
    numOfTries: "",
    date: "",
    hardwareSetting: "",
    loading:false,
}

function Remark() {
    const[istate,updateIstate]=useState(initialState)
    const{projectId,ovservation,scopeOfImprovement,numOfTries,date,hardwareSetting,loading}=istate;
    const state=useLocation();
    const navigate=useNavigate();
    const dispatch=useDispatch();

    const inputHandler=(e)=>{
        const{name,value}=e.target;
        updateIstate({...istate,[name]:value})
    }
    console.log(istate,"istate of remark")
    const saveHandler = async () => {
        try {
            updateIstate({...istate,loading:true})
            const data={
                projectId:state?.projectId,
                ovservation,scopeOfImprovement,numOfTries,date,hardwareSetting
            }
            const response = await dispatch(remarkData(data))
            if (response?.payload?.code === 200) {
                updateIstate({...istate,loading:false})
                toast.success(response?.payload?.message, commomObj)
                navigate("/project")
            } else {
                toast.error(response?.payload?.error, commomObj)
                updateIstate({...istate,loading:false})
            }
        } catch (error) {
            toast.error("Oops,something went wrong", commomObj)
            console.error("Error uploading file:", error);
            updateIstate({...istate,loading:false})
        }
    }
    return (
        <>
            <div className="Small-Wrapper">
                <a className="AddRemarksBtn">
                    Admin Remarks
                </a>
                <h6 className="Remarks">Remarks</h6>
                <div className="CommonForm">
                    <form>
                        <div className="form-group">
                            <label>Observations</label>
                            <textarea
                                rows={3}
                                className="form-control"
                                placeholder="Enter your Observations"
                                name="ovservation"
                                value={ovservation}
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
                                    <label>Hardware Settings</label>
                                    <div className="Upload">
                                        <span>
                                            <img src="images/folder-open.png" /> Drag or browser from device
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="ButtonCenter">
                            <button className="Button" onClick={saveHandler} disabled={loading}>Done</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Remark
