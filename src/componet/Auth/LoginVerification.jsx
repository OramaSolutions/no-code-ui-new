import React from 'react'
import { Link } from 'react-router-dom'

const LoginVerification = () => {
    return (
        <div>
            <div className="LoginArea">
                <div className="LoginBox">
                    <form>
                        <h3>
                            Success
                        </h3>
                        <figure>                          
                            {/* <img src={require("../../assets/images/check.png")}  /> */}
                        </figure>
                        <p className="Second">
                            Please check your email for{' '}
                            <br />
                            {' '}create a new password
                        </p>
                        <p className="Second">
                            Can't get email?{' '}
                            <a href="javscript:void(0);">
                                Resubmit
                            </a>
                        </p>
                        <Link
                            className="Button"
                            to="/login-forgot"
                        >
                            Back Email
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginVerification
