import React, { useState } from 'react'
import { changePassword } from '../../reduxToolkit/Slices/authSlices';
import { commomObj } from '../../utils';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../commonComponent/Header'
import Sidenav from '../../commonComponent/Sidenav'


let initialstate = {
    oldpassword: '',
    newpassword: '',
    reenterpassword: '',
    loading: false,
};
let initial = {
    eye1: false,
    eye2: false,
    eye3: false,
}
function ChangePassword() {
    const [input, setInput] = useState(initialstate)
    const [error, setError] = useState(false);
    const [toggle, setToggle] = useState(initial);
    const { eye1, eye2, eye3 } = toggle;
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { oldpassword, newpassword, reenterpassword, loading } = input;

    const handleinput = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value })
    }

    const handlesubmit = async (e) => {
        e.preventDefault()
        if (oldpassword?.trim() == "" || newpassword?.trim() == "" || reenterpassword?.trim() == "" || oldpassword == newpassword) {
            setError(true)
        }
        else {
            setInput({ ...input, loading: true })
            try {
                const data = { password: oldpassword, newPassword: newpassword }

                const res = await dispatch(changePassword(data));
                //console.log(res.data.status,res)
                if (res?.payload?.code === 200) {
                    navigate('/my-account')
                    toast.success(res?.data?.message, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    setInput({
                        ...input,
                        oldpassword: '',
                        newpassword: '',
                        reenterpassword: '',
                        loading: false,
                    })
                }
                else {
                    toast.error("Old password is incorrect", commomObj);
                    setInput({
                        ...input,
                        loading: false,
                    })
                }
            } catch (err) {
                // console.log(err, 'qwertyui')

            }

        }
    }
    return (
        <div>
            <Header />
            <Sidenav />
            <div className="WrapperArea">
                <div className="WrapperBox">
                    <div className="Small-Wrapper">
                    <div className="NewTitleBox">
                        <h2 className="NewTitle">Change Password</h2></div>
                        <div className='CommonForm'>
                            <form onSubmit={handlesubmit}>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Old Password</label>
                                            <input
                                                type={eye1 ? "text" : "password"}
                                                className="form-control"
                                                placeholder="Enter Old Password"
                                                name='oldpassword'
                                                value={oldpassword}
                                                onChange={handleinput}
                                                autoComplete='off'
                                            />
                                            <span className="Eye">
                                                <i className={eye1 ? "fa fa-eye" : 'fa fa-eye-slash'} onClick={() => setToggle({ ...toggle, eye1: !eye1 })} />
                                            </span>
                                            {error && oldpassword.trim() == "" ? <label style={{ color: "red" }}>*Old password is required</label> : ""}
                                        </div>
                                        <div className="form-group">
                                            <label>New Password</label>
                                            <input
                                                type={eye2 ? "text" : "password"}
                                                className="form-control"
                                                placeholder="Enter New Password"
                                                name='newpassword'
                                                value={newpassword}
                                                onChange={handleinput}
                                                autoComplete='off'
                                            />
                                            <span className="Eye">
                                                <i className={eye2 ? "fa fa-eye" : 'fa fa-eye-slash'} onClick={() => setToggle({ ...toggle, eye2: !eye2 })} />
                                            </span>
                                            {error && newpassword.trim() == "" ? <label style={{ color: "red" }}>*New password is required</label> : error && (oldpassword == newpassword) ? <label style={{ color: "red" }}>*Old password and new password cannot be same</label> : ""}
                                        </div>
                                        <div className="form-group">
                                            <label>Re-enter Password</label>
                                            <input
                                                type={eye3 ? 'text' : "password"}
                                                className="form-control"
                                                placeholder="Enter Re-enter Password"
                                                name='reenterpassword'
                                                value={reenterpassword}
                                                onChange={handleinput}
                                                autoComplete='off'
                                            />
                                            <span className="Eye">
                                                <i className={eye3 ? "fa fa-eye" : 'fa fa-eye-slash'} onClick={() => setToggle({ ...toggle, eye3: !eye3 })} />
                                            </span>
                                            {error && reenterpassword.trim() == "" ? <label style={{ color: "red" }}>*Confirm password is required</label> : error && (newpassword != reenterpassword) ? <label style={{ color: "red" }}>*New password and confirm password must be same</label> : ""}
                                        </div>
                                        <button className="Button" disabled={loading}>Change Password</button>
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

export default ChangePassword
