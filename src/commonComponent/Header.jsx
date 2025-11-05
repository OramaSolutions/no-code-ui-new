import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import LogoutModal from './LogoutModal'
import { viewProfile } from '../reduxToolkit/Slices/authSlices';
import { notificationList } from '../reduxToolkit/Slices/notificationSlices';
import bellIcon from "../assets/images/bell-icon.png";

const initialState = {
    openModal: false,
    sellerData: {},
}

function Header() {
    const { notificationData, loader } = useSelector((state) => state.notification)
    const dispatch = useDispatch();
    const [istate, updateIstate] = useState(initialState)
    const { openModal, sellerData } = istate;
    const profileimage = JSON.parse(window.localStorage.getItem("sellerimage"))
    const sellerLogin = JSON.parse(window.localStorage.getItem("userLogin"))
    // console.log(notificationData, "notificationData")

    const openLogoutModal = () => {
        updateIstate({ ...istate, openModal: true })
    }
    useEffect(() => {
        dispatch(notificationList());

        const interval = setInterval(() => {
          dispatch(notificationList());
        }, 120000);        
        return () => clearInterval(interval);
      }, [dispatch]);

    return (
        <div>
            <div className="Header">
                <div className="NewHeaderLeft py-4">
                    <h2>Hi, {profileimage?.name ? profileimage?.name : sellerLogin?.activeUser?.name}</h2>
                    <p>Let's finish your task today!</p>
                </div>
                <div className="Navigation">
                    <div className="Avater First">
                        <a>
                            <img src={bellIcon} alt="Bell icon" />
                        </a>
                        <ul className="dropdown-menu Notification scroll">
                            {notificationData?.result?.length > 0 &&
                                notificationData?.result?.map((item, i) => {
                                    return (
                                        <li style={{ borderBottom: '1px solid #d2d3d4' }}>
                                            <a class="dropdown-item">
                                                <p dangerouslySetInnerHTML={{ __html: item?.notificationData?.content }} />
                                            </a>
                                        </li>
                                    )
                                })
                            }
                        </ul>

                    </div>
                    <div className="Avater">
                        <a>
                            <figure>
                                <img src={profileimage?.profilePic ? (profileimage?.profilePic) : sellerLogin?.activeUser?.profilePic
                                }
                                />
                            </figure>
                            {/* Bob Hyden */}
                        </a>
                        <ul>
                            {/* <li>
                                <figure>
                                    <img src={profileimage?.profilePic ? (profileimage?.profilePic) : sellerLogin?.activeUser?.profilePic}                                    />
                                </figure>
                                <h4>
                                    {" "}
                                    {sellerData?.name} <span>Administrator</span>
                                </h4>
                            </li> */}
                            <li>
                                <a onClick={openLogoutModal}>
                                    <span>
                                        <i className="fa fa-sign-out" />
                                    </span>{" "}
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="clear" />
                </div>
            </div>
            <LogoutModal
                istate={istate}
                updateIstate={updateIstate}
            />

        </div>

    )
}

export default Header
