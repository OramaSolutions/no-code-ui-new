import React from 'react'
import { Link } from 'react-router-dom'

const LoginSuccess = () => {
    return (
        <div>
            <div className="LoginArea">
                <div className="LoginBox">
                    <form>
                        <figure>                            
                            {/* <img src={require("../../assets/images/check.png")} /> */}
                        </figure>
                        <p className="Second">
                            Your Password has{' '}
                            <br />
                            been reset Successfully
                        </p>
                        <Link
                            className="Button"
                            to="/"
                        >
                            Done
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginSuccess
