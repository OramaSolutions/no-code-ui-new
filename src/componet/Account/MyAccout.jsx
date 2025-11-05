import React, { useEffect, useState } from 'react'
import Sidenav from '../../commonComponent/Sidenav'
import Header from '../../commonComponent/Header'
import { Link, useNavigate } from 'react-router-dom'
import { viewProfile, updateProfile } from '../../reduxToolkit/Slices/authSlices'
import { useDispatch, useSelector } from 'react-redux'
import { commomObj } from '../../utils'
import { toast } from 'react-toastify'
import { UploadDocumnet } from '../../reduxToolkit/Slices/supportSlice'
import Avatar1 from "../../assets/images/Avatar-1.png"
import Camera from "../../assets/images/camera.png"
const initialState = {
    name: "",
    email: "",
    contact: "",
    errors: {},
    loading: false,
    profilePic: "",
}

function MyAccout() {
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const { profileData, loader } = useSelector((state) => state.auth)
    // console.log(profileData, "profileData")
    const [istate, updateIstate] = useState(initialState)
    const { name, email, contact, errors, loading, profilePic } = istate;
    const userData = JSON.parse(window.localStorage.getItem("userLogin"))

    useEffect(() => {
        const getData = async () => {
            const res = await dispatch(viewProfile())
            if (res?.payload?.code == 200) {
                updateIstate((prev) => ({ ...prev, name: res?.payload?.activeUser?.name, email: res?.payload?.activeUser?.email, contact: res?.payload?.activeUser?.phoneNumber, address: res?.payload?.activeUser?.address, profilePic: res?.payload?.activeUser?.profilePic }))                
            }
        }
        getData();
    }, [])

    const inputHandler = (e) => {
        const { name, value } = e.target
        updateIstate({ ...istate, [name]: value })
    }

    const handleValidation = () => {
        let formIsValid = true;
        let error = {}
        if (!name?.trim()) {
            formIsValid = false
            error.nameError = "*required to fill"
        } if (!email.trim()) {
            error.emailError = " *Email can't be empty";
            formIsValid = false;
        }
        else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            error.emailError = " * Email format is not valid";
            formIsValid = false;
        }
        if (!contact?.trim()) {
            formIsValid = false
            error.contactError = "*required to fill"
        }

        updateIstate({ ...istate, errors: error })
        return formIsValid
    }
    const saveHandler = async () => {
        let formValid = handleValidation()
        if (formValid) {
            try {
                updateIstate({ ...istate, loading: true })
                const data = { id: userData?.activeUser?._id, name, email, phoneNumber: contact, profilePic }
                const res = await dispatch(updateProfile(data))
                if (res?.payload?.code === 200) {                   
                    navigate("/dashboard")
                    updateIstate({ ...istate, loading: false, errors: {}, })             
                    toast.success("Updated Successfully", commomObj);
                    window.localStorage.setItem("sellerimage",JSON.stringify({name,profilePic}))
                } else {
                    toast.error("Oops!something went wrong", commomObj);
                }
            } catch (err) {
                // console.log(err, "errrrrrrrr")
            }
        }

    }
    //========================================file handler======================================
    const onFileHandler = async (e) => {
        const file = e.target.files[0];
        // console.log({ file })
        if (file) {
            if (file.type === "image/jpeg" ||
                file.type === "image/jpg" || file.type === "image/png" 
            ) {
                const formData = new FormData();
                formData.append("fileName", file);
                try {
                    const response = await dispatch(UploadDocumnet(formData))                   
                    if (response?.payload?.data?.code === 200) {
                        toast.success("Upload Successfully", commomObj)
                        updateIstate({ ...istate, profilePic: response?.payload?.data?.url })
                    }
                } catch (error) {
                    toast.error(error?.payload?.data?.message, commomObj)
                    console.error("Error uploading file:", error);
                }


            } else {
                toast.error("Please upload in jpg,jpeg,png,bmp format Only", commomObj);
            }
        }
    };

    return (
        <div>
            <Sidenav />
            <Header />        
            
            <div className="WrapperArea">
                <div className="WrapperBox">
                    <div className="Small-Wrapper">
                        <Link to="/change-password" className="AddRemarksBtn">
                            Change Password
                        </Link>
                        <div className="CommonForm">
                            <form>
                                <div className="row">
                                    <div className="col-lg-6 mx-auto">
                                        <div className="AccountProfile">
                                            <figure>
                                                <span>
                                                    <img src={profilePic?profilePic:Avatar1} />{" "}
                                                </span>
                                                <div className="UploadOverlay">
                                                    <img src={Camera} />
                                                    <input type="file" onChange={onFileHandler} />
                                                </div>
                                            </figure>
                                        </div>
                                        <div className="form-group">
                                            <label>Full name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Full name"
                                                name="name"
                                                value={name}
                                                onChange={inputHandler}
                                            />
                                            <span style={{ color: 'red' }} >{errors?.nameError}</span>
                                        </div>
                                        <div className="form-group">
                                            <label>Email address</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Email address"
                                                name="email"
                                                value={email}
                                                onChange={inputHandler}
                                            />
                                            <span style={{ color: 'red' }} >{errors?.emailError}</span>
                                        </div>
                                        <div className="form-group">
                                            <label>Contact number</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Enter Contact number"
                                                name="contact"
                                                value={contact}
                                                onWheel={(e) => e.target.blur()}
                                                onChange={inputHandler}
                                            />
                                            <span style={{ color: 'red' }} >{errors?.contactError}</span>
                                        </div>
                                        <button className="Button w-100" onClick={saveHandler} disabled={loading}>Save Details</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default MyAccout
