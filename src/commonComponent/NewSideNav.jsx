import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink } from 'react-router-dom';
import HelpSupport from '../componet/Auth/HelpCenter';
import logoInner from "../assets/images/Logo-Inner.png";
import sidenavIcon1 from "../assets/images/sidenav-1.png";
import sidenavIcon2 from "../assets/images/sidenav-2.png";
import sidenavIcon3 from "../assets/images/sidenav-3.png";
import sidenavIcon4 from "../assets/images/sidenav-4.png";
import sidenavIcon5 from "../assets/images/sidenav-5.png";
import questionIcon from "../assets/images/question.png";
import { HiQuestionMarkCircle } from 'react-icons/hi';

const initialState = {
    modal: false,
};

const Sidenav = ({ isOpen, setIsOpen }) => {
    const [show, setShow] = useState(initialState);
    const { modal } = show;

    const openHelpModal = () => {
        setShow({ ...show, modal: true });
    };

    const menuItems = [
        { icon: sidenavIcon1, label: 'Dashboard', path: '/dashboard' },
        { icon: sidenavIcon2, label: 'Projects', path: '/projects' },
        // { icon: sidenavIcon3, label: 'Training', path: '/training' },
        { icon: sidenavIcon4, label: 'Analytics', path: '/analytics' },
        { icon: sidenavIcon5, label: 'Settings', path: '/settings' },
    ];

    return (
        <>
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isOpen ? '280px' : '80px',
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 shadow-sm"
            >
                {/* Logo Section */}
                <div className="h-16 flex items-center justify-center border-b border-gray-200 px-4">
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.img
                                key="full-logo"
                                src={logoInner}
                                alt="Logo"
                                className="h-10 w-auto"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                            />
                        ) : (
                            <motion.div
                                key="mini-logo"
                                className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                            >
                                <span className="text-white font-bold text-xl">O</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 py-6 overflow-y-auto">
                    <ul className="space-y-2 px-3">
                        {menuItems.map((item, index) => (
                            <motion.li
                                key={item.path}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                            >
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                                            isActive
                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <motion.img
                                                src={item.icon}
                                                alt={item.label}
                                                className={`w-5 h-5 ${isActive ? 'brightness-0 invert' : ''}`}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            />
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.span
                                                        initial={{ opacity: 0, width: 0 }}
                                                        animate={{ opacity: 1, width: 'auto' }}
                                                        exit={{ opacity: 0, width: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="font-medium whitespace-nowrap overflow-hidden"
                                                    >
                                                        {item.label}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </>
                                    )}
                                </NavLink>
                            </motion.li>
                        ))}
                    </ul>
                </nav>

                {/* Help Section */}
                <div className="border-t border-gray-200 p-4">
                    <motion.div
                        className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 ${
                            isOpen ? 'block' : 'hidden'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <HiQuestionMarkCircle className="w-5 h-5 text-blue-600" />
                            <h4 className="font-semibold text-gray-900 text-sm">
                                Having Trouble?
                            </h4>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">
                            Contact us for more questions
                        </p>
                        <motion.button
                            onClick={openHelpModal}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Get Help
                        </motion.button>
                    </motion.div>

                    {/* Collapsed Help Button */}
                    {!isOpen && (
                        <motion.button
                            onClick={openHelpModal}
                            className="w-full flex items-center justify-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <HiQuestionMarkCircle className="w-6 h-6 text-blue-600" />
                        </motion.button>
                    )}
                </div>
            </motion.aside>

            {/* Help Support Modal */}
            <HelpSupport show={show} setShow={setShow} help={true} />
        </>
    );
};

export default Sidenav;
