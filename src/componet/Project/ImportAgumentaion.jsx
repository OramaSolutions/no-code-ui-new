import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Loader from '../../commonComponent/Loader'

function ImportAgumentaion({ onOpen, onClose,istate,setIstate,handleCancel }) {

    const handleclose=()=>{
        setIstate({...istate,openModal:false,onClose:false})
        handleCancel()
    }
  return (
    <>
    <Modal
        show={onOpen}
        className="ModalBox"
        // onHide={onClose?handleclose:undefined}
    >
        <Modal.Body>
            <div className="Category">
                <a className="CloseModal" 
                onClick={()=>handleclose()}
                >
                    ×
                </a>                      
               {!onClose? 
                    <div className="ProjectAlreadyArea">
                        <h5>Data Agumentation is in Progress</h5>
                        <Loader
                        item={"160px"}
                         Visible={true}
                     />
                        <h6>Please be patient, it may take some time</h6>
                    </div>
                :
                 <center><b>Import Failed<br></br>Try Again... </b></center>
                }
            </div>

        </Modal.Body>
    </Modal>
</>
  )
}

export default ImportAgumentaion
