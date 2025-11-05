import React from 'react'
import Modal from 'react-bootstrap/Modal';

function TrainingCompleted({data,setData,onApply}) {
    const handleOpen=()=>{
        setData({...data,opentraincomplete:false})
        onApply()
        
    }
  return (
    <>
       <Modal
                show={data.opentraincomplete}
                className="ModalBox"
                
            >
                <Modal.Body>
                    <div className="Category">                       
                        <div className="ProjectAlreadyArea">                      
                            <h4>Training has been completed....proceed further</h4>
                        </div>
                        <div className="text-center mt-4">
                        <span className="NewIcon"><i class="fa fa-check" aria-hidden="true"></i></span>
                        </div>
                        <br/>
                        <a className="Button" onClick={handleOpen}>Next</a>
                    </div>

                </Modal.Body>
            </Modal>
    </>
  )
}

export default TrainingCompleted
