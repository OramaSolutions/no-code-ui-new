import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import LogoutModal from './LogoutModal';
import { notificationList } from '../reduxToolkit/Slices/notificationSlices';
import { HiMenu, HiBell, HiChevronDown } from 'react-icons/hi';
import { MdLogout } from 'react-icons/md';

const initialState = {
    openModal: false,
    showDropdown: false,
};

function Header({ sidebarOpen, setSidebarOpen }) {
    const { notificationData, loader } = useSelector((state) => state.notification);
    const dispatch = useDispatch();
    const [istate, updateIstate] = useState(initialState);
    const { openModal, showDropdown } = istate;
    const profileimage = JSON.parse(window.localStorage.getItem("sellerimage"));
    const sellerLogin = JSON.parse(window.localStorage.getItem("userLogin"));

    const openLogoutModal = () => {
        updateIstate({ ...istate, openModal: true, showDropdown: false });
    };

    const toggleDropdown = () => {
        updateIstate({ ...istate, showDropdown: !showDropdown });
    };

    useEffect(() => {
        dispatch(notificationList());
        const interval = setInterval(() => {
            dispatch(notificationList());
        }, 120000);
        return () => clearInterval(interval);
    }, [dispatch]);

    const unreadCount = notificationData?.filter(n => !n.isRead)?.length || 0;

    return (
        <>
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm"
            >
                <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                    {/* Left Side */}
                    <div className="flex items-center gap-4">
                        {/* Sidebar Toggle Button */}
                        <motion.button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <HiMenu className="w-6 h-6" />
                        </motion.button>

                        {/* Greeting */}
                        <div className="hidden sm:block">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Welcome, {sellerLogin?.firstName || 'User'}!
                            </h2>
                            <p className="text-sm text-gray-500">
                                Let's finish your task today!
                            </p>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <motion.div
                            className="relative"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors relative">
                                <HiBell className="w-6 h-6" />
                                {unreadCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                                    >
                                        {unreadCount}
                                    </motion.span>
                                )}
                            </button>
                        </motion.div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <motion.button
                                onClick={toggleDropdown}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center overflow-hidden">
                                    {profileimage ? (
                                        <img
                                            src={profileimage}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-white font-semibold text-lg">
                                            {sellerLogin?.firstName?.charAt(0) || 'U'}
                                        </span>
                                    )}
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium text-gray-900">
                                        {sellerLogin?.firstName || 'User'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {sellerLogin?.email || ''}
                                    </p>
                                </div>
                                <HiChevronDown className="w-5 h-5 text-gray-400" />
                            </motion.button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {showDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                                    >
                                        <button
                                            onClick={openLogoutModal}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <MdLogout className="w-5 h-5" />
                                            <span className="font-medium">Logout</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Logout Modal */}
            <LogoutModal istate={istate} updateIstate={updateIstate} />
        </>
    );
}

export default Header;
