import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import { toast } from "react-toastify";
import { commomObj } from '../utils';
import { Link, useNavigate } from 'react-router-dom'
import LogoutIcon from "../assets/images/logout-icon.png"
function LogoutModal({ istate, updateIstate }) {
    const { openModal } = istate;
    const navigate = useNavigate();
    const handleLogout = () => {
        toast.success("Logout Successfully", commomObj);
        window.localStorage.removeItem('userLogin');
        window.localStorage.removeItem('profileimage');
        navigate('/', { replace: true });
    }
    const handleClose = () => {
        updateIstate({ ...istate, openModal: false })
    }
    return (
        <>
            <Modal
                className="ModalBox"
                show={openModal}
                onHide={handleClose}
            >
                <Modal.Body>
                    <div>
                        <Link className="CloseModal" onClick={handleClose}>
                            ×
                        </Link>
                        <div className='LogOutModalArea'>
                            <span><img src={LogoutIcon} /></span>
                            <h3>Log Out</h3>
                            <p>Are you sure you want to Logout ?</p>
                            <div className='Buttons'>
                                <Link onClick={handleClose} className='CancelBtn' data-dismiss="modal" > Cancel</Link>
                                <a onClick={handleLogout}  className='ConfirmBtn' > Confirm</a>
                            </div>                           
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}


export default LogoutModal