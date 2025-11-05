import React, { useEffect, useState } from 'react'
import Header from '../../commonComponent/Header'
import Sidenav from '../../commonComponent/Sidenav'
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { markStepChanged, clearStepChange } from '../../reduxToolkit/Slices/stepSlices'
import Defectlabelled from './Defectlabelled';
import DefectDataSplit from './DefectDataSplit';
import DefectHypertune from './DefectHypertune';
import DefectInfer from './DefectInfer';
import axios from 'axios';
import { getUrl } from '../../config/config';
import DefectRemark from './DefectRemark';
import Application from './Application'
const url = getUrl('defectdetection')
console.log('url', url)
function DefectTraining() {
    const dispatch = useDispatch();
    const [iState, updateIstate] = useState("labelled")
    const userData = JSON.parse(window.localStorage.getItem("userLogin"))
    const { hasChangedSteps } = useSelector((state) => state.steps);
    const [completedSteps, setCompletedSteps] = useState({
        labelled: false,
        HyperTune: false,
        infer: false,
        remark: false,
        trainingStatus: false,
    });
    const { state } = useLocation();

    const stepsOrder = ['labelled', 'HyperTune', 'infer', 'remark', 'application'];

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await axios.get(`${url}status?username=${userData?.activeUser?.userName}&task=defectdetection&project_name=${state?.name}&version=${state?.version}`)
                console.log(res, "response for opening the step in defect", "HELLO")
                if (res?.status === 200) {
                    if (res?.data?.status == "training_completed_successfully") {
                        setCompletedSteps({ ...completedSteps, labelled: true, HyperTune: true, remark: true })
                        handleApply("HyperTune")
                    } else if (res?.data?.status == "labelled") {
                        handleApply("labelled")
                    } else if (res?.data?.status == "HyperTune") {
                        setCompletedSteps({ ...completedSteps, trainingStatus: true })
                        handleApply("labelled")
                    } else {
                        updateIstate("labelled")
                    }
                }
            } catch (err) {
                console.log(err, "err")
            }
        }

        fetchStatus()
    }, [])

    const handleApply = (step) => {
        setCompletedSteps((prevSteps) => ({ ...prevSteps, [step]: true }));

        const nextStepIndex = stepsOrder.indexOf(step) + 1;
        if (nextStepIndex < stepsOrder.length) {
            updateIstate(stepsOrder[nextStepIndex]);
        }
        if (hasChangedSteps[step]) {
            console.log(`API called for step: ${step}`);
            dispatch(clearStepChange({ step }));
        }
    };
    const handleChange = (step) => {
        dispatch(markStepChanged({ step }));
    };
    const isStepAccessible = (step) => {
        const stepIndex = stepsOrder?.indexOf(step);
        return stepIndex === 0 || completedSteps[stepsOrder[stepIndex - 1]];
    };
    return (
        <div>
            <Header />
            <Sidenav />
            <div className="WrapperArea">
                <div className="WrapperBox">
                    <div className="NewTitleBox">
                        <h2 className="NewTitle">
                            {state?.name} / <span>Version {state?.version}</span>
                        </h2>
                        <h4 className="NewTitle">Model: defectdetection</h4>
                    </div>
                    <div className="StepBox">
                        <ul>
                            <li className="active">
                                <a className="Text"
                                    onClick={() => isStepAccessible('labelled') && updateIstate('labelled')}
                                    style={{ pointerEvents: isStepAccessible('labelled') ? 'auto' : 'none', color: isStepAccessible('labelled') ? 'inherit' : '#aaa' }}
                                >
                                    Labelled Data
                                </a>
                            </li>
                            <li className={iState == "labelled" ? "" : "active"}>
                                <a className="Text"
                                    onClick={() => isStepAccessible('HyperTune') && updateIstate("HyperTune")}
                                    style={{ pointerEvents: isStepAccessible('HyperTune') ? 'auto' : 'none', color: isStepAccessible('HyperTune') ? 'inherit' : '#aaa' }}
                                >
                                    Tune Hyper Parameters
                                </a>
                            </li>
                            <li className={iState == "labelled" || iState == "HyperTune" ? "" : "active"}>
                                <a className="Text"
                                    onClick={() => isStepAccessible('infer') && updateIstate("infer")}
                                    style={{ pointerEvents: isStepAccessible('infer') ? 'auto' : 'none', color: isStepAccessible('infer') ? 'inherit' : '#aaa' }}
                                >
                                    Infer Images
                                </a>
                            </li>
                            <li className={iState == "labelled" || iState == "HyperTune" ? "" || iState === 'infer' : "active"}>
                                <a className="Text"
                                    onClick={() => isStepAccessible('remark') && updateIstate("remark")}
                                    style={{ pointerEvents: isStepAccessible('remark') ? 'auto' : 'none', color: isStepAccessible('remark') ? 'inherit' : '#aaa' }}
                                >
                                    Remarks
                                </a>
                            </li>
                            <li className={iState == "application" ? "active" : ""}>
                                <a className="Text"
                                    onClick={() => isStepAccessible('remark') && updateIstate("remark")}
                                    style={{ pointerEvents: isStepAccessible('remark') ? 'auto' : 'none', color: isStepAccessible('remark') ? 'inherit' : '#aaa' }}
                                >
                                    Application
                                </a>
                            </li>
                        </ul>
                    </div>
                    {iState == "labelled" && <Defectlabelled
                        iState={iState}
                        state={state}
                        userData={userData}
                        onApply={() => handleApply('labelled')}
                        onChange={() => handleChange("dataSplit")}
                    />}
                    {iState == "HyperTune" && <DefectHypertune
                        iState={iState}
                        setIstate={updateIstate}
                        state={state}
                        userData={userData}
                        onApply={() => handleApply('HyperTune')}
                        onChange={() => handleChange("infer")}
                        trainingStatus={completedSteps.trainingStatus}
                    />}
                    {iState == "infer" && <DefectInfer
                        iState={iState}
                        updateIstate={updateIstate}
                        state={state}
                        userData={userData}
                        onApply={() => handleApply('infer')}
                        onChange={() => handleChange("remark")}
                    />}

                    {iState == "remark" && <DefectRemark
                        iState={iState}
                        updateIstate={updateIstate}
                        state={state}
                        userData={userData}
                        username={userData?.activeUser?.userName}
                        task="defectdetection"
                        project={state?.name}
                        version={state?.version}
                        onApply={() => handleApply('remark')}
                        onChange={() => handleChange("application")}
                    />}
                    {iState == "application" && <Application
                        iState={iState}
                        setIstate={updateIstate}
                        state={state}
                        userData={userData}
                        onApply={() => handleApply('application')}
                        onChange={() => handleChange("application")}
                    />}
                </div>
            </div>

        </div>
    )
}

export default DefectTraining

