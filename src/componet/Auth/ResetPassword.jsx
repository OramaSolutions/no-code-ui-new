import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom'
import { commomObj } from '../../utils';
import { toast } from 'react-toastify';
import { SetPassword } from '../../reduxToolkit/Slices/authSlices';

const initialState={
    password:"",
    confirmPassword:"",
    loading:false,
    eye1:false,
    eye2:false,
}

const ResetPassword = () => {
    const dispatch=useDispatch();
const navigate=useNavigate();
const location =useLocation();
const[show,setShow]=useState(initialState)
const [error, setError] = useState(false);
const{password,confirmPassword,loading,eye1,eye2}=show;

// console.log("check the token")
const token=location?.search?.split("?")[1]
// console.log(token,"tokennnnnnnnnnn")

//=========================================input handler=====================================================
   const inputHandler = (e) => {
    const { name, value } = e.target;
    setShow({ ...show, [name]: value })
}
   //===================================handle submit=================================================================
   const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.trim() == "" || confirmPassword?.trim() == "" || password !== confirmPassword || (!/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password.trim()))) {
        setError(true)
    }else{
    try {
        const data = { token:token, password: password.trim() };
        const res = await dispatch(SetPassword(data))
        // console.log(res,"ressssssss")
        if (res?.payload?.code === 200) {
            toast.success(res.payload.message, commomObj)
            navigate("/loginSuccess") 
            setShow({ ...show, password: "", loading: false,confirmPassword:"" })
        }
        else {
            toast.error(res?.payload?.message, commomObj)
            setShow({ ...show, loading: false })
        }
    }
    catch (err) {
        toast.error(err?.payload?.message, commomObj)
        // console.log("erttttrdesfg", err)
    }
}

};
    return (
        <div>
            <div className="LoginArea">
                <div className="LoginBox">
                    <form onSubmit={handleSubmit}>
                        <h3>
                            Create New Password
                        </h3>
                        <p>
                            Type Your New Password
                        </p>
                        <div className="form-group">
                            <input
                                className="form-control"
                                placeholder="New Password"
                                type={eye1?"text":"password"}
                                name='password'
                                value={password}
                                onChange={inputHandler}
                            />
                            <span className="Icon">
                                <i className={eye1?"fa fa-eye":'fa fa-eye-slash'} onClick={()=>setShow({...show,eye1:!eye1})}/>
                            </span>
                            {error && password.trim() == "" ? <span style={{ color: "red" }}>*Password is required</span>:error&&(!/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password))? <span style={{ color: "red" }}>*Combine uppercase and lowercase letters, and symbols</span>: ''}
                        </div>
                        <div className="form-group">
                            <input
                                className="form-control"
                                placeholder="Confirm Password"
                                type={eye2?"text":"password"}
                                name='confirmPassword'
                                value={confirmPassword}
                                onChange={inputHandler}
                            />
                            <span className="Icon">
                                <i className={eye2?"fa fa-eye":'fa fa-eye-slash'} onClick={()=>setShow({...show,eye2:!eye2})} />
                            </span>
                            {error && confirmPassword.trim() == "" ? <span style={{ color: "red" }}>*Confirm Password is required</span> :error && password !== confirmPassword ? <span style={{ color: "red" }}>*New password and confirm password must be same </span> : ''}
                        </div>
                        <button
                            className="Button"
                            disabled={loading}
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
