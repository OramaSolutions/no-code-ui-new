import React, { useState } from 'react'
import Header from '../../commonComponent/Header'
import Sidenav from '../../commonComponent/Sidenav'
import Labelled from './Labelled'
import Augumentation from './Augumentation'
import AugumentImages from './AugumentImages'
import DataSplit from './DataSplit'
import HyperTune from './HyperTune'
import InferImages from './InferImages'
import Remark from './Remark'
import { useLocation } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux'
import { markStepChanged,clearStepChange } from '../../reduxToolkit/Slices/stepSlices'


const initialState={
    labelledData:{},
}

function ProjectTraining() {
const dispatch=useDispatch();
const[iState,updateIstate]=useState("labelled")
const userData = JSON.parse(window.localStorage.getItem("userLogin"))
const { hasChangedSteps } = useSelector((state) => state.steps);
const [completedSteps, setCompletedSteps] = useState({
    labelled:false,
    augumented:false,
    images:false,
    dataSplit:false,
    HyperTune:false,
    infer:false,
    remark:false
});
const {state} = useLocation();

const stepsOrder = ['labelled', 'augumented', 'images', 'dataSplit', 'HyperTune', 'infer', 'remark'];

    const handleApply = (step) => {
        setCompletedSteps((prevSteps) => ({...prevSteps,[step]: true}));      
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
                        <h4 className="NewTitle">Model: objectdetection</h4>
                    </div>
                    <div className="StepBox">
                        <ul>
                            <li className="active">
                                <a  className="Text" 
                                 onClick={() => isStepAccessible('labelled') && updateIstate('labelled')}
                                 style={{ pointerEvents: isStepAccessible('labelled') ? 'auto' : 'none', color: isStepAccessible('labelled') ? 'inherit' : '#aaa' }}
                                 >
                                    Labelled Data
                                </a>
                            </li>
                            <li className={iState=="labelled"?"":"active"}>
                                <a className="Text" 
                                onClick={() => isStepAccessible('augumented') && updateIstate('augumented')}
                                style={{ pointerEvents: isStepAccessible('augumented') ? 'auto' : 'none', color: isStepAccessible('augumented') ? 'inherit' : '#aaa' }}
                                >
                                    Augmentations
                                </a>
                            </li>
                            <li className={iState=="labelled"||iState=="augumented"?"":"active"}>
                                <a className="Text" 
                                onClick={() => isStepAccessible('images') ? updateIstate('images'??""):null}
                                style={{ pointerEvents: isStepAccessible('images') ? 'auto' : 'none', color: isStepAccessible('images') ? 'inherit' : '#aaa' }}
                                >
                                    Augmented <br /> Images
                                </a>
                            </li>
                            <li className={iState=="labelled"||iState=="augumented"||iState=="images"?"":"active"}>
                                <a className="Text"
                                 onClick={() => isStepAccessible('dataSplit') && updateIstate("dataSplit"??"")}
                                 style={{ pointerEvents: isStepAccessible('dataSplit') ? 'auto' : 'none', color: isStepAccessible('dataSplit') ? 'inherit' : '#aaa' }}
                                 >
                                    Data Split Ratio
                                </a>
                            </li>
                            <li className={iState=="labelled"||iState=="augumented"||iState=="images"||iState=="dataSplit"?"":"active"}>
                                <a className="Text" 
                                onClick={() => isStepAccessible('HyperTune') && updateIstate("HyperTune")}
                                style={{ pointerEvents: isStepAccessible('HyperTune') ? 'auto' : 'none', color: isStepAccessible('HyperTune') ? 'inherit' : '#aaa' }}
                                >
                                    Tune Hyper Parameters
                                </a>
                            </li>
                            <li className={iState=="labelled"||iState=="augumented"||iState=="images"||iState=="dataSplit"||iState=="HyperTune"?"":"active"}>
                                <a className="Text" 
                                onClick={() => isStepAccessible('infer') && updateIstate("infer")}
                                style={{ pointerEvents: isStepAccessible('infer') ? 'auto' : 'none', color: isStepAccessible('infer') ? 'inherit' : '#aaa' }}
                                >
                                    Infer Images
                                </a>
                            </li>
                            <li className={iState=="remark"?"active":""}>
                                <a className="Text" 
                                onClick={() => isStepAccessible('remark') && updateIstate("remark")}
                                style={{ pointerEvents: isStepAccessible('remark') ? 'auto' : 'none', color: isStepAccessible('remark') ? 'inherit' : '#aaa' }}
                                >
                                    Remarks
                                </a>
                            </li>
                        </ul>
                    </div>
                  {iState=="labelled"&& <Labelled
                  iState={iState}                  
                  state={state}
                  userData={userData}
                  onApply={() => handleApply('labelled')} 
                  onChange={() => handleChange("augumented")}                 
                  />}                
                  {iState=="augumented"&& <Augumentation                  
                   state={state}
                   userData={userData}
                   onApply={() => handleApply('augumented')}
                   onChange={() => handleChange("images")}
                  />}                
                  {iState=="images"&& <AugumentImages 
                   iState={iState}                  
                   state={state}
                   userData={userData}
                   onApply={() => handleApply('images')}
                   onChange={() => handleChange("dataSplit")}
                  />}                
                  {iState=="dataSplit"&& <DataSplit                 
                   state={state}
                   userData={userData}
                   onApply={() => handleApply('dataSplit')}
                   onChange={() => handleChange("HyperTune")}
                  />}                
                  {iState=="HyperTune"&& <HyperTune
                   iState={iState}
                   setIstate={updateIstate}
                   state={state}
                   userData={userData}
                   onApply={() => handleApply('HyperTune')}
                   onChange={() => handleChange("infer")}
                  />}                
                  {iState=="infer"&& <InferImages
                   iState={iState}
                   updateIstate={updateIstate}
                   state={state}
                   userData={userData}
                   onApply={() => handleApply('infer')}
                   onChange={() => handleChange("remark")}
                  />}                
                  {iState=="remark"&& <Remark
                   iState={iState}
                   updateIstate={updateIstate}
                   state={state}
                   userData={userData}
                   onApply={() => handleApply('remark')}
                   onChange={() => handleChange("remark")}
                  />}                
                </div>
            </div>

        </div>
    )
}

export default ProjectTraining
