import React, { useState, useEffect } from 'react'
import Header from '../../commonComponent/Header'
import Sidenav from '../../commonComponent/Sidenav'
import Classlabelled from './Classlabelled'
import Classagumentation from './Classagumentation'
import ClassAgumentImages from './ClassAgumentImages'
import ClassDataSplit from './ClassDataSplit'
import ClassHyperTune from './ClassHyperTune'
import ClassInferImages from './ClassInferImages'
import ClassRemark from './ClassRemark'
import Application from './Application'
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { markStepChanged, clearStepChange } from '../../reduxToolkit/Slices/stepSlices'

function ClassificationTraining() {
    const dispatch = useDispatch();
    const { state } = useLocation();
    // const [iState, updateIstate] = useState("infer")
    const userData = JSON.parse(window.localStorage.getItem("userLogin"))
    const { hasChangedSteps } = useSelector((state) => state.steps);
    // const [completedSteps, setCompletedSteps] = useState({
    //     labelled: false,
    //     augumented: false,
    //     images: false,
    //     dataSplit: false,
    //     HyperTune: false,
    //     infer: false,
    //     remark: false
    // });
    const userName = userData?.activeUser.userName || "anon";
    // console.log('username', userName, userData)
    const LOCAL_KEY = state
        ? `cls_steps_${userName}_${state.name}_${state.version}`
        : `cls_steps_${userName}`;

    const [completedSteps, setCompletedSteps] = useState(() => {
        if (state) {
            const saved = JSON.parse(localStorage.getItem(LOCAL_KEY));
            return saved?.completedSteps || {
                labelled: false, augumented: false, images: false,
                dataSplit: false, HyperTune: false, infer: false, remark: false
            };
        }
        return {
            labelled: false, augumented: false, images: false,
            dataSplit: false, HyperTune: false, infer: false, remark: false
        };
    });

    const [iState, updateIstate] = useState(() => {
        if (state) {
            const saved = JSON.parse(localStorage.getItem(LOCAL_KEY));
            // return saved?.iState || 'labelled';
            return 'remark'
        }
        return 'labelled';
    });



    const stepsOrder = ['labelled', 'augumented', 'images', 'dataSplit', 'HyperTune', 'infer', 'remark', 'application'];

    const handleApply = (step) => {
        setCompletedSteps((prevSteps) => ({ ...prevSteps, [step]: true }));
        console.log(`Step ${step} completed`);
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

    // for persistent state management

    // Save to localStorage on state change
    useEffect(() => {
        if (state) {
            localStorage.setItem(LOCAL_KEY, JSON.stringify({
                completedSteps,
                iState,
            }));
        }
    }, [completedSteps, iState, state]);


    // ----------
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
                        <h4 className="NewTitle">Model: Classification</h4>
                    </div>
                    <div className="StepBox text-xs">
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
                                    onClick={() => isStepAccessible('augumented') && updateIstate('augumented')}
                                    style={{ pointerEvents: isStepAccessible('augumented') ? 'auto' : 'none', color: isStepAccessible('augumented') ? 'inherit' : '#aaa' }}
                                >
                                    Augmentations
                                </a>
                            </li>
                            <li className={iState == "labelled" || iState == "augumented" ? "" : "active"}>
                                <a className="Text"
                                    onClick={() => isStepAccessible('images') ? updateIstate('images' ?? "") : null}
                                    style={{ pointerEvents: isStepAccessible('images') ? 'auto' : 'none', color: isStepAccessible('images') ? 'inherit' : '#aaa' }}
                                >
                                    Augmented <br /> Images
                                </a>
                            </li>
                            <li className={iState == "labelled" || iState == "augumented" || iState == "images" ? "" : "active"}>
                                <a className="Text"
                                    onClick={() => isStepAccessible('dataSplit') && updateIstate("dataSplit" ?? "")}
                                    style={{ pointerEvents: isStepAccessible('dataSplit') ? 'auto' : 'none', color: isStepAccessible('dataSplit') ? 'inherit' : '#aaa' }}
                                >
                                    Data Split Ratio
                                </a>
                            </li>
                            <li className={iState == "labelled" || iState == "augumented" || iState == "images" || iState == "dataSplit" ? "" : "active"}>
                                <a className="Text"
                                    onClick={() => isStepAccessible('HyperTune') && updateIstate("HyperTune")}
                                    style={{ pointerEvents: isStepAccessible('HyperTune') ? 'auto' : 'none', color: isStepAccessible('HyperTune') ? 'inherit' : '#aaa' }}
                                >
                                    Tune Hyper Parameters
                                </a>
                            </li>
                            <li className={iState == "labelled" || iState == "augumented" || iState == "images" || iState == "dataSplit" || iState == "HyperTune" ? "" : "active"}>
                                <a className="Text"
                                    onClick={() => isStepAccessible('infer') && updateIstate("infer")}
                                    style={{ pointerEvents: isStepAccessible('infer') ? 'auto' : 'none', color: isStepAccessible('infer') ? 'inherit' : '#aaa' }}
                                >
                                    Infer Images
                                </a>
                            </li>
                            <li className={iState == "remark" || iState === 'application' ? "active" : ""}>
                                <a className="Text"
                                    onClick={() => isStepAccessible('remark') && updateIstate("remark")}
                                    style={{ pointerEvents: isStepAccessible('remark') ? 'auto' : 'none', color: isStepAccessible('remark') ? 'inherit' : '#aaa' }}
                                >
                                    Remarks
                                </a>
                            </li>
                             <li className={iState == "application" ? "active" : ""}>
                                <a className="Text"
                                    onClick={() => isStepAccessible('application') && updateIstate("application")}
                                    style={{ pointerEvents: isStepAccessible('application') ? 'auto' : 'none', color: isStepAccessible('application') ? 'inherit' : '#aaa' }}
                                >
                                    Application
                                </a>
                            </li>
                        </ul>
                    </div>
                    {iState == "labelled" && <Classlabelled
                        iState={iState}
                        state={state}
                        userData={userData}
                        onApply={() => handleApply('labelled')}
                        onChange={() => handleChange("augumented")}
                    />}
                    {iState == "augumented" && <Classagumentation
                        state={state}
                        userData={userData}
                        onApply={() => handleApply('augumented')}
                        onChange={() => handleChange("images")}
                    />}
                    {iState == "images" && <ClassAgumentImages
                        iState={iState}
                        state={state}
                        userData={userData}
                        onApply={() => handleApply('images')}
                        onChange={() => handleChange("dataSplit")}
                    />}
                    {iState == "dataSplit" && <ClassDataSplit
                        state={state}
                        userData={userData}
                        onApply={() => handleApply('dataSplit')}
                        onChange={() => handleChange("HyperTune")}
                    />}
                    {iState == "HyperTune" && <ClassHyperTune
                        iState={iState}
                        setIstate={updateIstate}
                        state={state}
                        userData={userData}
                        onApply={() => handleApply('HyperTune')}
                        onChange={() => handleChange("infer")}
                    />}
                    {iState == "infer" && <ClassInferImages
                        iState={iState}
                        updateIstate={updateIstate}
                        state={state}
                        userData={userData}
                        onApply={() => handleApply('infer')}
                        onChange={() => handleChange("remark")}
                    />}
                    {iState == "remark" && <ClassRemark
                        iState={iState}
                        updateIstate={updateIstate}
                        state={state}
                        userData={userData}
                        username={userData?.activeUser?.userName}
                        task="classification"
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

export default ClassificationTraining
