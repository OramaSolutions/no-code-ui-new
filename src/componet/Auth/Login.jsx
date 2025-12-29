import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { userLogin } from '../../reduxToolkit/Slices/oldauthSlices';
import { commomObj } from '../../utils';
import { toast } from 'react-toastify';

import { useMutation } from "@tanstack/react-query";
import { useDispatch } from 'react-redux';
import { userLogin } from '../../api/authApi';
import { setAuth } from '../../reduxToolkit/Slices/authSlices';

import { Link, useNavigate } from 'react-router-dom';
import HelpSupport from './HelpCenter';
import LogoInner from "../../assets/images/Logo-Inner.png";
import LoginIllustrationBlur from "/images/login-bg_blur.webp"
import LoginIllustration from "/images/login-bg.webp"; // Your SVG path
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { BiLoader } from 'react-icons/bi';

const initialState = {
    email: "",
    password: "",
    errors: {},
    modal: false,
    showPassword: false,
}

const Login = () => {
    const [loaded, setLoaded] = useState(false);
    const [show, setShow] = useState(initialState);
    const { email, password, errors, modal, showPassword } = show;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginMutation = useMutation({
        mutationFn: userLogin,

        onSuccess: (res) => {

            const data = res.data;

            if (data?.code === 200) {


                setShow(prev => ({ ...prev, modal: true, loading: false }));


                console.log('Login Success setting the dispatch:', data);
                dispatch(setAuth({

                    user: data.activeUser,
                }));

                // navigate('/dashboard');
                toast.success(data.message, commomObj);

                setShow(prev => ({
                    ...prev,
                    email: "",
                    password: "",
                    loading: false
                }));

            } else {
                toast.error(data?.message, commomObj);
                setShow(prev => ({ ...prev, loading: false }));
            }
        },

        onError: (err) => {
            toast.error(
                err?.response?.data?.message || "Login failed",
                commomObj
            );
            setShow(prev => ({ ...prev, loading: false }));
        },
    });

    // Input handler
    const inputHandler = (e) => {
        const { name, value } = e.target;
        setShow({ ...show, [name]: value });
    }

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShow({ ...show, showPassword: !showPassword });
    }

    // Handle submit
    const handleSubmit = (e) => {
        e.preventDefault();

        let formValid = handleValidation();
        if (!formValid) return;

        setShow(prev => ({ ...prev, loading: true }));

        const data = {
            email: email.trim(),
            password: password.trim()
        };

        loginMutation.mutate(data);
    };

    // Validation
    const handleValidation = () => {
        let error = {};
        let formValid = true;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Email empty check
        if (!email.trim()) {
            error.emailIdError = "Email cannot be empty";
            formValid = false;
        }
        // Email format check
        else if (!emailRegex.test(email.trim())) {
            error.emailIdError = "Enter a valid email address";
            formValid = false;
        }

        // Password empty check
        if (!password.trim()) {
            error.PasswordError = "Password cannot be empty";
            formValid = false;
        }

        setShow({ ...show, errors: error });
        return formValid;
    };


    const onSubmit = () => {
        setShow({ ...show, modal: false });
        navigate('/dashboard');
        // toast.success("Login Successfully", commomObj);
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
            {/* Mobile: SVG Background with overlay */}
            {/* <div
                className="absolute inset-0  bg-cover bg-center bg-no-repeat opacity-100"
                style={{ backgroundImage: `url(${LoginIllustration})` }}
            /> */}
            {/* BLURRED LOW-RES IMAGE */}
            <img
                src={LoginIllustrationBlur}
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-xl scale-105"
            />

            {/* HD IMAGE (FADES IN WHEN LOADED) */}
            <img
                src={LoginIllustrationBlur}
                alt=""
                className={`
                    absolute inset-0 w-full h-full object-cover transition-opacity duration-700
                    ${loaded ? "opacity-100" : "opacity-0"}
                `}
                onLoad={() => setLoaded(true)}

                decoding="async"
            />


            {/* Container for Desktop/Tablet Layout */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
                <div className="flex  justify-end items-center">



                    {/* Right Side: Login Form */}
                    <div
                        className="w-full md:w-1/2 "

                    >
                        <div className=" rounded-2xl shadow-xl p-8 sm:p-10 bg-white/80  backdrop-blur-sm ">
                            {/* Logo */}
                            <div
                                className="flex justify-center mb-8"

                            >
                                <img
                                    src={LogoInner}
                                    alt="Logo"
                                    className="h-auto max-h-16 w-auto"
                                />
                            </div>

                            {/* Form */}
                            <form
                                onSubmit={handleSubmit}

                            >
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                                        Welcome Back
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600">
                                        Sign in to access your account
                                    </p>
                                </div>

                                {/* Email Input */}
                                <div className="mb-6">
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <HiMail className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="text"
                                            value={email}
                                            onChange={inputHandler}
                                            placeholder="Enter your email address"
                                            className="w-full h-auto py-2 px-4 border border-gray-300 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                        />
                                    </div>
                                    <AnimatePresence mode="wait">
                                        {errors.emailIdError && (
                                            <motion.span
                                                className="text-red-600 text-sm block mt-2"
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {errors.emailIdError}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Password Input */}
                                <div className="mb-6">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <HiLockClosed className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={inputHandler}
                                            placeholder="Enter your password"
                                            className="w-full h-auto py-2 px-4 border border-gray-300 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            <AnimatePresence mode="wait" initial={false}>
                                                {showPassword ? (
                                                    <motion.div
                                                        key="eye-off"
                                                        initial={{ opacity: 0, rotate: -45 }}
                                                        animate={{ opacity: 1, rotate: 0 }}
                                                        exit={{ opacity: 0, rotate: 45 }}
                                                        transition={{ duration: 0.15 }}
                                                    >
                                                        <HiEyeOff className="w-5 h-5" />
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="eye"
                                                        initial={{ opacity: 0, rotate: -45 }}
                                                        animate={{ opacity: 1, rotate: 0 }}
                                                        exit={{ opacity: 0, rotate: 45 }}
                                                        transition={{ duration: 0.15 }}
                                                    >
                                                        <HiEye className="w-5 h-5" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </button>
                                    </div>
                                    <AnimatePresence mode="wait">
                                        {errors.PasswordError && (
                                            <motion.span
                                                className="text-red-600 text-sm block mt-2"
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {errors.PasswordError}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Forgot Password */}
                                <div className="flex items-center justify-end mb-8">
                                    <Link
                                        to="/login-forgot"
                                        className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loginMutation.isPending}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-xl text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"

                                >
                                    {loginMutation.isPending ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <motion.span
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="inline-block"
                                            >
                                                <BiLoader className="w-5 h-5" />
                                            </motion.span>
                                            Signing in...
                                        </span>
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>

                                {/* Additional Links */}
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-600">
                                        Need help?{' '}
                                        <a
                                            href="mailto:application@oramasolutions.in?subject=Login%20Support%20Request&body=Hello,%20I%20need%20help%20with%20logging%20in%20with%20the%20nocode%20platform."
                                            className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            Contact Support
                                        </a>
                                    </p>
                                </div>


                            </form>
                            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                                <p className="text-gray-600">
                                    Don&apos;t have an account?{" "}
                                    <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                                        Sign Up
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Support Link */}
                        {/* <motion.div
                            className="text-center mt-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.4 }}
                        >
                            <p className="text-sm text-gray-600">
                                Need help?{' '}
                                <button className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                                    Contact Support
                                </button>
                            </p>
                        </motion.div> */}

                    </div>

                </div>
            </div>

            {/* Help Support Modal */}
            <HelpSupport
                show={show}
                setShow={setShow}
                onSubmit={onSubmit}
                help={""}
            />
        </div>
    );
}

export default Login;
