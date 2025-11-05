import React, { useState } from 'react'
import Sidenav from '../../commonComponent/Sidenav'
import Header from '../../commonComponent/Header'
import { Link } from 'react-router-dom'
import CreateProject from './CreateProject'
import { FaCheck } from "react-icons/fa";
const initialState = {
    open: false,
    model: "",
}

function Project({ type }) {
    const [istate, updateIstate] = useState(initialState)
    const { open } = istate;

    const openModal = (type) => {
        updateIstate({ ...istate, open: true, model: type })
    }
    return (
        <div>
            {type == "dashboard" ? "" : <Header />}
            {type == "dashboard" ? "" : <Sidenav />}
            <div className={type == "dashboard" ? "" : "WrapperArea"}>
                <div className={type == "dashboard" ? "" : "WrapperBox"}>
                    {type == "dashboard" ? "" : <div className="NewTitleBox">
                        <h4 className="NewTitle">Select Model</h4>
                    </div>}
                    <div className="row">
                    {/* objectdetection */}
                        <div className="col-lg-6">
                            <div className="SelectModelBox">
                                <aside>
                                    <ul>
                                        <li>
                                            <figure>
                                                {/* <img src={require("../../assets/images/assembly-verification.webp")} /> */}
                                            </figure>
                                        </li>
                                        
                                    </ul>
                                </aside>
                                <h5>Object Detection</h5>
                                <p>
                                    Train a model with labeled data for detecting objects within images.
                                </p>
                                <article>
                                    <ul>
                                        <li>
                                            <span>
                                                <FaCheck className="text-blue-500 w-5 h-5" />
                                            </span>
                                            <label>Use labeled data in YOLO format</label>
                                        </li>
                                        <li>
                                            <span>
                                                <FaCheck className="text-blue-500 w-5 h-5" />
                                            </span>
                                            <label>Require a minimum of 300 images for training</label>
                                        </li>
                                        <li>
                                            <span>
                                                <FaCheck className="text-blue-500 w-5 h-5" />
                                            </span>
                                            <label>
                                                Ensure proper labeling of objects without any errors
                                            </label>
                                        </li>
                                    </ul>
                                    <Link
                                        className="StartTraining"
                                        onClick={() => openModal("objectdetection")}
                                    >
                                        Create Project
                                    </Link>
                                </article>
                            </div>
                        </div>

                        {/* defectdetection */}
                        <div className="col-lg-6">
                            <div className="SelectModelBox">
                                <aside>
                                    <ul>
                                        <li>
                                            <figure>
                                                {/* <img src={require("../../assets/images/defectdetection.webp")} /> */}
                                            </figure>
                                        </li>
                                       
                                    </ul>
                                </aside>
                                <h5>Defect Detection</h5>
                                <p>Perform defectdetection with limited labeling</p>
                                <article>
                                    <ul>
                                        <li>
                                            <span>
                                                <FaCheck className="text-blue-500 w-5 h-5" />
                                            </span>
                                            <label>
                                                Prepare a dataset organized in four folders: good_train,
                                                bad_train, good_test, and bad_test.
                                            </label>
                                        </li>
                                        <li>
                                            <span>
                                                <FaCheck className="text-blue-500 w-5 h-5" />
                                            </span>
                                            <label>Each folder should contain 30 images.</label>
                                        </li>
                                        <li>
                                            <span>
                                                <FaCheck className="text-blue-500 w-5 h-5" />
                                            </span>
                                            <label>
                                                e folder name should be same as project name and the good/bad
                                                should be in lowercase (no spaces).
                                            </label>
                                        </li>
                                    </ul>
                                    <Link
                                        className="StartTraining"
                                        onClick={() => openModal("defectdetection")}
                                    >
                                        Start Detection
                                    </Link>
                                </article>
                            </div>
                        </div>

                        {/* Classification */}
                        <div className="col-lg-6">
                            <div className="SelectModelBox">
                                <aside>
                                    <ul>
                                        <li>
                                            <figure>
                                                {/* <img src={require("../../assets/images/counting.webp")} /> */}
                                            </figure>
                                        </li>
                                      
                                    </ul>
                                </aside>
                                <h5>Classification</h5>
                                <p>Perform Classification Tasks</p>
                                <article>
                                    <ul>
                                        <li>
                                            <span>
                                                <FaCheck className="text-blue-500 w-5 h-5" />
                                            </span>
                                            Train and Visualize Metrics.
                                        </li>
                                        <li>
                                            <span>
                                                <FaCheck className="text-blue-500 w-5 h-5" />
                                            </span>
                                            Train and Visualize Metrics.
                                        </li>
                                        <li>
                                            <span>
                                                <FaCheck className="text-blue-500 w-5 h-5" />
                                            </span>
                                            Train and Visualize Metrics.
                                        </li>
                                        <li>
                                            <span>
                                                <FaCheck className="text-blue-500 w-5 h-5" />
                                            </span>
                                            Evaluate on Saved Images &amp; Camera
                                        </li>
                                    </ul>
                                    <Link className="StartTraining"
                                        onClick={() => openModal("Classification")} >
                                        Start Classification
                                    </Link>
                                </article>
                            </div>
                        </div>
                        {/* Text Extraction */}
                        <div className="col-lg-6">
                            <div className="SelectModelBox">
                                <aside>
                                    <ul>
                                        <li>
                                            <figure>
                                                {/* <img src={require("../../assets/images/ocr.webp")} /> */}
                                            </figure>
                                        </li>
                                        
                                    </ul>
                                </aside>
                                <h5>Text Extraction</h5>
                                <p>Perform defectdetection with limited labeling</p>
                                <article>
                                    <ul>
                                        <li>
                                            <span>
                                                <FaCheck className="text-blue-500 w-5 h-5" />
                                            </span>
                                            Add labelled data containing images of text and corresponding
                                            text labels
                                        </li>
                                        <li>
                                            <span>
                                                <FaCheck className="text-blue-500 w-5 h-5" />
                                            </span>
                                            Train the Detector and the Recognizer
                                        </li>
                                        <li>
                                            <span>
                                                <FaCheck className="text-blue-500 w-5 h-5" />
                                            </span>
                                            Test on Images with options to alter settings
                                        </li>
                                    </ul>
                                    <a className="StartTraining">
                                        Start Text Extraction
                                    </a>
                                </article>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CreateProject
                istate={istate}
                setIstate={updateIstate}
            />
        </div>
    )
}

export default Project
