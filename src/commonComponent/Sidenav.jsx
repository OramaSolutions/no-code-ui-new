import React, {useState} from 'react'
import { Link, NavLink } from 'react-router-dom'
import HelpSupport from '../componet/Auth/HelpCenter'
import logoInner from "../assets/images/Logo-Inner.png"
import sidenavIcon1 from "../assets/images/sidenav-1.png"
import sidenavIcon2 from "../assets/images/sidenav-2.png"
import sidenavIcon3 from "../assets/images/sidenav-3.png"
import sidenavIcon4 from "../assets/images/sidenav-4.png"
import sidenavIcon5 from "../assets/images/sidenav-5.png"
import questionIcon from "../assets/images/question.png"

const initialState = {
    modal: false,
}

const Sidenav = () => {
    const [show, setShow] = useState(initialState)
    const {modal} = show;

    const openHelpModal = () => {
        setShow({...show, modal: true})
    }
    
    return (
        <div>
            <div className="SidenavBar">
                <div className="Logo">                  
                    <img src={logoInner} alt="Logo" />
                </div>
                <ul>
                    <li>
                        <NavLink to="/dashboard">
                            <span>
                                <img src={sidenavIcon1} alt="Dashboard" />
                            </span>
                            {' '}Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            data-target="#NewProject"
                            data-toggle="modal"
                            to="/projects"
                        >
                            <span>
                                <img src={sidenavIcon2} alt="New Project" />
                            </span>
                            {' '}New Project
                        </NavLink>
                        {' '}
                    </li>
                    <li>
                        <NavLink
                            data-target="#OpenProject"
                            data-toggle="modal"
                            to="/project-management"
                        >
                            <span>
                                <img src={sidenavIcon3} alt="Open Project" />
                            </span>
                            {' '}Open Project
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/support">
                            <span>
                                <img src={sidenavIcon4} alt="Support" />
                            </span>
                            {' '}Support
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/my-account">
                            <span>
                                <img src={sidenavIcon5} alt="My Account" />
                            </span>
                            {' '}My Account
                        </NavLink>
                    </li>
                </ul>
                <div className="SidenavFooter">
                    <h5>
                        Help Center
                    </h5>
                    <p>
                        Having Trouble in Learning. <br/> Please contact us for more questions.
                    </p>
                    <button className='Button' onClick={openHelpModal}>
                        Go To Help Center
                    </button>
                    <div className="Overlay">
                        <img src={questionIcon} alt="Question" />
                    </div>
                </div>
            </div>
            <HelpSupport
             show={show}
             setShow={setShow}
             help={"help"}
            />
        </div>
    )
}

export default Sidenav
