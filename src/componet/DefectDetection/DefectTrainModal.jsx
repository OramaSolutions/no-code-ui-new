import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import DefectVisualize from './DefectVisualize';
import { DefectModalTrain, InferAccuracy } from '../../reduxToolkit/Slices/defectSlices';
import Loader from '../../commonComponent/Loader';
import { toast } from 'react-toastify';
import { commomObj } from '../../utils';


function DefectTrainModal({ data, setData, onApply, state, userData, type, model }) {
    const dispatch = useDispatch();
    const { defectTrainData,inferAccuracyData,loading } = useSelector((state) => state.defectDetection)
    const newData=type=="infer"?inferAccuracyData:defectTrainData
    console.log(inferAccuracyData, "inferAccuracyData")
    //================USEEFFECT TO HIT TRAIN API========================================
    useEffect(() => {
        const getData = async () => {
            const res = await dispatch(DefectModalTrain({ username: userData?.activeUser?.userName, version: state?.version, project: state?.name, task: "defectdetection", model: model }))            
            if (!res?.payload?.confusion_matrix) {
                toast.error(res?.payload?.message, commomObj)
            } 
            else {
                setData(prev => ({ ...prev, isTrainDataLoaded: true, defectTrainData: res?.payload }));
            }
        }
        const getAccuracyData=async()=>{
            const res = await dispatch(InferAccuracy({ username: userData?.activeUser?.userName, version: state?.version, project: state?.name, task: "defectdetection", model: model })) 
            console.log(res, "response of defect train data")          
            if (!res?.payload?.confusion_matrix) {
                toast.error(res?.payload?.message, commomObj)
            }           
        }
        if (data.opendefectTraining && !data.isTrainDataLoaded&&type!="infer") {
            getData();
        }else if(type=="infer"){
            getAccuracyData()
        }


    }, [data.opendefectTraining])

    const handleclose = () => {
        setData({ ...data, opendefectTraining: false })
    }
    const openModal = () => {
        setData((prev) => ({ ...prev, openVisualize: true, opendefectTraining: false }))

    }
    return (
        <div>
            <Modal
                show={data.opendefectTraining}
                className="ModalBox"
                // onHide={handleclose}
            >
                <Modal.Body>
                    <div className="Category">                       
                        <h3>Accuracy Matrix</h3>
                        {!loading ? <>
                            <div className='newTable'>
                                <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Correct Predictions <br /> (n)</th>
                                            <th>Incorrect Predictions  <br /> (n)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {newData?.confusion_matrix && Object.keys(newData?.confusion_matrix)?.length > 0 ?
                                            <>
                                                <tr>
                                                    <td>Class {`<good>`} </td>
                                                    <td>{newData?.confusion_matrix?.Class_good?.Correct_Predictions}</td>
                                                    <td>{newData?.confusion_matrix?.Class_good?.Incorrect_Predictions}</td>
                                                </tr>
                                                <tr>
                                                    <td>Class {`<bad>`} </td>
                                                    <td>{newData?.confusion_matrix?.Class_bad?.Correct_Predictions}</td>
                                                    <td>{newData?.confusion_matrix?.Class_bad?.Incorrect_Predictions}</td>
                                                </tr>
                                            </> : (
                                                <tr>
                                                    <td colspan={3}>
                                                       No Data found
                                                    </td>
                                                </tr>)}
                                    </tbody>
                                </table>
                            </div>
                            {type=="infer"?<a className="Button FolderPermissionId" style={{ marginTop: "31px"}} onClick={handleclose} >Next</a>:<a className="Button FolderPermissionId" style={{ marginTop: "31px", pointerEvents: loading ? 'none' : '' }} onClick={openModal} >Visualize Results</a>}
                        </>
                            :
                            <div className="ProjectAlreadyArea">
                               { type!="infer"&&<h5>Training is in Process</h5>}
                                <Loader
                                    item={"160px"}
                                    Visible={true}
                                />
                               {type!="infer"&&<h6>Please be patient, it may take some time</h6>}
                            </div>
                        }
                    </div>

                </Modal.Body>
            </Modal>
        </div>

    )
}

export default DefectTrainModal
