// import React, { useEffect, useState } from 'react'
// import Header from '../../commonComponent/Header'
// import Sidenav from '../../commonComponent/Sidenav'
// import { useNavigate, Link } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { commomObj } from '../../utils';
// import { useDispatch, useSelector } from 'react-redux';
// import { createSupport, UploadDocumnet } from '../../reduxToolkit/Slices/supportSlice';
// // import config from '../../config/config';
// // import S3FileUpload from 'react-s3/lib/ReactS3';
// import { projectList, versionList } from '../../reduxToolkit/Slices/openSlices';

// const initialState = {
//     addressTo: "",
//     subject: "",
//     description: "",
//     uploadFile: "",
//     error: {},
//     loading: false,
//     pdfName: "",
//     model: "",
//     ProjectName: "",
//     versionNumber:"",

// }
// function Support() {
//     const { projectData } = useSelector((state) => state.openProject)
//     const { versionData, loader } = useSelector((state) => state.openProject)
//     const [istate, updateIstate] = useState(initialState)
//     const { addressTo, subject, description, uploadFile, error, loading, pdfName, model, ProjectName,versionNumber } = istate;
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     console.log(istate, "istate")
//     //...................................useeffect for project...............................................
//     useEffect(() => {
//         dispatch(projectList({
//             model: model,
//             page: "",
//             startdate: "",
//             enddate: "",
//             search: "",
//             timeFrame: "",
//         }))
//     }, [model])
//     //=====================================useeffect for version==============================================
//     useEffect(() => {
//         if (model && ProjectName) {
//             dispatch(versionList({
//                 projectName: ProjectName,
//             }))
//         }

//     }, [model, ProjectName])

//     const inputHandler = (e) => {
//         const { name, value } = e.target;
//         updateIstate({ ...istate, [name]: value,error:{} })
//     }
//     const handleValidation = () => {
//         let errors = {}
//         let formValid = true;
//         if (!addressTo.trim()) {
//             errors.addressToError = "*Address cannot be empty*"
//             formValid = false
//         }
//         if (!description.trim()) {
//             errors.descriptionError = "*Description cannot be empty*"
//             formValid = false
//         }
//         if (!subject.trim()) {
//             errors.subjectError = "*Subject cannot be empty*"
//             formValid = false
//         }
//         if (!model.trim()) {
//             errors.modelError = "*Model cannot be empty*"
//             formValid = false
//         }
//         if (!ProjectName.trim()) {
//             errors.nameError = "*ProjectName cannot be empty*"
//             formValid = false
//         }
//         if (!versionNumber.trim()) {
//             errors.versionError = "*Version cannot be empty*"
//             formValid = false
//         }
//         updateIstate({
//             ...istate,
//             error: errors,
//         });
//         return formValid
//     }
//     const saveHandler = async () => {
//         try {
//             let formValid = handleValidation()
//             if (formValid) {
//                 updateIstate({ ...istate, loading: true })
//                 const data = { addressTo,projectName:ProjectName,taskName:model,versionNumber, subject, description, uploadFile }
//                 const response = await dispatch(createSupport(data))
//                 console.log(response, "responseee")
//                 if (response?.payload?.status === 200) {
//                     toast.success('Reported Successfully', commomObj);
//                     updateIstate(initialState)
//                     navigate('/dashboard')
//                 }
//                 else {
//                     toast.error(response?.payload?.message, commomObj);
//                     updateIstate({ ...istate, loading: true })

//                 }
//             }
//         }
//         catch (err) {
//             console.log('errorrr', err)
//             updateIstate({ ...istate, loading: true })
//         }
//     }
//     //.......................................file handler......................................
//     window.Buffer = window.Buffer || require("buffer").Buffer;
//     const onFileHandler = async (e) => {
//         const file = e.target.files[0];
//         console.log({ file })
//         if (file) {
//             if (file.type === "image/jpeg" ||
//                 file.type === "image/jpg" || file.type === "image/png" || file.type === "image/bmp"
//             ) {
//                 const formData = new FormData();
//                 formData.append("fileName", file);
//                 try {
//                     const response = await dispatch(UploadDocumnet(formData))
//                     console.log("File responseeeeeeeeee", response);
//                     if (response?.payload?.data?.code === 200) {
//                         toast.success("Upload Successfully", commomObj)
//                         updateIstate({ ...istate, uploadFile: response?.payload?.data?.url, pdfName: file.name })
//                     }
//                 } catch (error) {
//                     toast.error(error?.payload?.data?.message, commomObj)
//                     console.error("Error uploading file:", error);
//                 }


