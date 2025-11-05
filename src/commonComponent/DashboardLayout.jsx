import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { notificationList } from '../reduxToolkit/Slices/notificationSlices';
import HelpSupport from '../componet/Auth/HelpCenter';
import LogoutModal from './LogoutModal';
import logoInner from "../assets/images/Logo-Inner.png";
import sidenavIcon1 from "../assets/images/sidenav-1.png";
import sidenavIcon2 from "../assets/images/sidenav-2.png";
import sidenavIcon3 from "../assets/images/sidenav-3.png";
import sidenavIcon4 from "../assets/images/sidenav-4.png";
import sidenavIcon5 from "../assets/images/sidenav-5.png";
import { HiMenu, HiBell, HiChevronDown, HiQuestionMarkCircle } from 'react-icons/hi';
import { MdLogout } from 'react-icons/md';

const DashboardLayout = ({ children, pageTitle, pageDescription }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [openLogoutModal, setOpenLogoutModal] = useState(false);
    const [imageError, setImageError] = useState(false);

    const { notificationData } = useSelector((state) => state.notification);
    const dispatch = useDispatch();

    // Safe localStorage access with error handling
    const getProfileImage = () => {
        try {
            const image = window.localStorage.getItem("sellerimage");
            return image && image !== "null" ? JSON.parse(image) : null;
        } catch (error) {
            console.error("Error parsing profile image:", error);
            return null;
        }
    };

    const getUserLogin = () => {
        try {
            const seller = window.localStorage.getItem("userLogin");
            return seller && seller !== "null" ? JSON.parse(seller) : {};
        } catch (error) {
            console.error("Error parsing seller login:", error);
            return {};
        }
    };

    const profileimage = getProfileImage();
    const userLogin = getUserLogin();


    const menuItems = [
        { icon: sidenavIcon1, label: 'Dashboard', path: '/dashboard' },
        { icon: sidenavIcon2, label: 'Projects', path: '/project-management' },
        // { icon: sidenavIcon3, label: 'Training', path: '/training' },
        { icon: sidenavIcon4, label: 'Analytics', path: '/analytics' },
        { icon: sidenavIcon5, label: 'Settings', path: '/settings' },
    ];

    useEffect(() => {
        dispatch(notificationList());
        const interval = setInterval(() => {
            dispatch(notificationList());
        }, 120000);
        return () => clearInterval(interval);
    }, [dispatch]);

    const unreadCount = notificationData?.filter(n => !n.isRead)?.length || 0;

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: sidebarOpen ? 260 : 80, // Use numbers instead of strings for better animation
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 shadow-sm z-50 shrink-0"
                style={{
                    minWidth: sidebarOpen ? 260 : 80,
                    maxWidth: sidebarOpen ? 260 : 80,
                }}
            >
                {/* Logo Section */}
                <div className="h-16 flex items-center justify-center border-b border-gray-200 px-4">
                    <AnimatePresence mode="wait">
                        {sidebarOpen ? (
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
                                        `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <img
                                                src={item.icon}
                                                alt={item.label}
                                                className={`w-5 h-5 ${isActive ? 'brightness-0 invert' : ''}`}
                                            />
                                            <AnimatePresence>
                                                {sidebarOpen && (
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
                    {sidebarOpen ? (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <HiQuestionMarkCircle className="w-5 h-5 text-blue-600" />
                                <h4 className="font-semibold text-gray-900 text-sm">
                                    Having Trouble?
                                </h4>
                            </div>
                            <p className="text-xs text-gray-600 mb-3">
                                Contact us for more questions
                            </p>
                            <button
                                onClick={() => setShowHelpModal(true)}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                            >
                                Get Help
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowHelpModal(true)}
                            className="w-full flex items-center justify-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            <HiQuestionMarkCircle className="w-6 h-6 text-blue-600" />
                        </button>
                    )}
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        {/* Left Side */}
                        <div className="flex items-center gap-4">
                            {/* Sidebar Toggle Button */}
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                <HiMenu className="w-6 h-6" />
                            </button>

                            {/* Page Title */}
                            <div className="hidden sm:block">
                                {pageTitle ? (
                                    <>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {pageTitle}
                                        </h2>
                                        {pageDescription && (
                                            <p className="text-sm text-gray-500">
                                                {pageDescription}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Welcome, {userLogin?.activeUser?.name || 'User'}!
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Let's finish your task today!
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <div className="relative">
                                <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors relative">
                                    <HiBell className="w-6 h-6" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center overflow-hidden">
                                        <span className="text-white font-semibold text-lg">
                                            {userLogin?.activeUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium text-gray-900">
                                            {userLogin?.activeUser?.name || 'User'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {userLogin?.activeUser?.email || ''}
                                        </p>
                                    </div>
                                    <HiChevronDown className="w-5 h-5 text-gray-400" />
                                </button>

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
                                                onClick={() => {
                                                    setShowDropdown(false);
                                                    setOpenLogoutModal(true);
                                                }}
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
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 ">
                    {children}
                </main>
            </div>

            {/* Modals */}
            <HelpSupport
                show={{ modal: showHelpModal }}
                setShow={(val) => setShowHelpModal(val.modal)}
                help={true}
            />
            <LogoutModal
                istate={{ openModal: openLogoutModal }}
                updateIstate={(val) => setOpenLogoutModal(val.openModal)}
            />
        </div>
    );
};

export default DashboardLayout;
