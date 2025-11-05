import React from 'react'
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { commomObj } from '../../utils';

function CheckVersion({show,setShow,model,istate,setIstate}) {
    const{openModal,projectName,openVersion}=show;
  
    const handleVersion=()=>{
        setShow({...show,openModal:false,openVersion:true})

    }
    const handleProject=()=>{      
       setIstate({...istate,open:true})
       setShow({...show,openModal:false})

    }
    return (
        <>
            <Modal
                show={openModal}
                className="ModalBox"
                // onHide={handleclose}
            >
                <Modal.Body>
                    <div className="Category">                       
                        <div className="ProjectAlreadyArea">
                            <h5>Project Already Exists!!</h5>
                            <figure>
                                {/* <img src={require("../../assets/images/already-exists.png")} /> */}
                            </figure>
                            <h6>Want to Create New Versions</h6>
                        </div>
                        <div className="TwoButtons">                          
                            <a className="OutlineBtn" onClick={handleProject}>
                                No
                            </a>
                            <a className="FillBtn" onClick={handleVersion}>
                                Yes
                            </a>
                        </div>
                    </div>


                </Modal.Body>
            </Modal>
        </>
    )
}

export default CheckVersion