//             } else {
//                 toast.error("Please upload in jpg,jpeg,png,bmp format Only", commomObj);
//             }
//         }
//     };

//     return (
//         <div>
//             <Header />
//             <Sidenav />
//             <div className="WrapperArea">
//                 <div className="WrapperBox">
//                     <div className="NewTitleBox">
//                         <h2 className="NewTitle">Help &amp; Support</h2>
//                     </div>
//                     <div className="Small-Wrapper">
//                         <h6 className="Remarks">Help &amp; Support</h6>
//                         <div className="CommonForm">
//                             <form>
//                                 <div className="form-group">
//                                     <label>Please Enter Below Details to raise issues :</label>
//                                     <select
//                                         className="form-control"
//                                         name='addressTo'
//                                         value={addressTo}
//                                         onChange={inputHandler}
//                                     >
//                                         <option value="">---Select--- </option>
//                                         <option value="shrinand@oramasolutions.in">Admin </option>
//                                         <option value="shrinand@oramasolutions.in">Application</option>
//                                     </select>
//                                     <span style={{ color: 'red' }} >{error.addressToError}</span>
//                                 </div>
//                                 <div className="form-group">
//                                     <label>Select Model</label>
//                                     <select
//                                         className="form-control"
//                                         name='model'
//                                         value={model}
//                                         onChange={inputHandler}
//                                     >
//                                         <option value="">---Select--- </option>
//                                         <option value="objectdetection">Object Detection </option>
//                                         <option value="defectdetection">defectdetection</option>
//                                         <option value="Classification">Classification </option>
//                                         <option value="defectdetection">defectdetection</option>
//                                     </select>
//                                     <span style={{ color: 'red' }} >{error.modelError}</span>
//                                 </div>
//                                 <div className="form-group">
//                                     <label>Select Project</label>
//                                     <select
//                                         className="form-control"
//                                         name='ProjectName'
//                                         value={ProjectName}
//                                         onChange={inputHandler}
//                                     >
//                                         <option value="">---Select--- </option>
//                                         {model ? projectData?.result?.[0]?.paginationData?.length > 0 ?
//                                             projectData?.result?.[0]?.paginationData?.map((item, i) => {
//                                                 return (
//                                                     <option value={item?.name}>{item?.name} </option>
//                                                 )
//                                             }) : "" : "No Data Found"}
//                                     </select>
//                                     <span style={{ color: 'red' }} >{error.nameError}</span>
//                                 </div>
//                                 <div className="form-group">
//                                     <label>Select Version</label>
//                                     <select
//                                         className="form-control"
//                                         name='versionNumber'
//                                         value={versionNumber}
//                                         onChange={inputHandler}
//                                     >
//                                         <option value="">--select--</option>
//                                         {
//                                             versionData?.result?.length > 0 ?
//                                                 versionData?.result?.map((item) => {
//                                                     return (
//                                                         <option value={item?.versionNumber}>{item?.versionNumber}</option>
//                                                     )
//                                                 })
//                                                 : "No Data Found"
//                                         }
//                                     </select>
//                                     <span style={{ color: 'red' }} >{error.versionError}</span>
//                                 </div>
//                                 <div className="form-group">
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name='subject'
//                                         value={subject}
//                                         onChange={inputHandler}
//                                         placeholder="Subject"
//                                     />
//                                     <span style={{ color: 'red' }} >{error.subjectError}</span>
//                                 </div>
//                                 <div className="form-group">
//                                     <textarea
//                                         className="form-control"
//                                         rows={5}
//                                         placeholder="Description"
//                                         defaultValue={""}
//                                         name='description'
//                                         value={description}
//                                         onChange={inputHandler}
//                                     />
//                                     <span style={{ color: 'red' }} >{error.descriptionError}</span>
//                                 </div>
//                                 <div className="form-group">
//                                     <div className="Upload Big">
//                                         <span>
//                                             {/* <img src={require("../../assets/images/folder-open-big.png")} /> <br /> Upload Image */}
//                                         </span>
//                                         <input type="file" onChange={onFileHandler} />
//                                     </div>
//                                     <p>{pdfName}</p>
//                                 </div>
//                                 <div className="row">
//                                     <div className="col-lg-6 mx-auto">
//                                         <div className="TwoButtons">
//                                             <a className="FillBtn" onClick={saveHandler} style={{ pointerEvents: loading ? 'none' : '' }}>
//                                                 Submit
//                                             </a>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//         </div>
//     )
// }

// export default Support
