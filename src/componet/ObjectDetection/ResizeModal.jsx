import React from 'react'
import Loader from '../../commonComponent/Loader'
import Modal from 'react-bootstrap/Modal';


function ResizeModal({ onOpen, onClose,istate,setIstate,setSelectedFile,handleCancel,username,state,task, url }) {
    const closeHandler=()=>{ 
        handleCancel()      
        setIstate({...istate,open:false,close:null})       
    }

    const handleDownloadAndCloseModal = () => {
        const downloadUrl = `${url}download_resized_images?username=${username}&task=${task}&project=${state?.name}&version=${state?.version}`;         
        window.open(downloadUrl, '_blank');
        setIstate({...istate,imageUrls:[],open:false,resizecheck:false,width:null,})
        setSelectedFile(null) 
      };
    
    return (
        <>
            <Modal
                show={onOpen}
                className="ModalBox"
                // onHide={onClose==false?closeHandler:undefined}
            >
                <Modal.Body>
                    <div className="Category">
                        <a
                            className="CloseModal"
                            onClick={()=>closeHandler()}
                        >
                            ×
                        </a>
                        {onClose ?                           
                            <>
                                <div className="ProjectAlreadyArea">
                                    <h5>Download Data Set</h5>
                                    <figure>
                                        {/* <img src={require("../../assets/images/download.png")} /> */}
                                    </figure>
                                    <h6>Your data set is ready for download</h6>
                                </div>
                                <a role='button' className="Button mt-3 DownloadBtn"  onClick={handleDownloadAndCloseModal}>
                                    Download
                                </a>                                
                            </>:onClose==false?
                            <center><b>Resizing Failed<br></br>Try Again... </b></center>:
                             <>
                             <center><b>Resizing The Images </b></center>
                             <Loader
                                 item={"200px"}
                                 Visible={true}
                             />
                         </>
                        }
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ResizeModal
