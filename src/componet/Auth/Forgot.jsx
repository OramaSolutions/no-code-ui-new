import React,{useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { sendEmail } from '../../reduxToolkit/Slices/oldauthSlices';
import { commomObj } from '../../utils';
import logoInner from "../../assets/images/Logo-Inner.png"
let initialstate = {
    email: '',
    loading: false,
};

const Forgot = () => {
    const [show, setShow] = useState(initialstate)
    const { email, loading } = show;
    const [error, setError] = useState(false)
    // console.log(show, 'showwwww')/
    const dispatch = useDispatch()
    const navigate = useNavigate();

//=========================================input handler=====================================================
    const inputHandler = (e) => {
        const { name, value } = e.target;
        setShow({ ...show, [name]: value })
    }
//===================================handle submit=================================================================
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (email?.trim() == "" || !/^.+?@.+?\..+$/.test(email)) {
            setError(true)
        }
        else {
            try {
                const data = { email: email.trim() };
                const res = await dispatch(sendEmail(data))
                // console.log(res, "ressssssss")
                if (res?.payload?.code === 200) {
                    navigate('/loginVerification');
                    toast.success("Email sent Successfully", commomObj)

                    setShow({ ...show, email: "", loading: false })
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
                    <figure>
                        <img src={logoInner} />
                    </figure>
                    <form onSubmit={handleSubmit}>
                        <h3>
                            Forgot Password
                        </h3>
                        <p>
                            Enter your email. We will send you 4 digit Code
                        </p>
                        <div className="form-group">
                            <input
                                className="form-control"
                                placeholder="Enter Email Address"
                                type="text"
                                name='email'
                                value={email}
                                onChange={inputHandler}
                            />
                         {error && email.trim() == "" ? <span style={{ color: "red" }}>*Email is required</span> : error && (!/^.+?@.+?\..+$/.test(email)) ? <span style={{ color: "red" }}>*Email format is not valid</span> : ''}
                        </div>
                        <button
                            className="Button"
                            disabled={loading}
                        >
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Forgot
