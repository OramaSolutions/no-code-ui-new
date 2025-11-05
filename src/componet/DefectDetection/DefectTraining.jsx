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
import { useStepPersistence } from './useStepPersistence';
import Loader from '../../commonComponent/Loader'
const url = getUrl('defectdetection')
// console.log('url', url)

function DefectTraining() {
    const dispatch = useDispatch();
    const [iState, updateIstate] = useState(null);// Keep existing state
    const userData = JSON.parse(window.localStorage.getItem("userLogin"))
    const { hasChangedSteps } = useSelector((state) => state.steps);

    // Keep existing completedSteps for backward compatibility
    const [completedSteps, setCompletedSteps] = useState({
        labelled: false,
        HyperTune: false,
        infer: false,
        remark: false,
        trainingStatus: false,
    });

    const { state } = useLocation();
    const projectId = state.projectId
    // console.log('state', state )
    const stepsOrder = ['labelled', 'HyperTune', 'infer', 'remark', 'application'];

    // Integrate useStepPersistence
    const { stepStatus, currentStep, isLoading, fetchProjectStatus, updateStepStatus, isStepAccessible } =
        useStepPersistence(userData, state);

    // Initialize and sync with backend status
    useEffect(() => {
        fetchProjectStatus();
    }, []);

    // Sync iState with currentStep from backend
    useEffect(() => {
        if (!isLoading && currentStep) {
            updateIstate(currentStep);
        }
    }, [currentStep, isLoading]);

    // Sync completedSteps with stepStatus for backward compatibility
    useEffect(() => {
        if (stepStatus) {
            const newCompletedSteps = {};
            Object.keys(stepStatus).forEach(step => {
                newCompletedSteps[step] = stepStatus[step].status === 'completed';
            });
            setCompletedSteps(prev => ({ ...prev, ...newCompletedSteps }));
        }
    }, [stepStatus]);

    // Enhanced handleApply that updates backend and maintains existing behavior
    const handleApply = async (step) => {
        try {
            // Update backend status
            await updateStepStatus(step, 'completed');

            // Update local state for immediate UI feedback
            setCompletedSteps((prevSteps) => ({
                ...prevSteps,
                [step]: true
            }));

            // Move to next step
            const nextStepIndex = stepsOrder.indexOf(step) + 1;
            if (nextStepIndex < stepsOrder.length) {
                const nextStep = stepsOrder[nextStepIndex];
                updateIstate(nextStep);
                await updateStepStatus(nextStep, 'in_progress');
            }

            // Clear Redux step change if needed
            if (hasChangedSteps[step]) {
                console.log(`API called for step: ${step}`);
                dispatch(clearStepChange({ step }));
            }
        } catch (error) {
            console.error('Error updating step status:', error);
            // Fallback to original behavior if backend fails
            setCompletedSteps((prevSteps) => ({
                ...prevSteps,
                [step]: true
            }));
            const nextStepIndex = stepsOrder.indexOf(step) + 1;
            if (nextStepIndex < stepsOrder.length) {
                updateIstate(stepsOrder[nextStepIndex]);
            }
        }
    };

    // Enhanced handleChange that updates backend
    const handleChange = async (step) => {
        try {
            dispatch(markStepChanged({ step }));
            if (isStepAccessible(step)) {
                await updateStepStatus(step, 'in_progress');
            }
        } catch (error) {
            console.error('Error updating step change:', error);
            // Continue with original Redux behavior
            dispatch(markStepChanged({ step }));
        }
    };

    // Show loader while fetching status
    if (isLoading || !iState) {
        return (
            <div>
                <Header />
                <Sidenav />
                <div className="WrapperArea">
                    <div className="WrapperBox">
                        <Loader />
                    </div>
                </div>
            </div>
        );
    }

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
                            <li className={iState === "labelled" ? "active" : ""}>
                                <a className="Text"
                                    onClick={() => isStepAccessible('labelled') && updateIstate('labelled')}
                                    style={{ pointerEvents: isStepAccessible('labelled') ? 'auto' : 'none', color: isStepAccessible('labelled') ? '#3cab4a' : '#aaa' }}
                                >
                                    Upload Labelled Data
                                    {stepStatus?.labelled?.status === 'completed' && ' ✓'}
                                </a>
                            </li>
                            <li className={iState === "HyperTune" ? "active" : ""}>
                                <a className="Text"
                                    onClick={() => isStepAccessible('HyperTune') && updateIstate("HyperTune")}
                                    style={{ pointerEvents: isStepAccessible('HyperTune') ? 'auto' : 'none', color: isStepAccessible('HyperTune') ? '#3cab4a' : '#aaa' }}
                                >
                                    Tune Hyper Parameters
                                    {stepStatus?.HyperTune?.status === 'completed' && ' ✓'}
                                </a>
                            </li>
                            <li className={iState === "infer" ? "active" : ""}>
                                <a className="Text"
                                    onClick={() => isStepAccessible('infer') && updateIstate("infer")}
                                    style={{ pointerEvents: isStepAccessible('infer') ? 'auto' : 'none', color: isStepAccessible('infer') ? '#3cab4a' : '#aaa' }}
                                >
                                    Infer Images
                                    {stepStatus?.infer?.status === 'completed' && ' ✓'}
                                </a>
                            </li>
                            <li className={iState === "remark" ? "active" : ""}>
                                <a className="Text"
                                    onClick={() => isStepAccessible('remark') && updateIstate("remark")}
                                    style={{ pointerEvents: isStepAccessible('remark') ? 'auto' : 'none', color: isStepAccessible('remark') ? '#3cab4a' : '#aaa' }}
                                >
                                    Remarks
                                    {stepStatus?.remark?.status === 'completed' && ' ✓'}
                                </a>
                            </li>
                            <li className={iState === "application" ? "active" : ""}>
                                <a className="Text"
                                    onClick={() => isStepAccessible('application') && updateIstate("application")}
                                    style={{ pointerEvents: isStepAccessible('application') ? 'auto' : 'none', color: isStepAccessible('application') ? '#3cab4a        ' : '#aaa' }}
                                >
                                    Application
                                    {stepStatus?.application?.status === 'completed' && ' ✓'}
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
                        url={url}
                        setIstate={updateIstate}
                        state={state}
                        userData={userData}
                        username={userData?.activeUser?.userName}
                        task="defectdetection"
                        project={state?.name}
                        version={state?.version}
                        onApply={() => handleApply('application')}
                        onChange={() => handleChange("application")}
                    />}
                </div>
            </div>

        </div>
    );
}


export default DefectTraining