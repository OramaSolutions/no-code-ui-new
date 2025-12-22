import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { commomObj } from "../utils";
import { Link } from "react-router-dom";
import axios from "axios";
import { userSignup } from "../api/authApi";
import { Url } from "../config/config";

import LogoInner from "../assets/images/Logo-Inner.png";
import LoginIllustrationBlur from "/images/login-bg_blur.webp";
import {
    HiMail,
    HiUser,
    HiOfficeBuilding,
    HiPhone,
    HiLocationMarker,
    HiBriefcase,
    HiIdentification
} from "react-icons/hi";
import { BiLoader } from "react-icons/bi";
import { FiKey } from "react-icons/fi";

const initialState = {
    userName: "",
    name: "",
    email: "",
    phoneNumber: "",
    city: "",
    company: "",
    designation: "",
    usageFor: "",
    errors: {},
};

const Signup = () => {
    const [loaded, setLoaded] = useState(false);
    const [show, setShow] = useState(initialState);
    const [activeField, setActiveField] = useState(null);

    const signupMutation = useMutation({
        mutationFn: userSignup,

        onSuccess: (res) => {
            toast.success(res.data.message, commomObj);
            console.log('password link', res.data.passwordLink)
            setShow(initialState);
        },

        onError: (err) => {
            toast.error(
                err?.response?.data?.message || "Signup failed",
                commomObj
            );
        },
    });

    const inputHandler = (e) => {
        const { name, value } = e.target;
        setShow({ ...show, [name]: value });
    };

    const handleValidation = () => {
        let error = {};
        let valid = true;

        Object.keys(initialState).forEach((key) => {
            if (key !== "errors" && !show[key]) {
                error[key] = "Required";
                valid = false;
            }
        });

        setShow({ ...show, errors: error });
        return valid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!handleValidation()) return;
        signupMutation.mutate(show);
    };

    const getIcon = (fieldName) => {
        switch (fieldName) {
            case 'userName': return HiUser;
            case 'name': return HiIdentification;
            case 'email': return HiMail;
            case 'phoneNumber': return HiPhone;
            case 'city': return HiLocationMarker;
            case 'company': return HiOfficeBuilding;
            case 'designation': return HiBriefcase;
            case 'usageFor': return FiKey;
            default: return HiUser;
        }
    };

    const getPlaceholder = (fieldName) => {
        switch (fieldName) {
            case 'userName': return "Username";
            case 'name': return "Full Name";
            case 'email': return "Email Address";
            case 'phoneNumber': return "Phone Number";
            case 'city': return "City";
            case 'company': return "Company";
            case 'designation': return "Designation";
            case 'usageFor': return "What will you use this for?";
            default: return "";
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <img
                src={LoginIllustrationBlur}
                alt=""
                loading="eager"

                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"
                    }`}
                onLoad={() => setLoaded(true)}
            />

            <div className="relative z-10 w-full max-w-4xl px-6 p-4">
                <div className="rounded-2xl shadow-xl p-8 bg-white/90">
                    <div className="flex justify-center mb-8">
                        <img src={LogoInner} alt="Logo" className="max-h-16" />
                    </div>

                    <h3 className="text-3xl font-bold text-center text-gray-800 mb-2">
                        Create Your Account
                    </h3>
                    <p className="text-center font-semibold text-gray-600 mb-8 max-w-lg mx-auto">
                        Start your 7-day free trial. You'll receive a secure email to set your password.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['email', 'userName', 'name', 'phoneNumber', 'city', 'company', 'designation', 'usageFor'].map((fieldName) => {
                                const Icon = getIcon(fieldName);
                                const isActive = activeField === fieldName;
                                const hasError = show.errors[fieldName];

                                return (
                                    <div
                                        key={fieldName}
                                        className={fieldName === 'email' || fieldName === 'phoneNumber' ? 'col-span-2' : 'col-span-1'}
                                    >
                                        <div className="relative">
                                            <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${isActive ? 'text-blue-600' : 'text-gray-400'
                                                }`}>
                                                <Icon className="w-5 h-5" />
                                            </div>

                                            <input
                                                name={fieldName}
                                                type={fieldName === 'email' ? 'email' : fieldName === 'phoneNumber' ? 'tel' : 'text'}
                                                placeholder={getPlaceholder(fieldName)}
                                                value={show[fieldName]}
                                                onChange={inputHandler}
                                                onFocus={() => setActiveField(fieldName)}
                                                onBlur={() => setActiveField(null)}
                                                className={`w-full pl-12 pr-4 py-3 bg-white border rounded-lg focus:outline-none transition-all duration-200 ${hasError
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                                                    : isActive
                                                        ? 'border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                            />

                                            {hasError && (
                                                <p className="mt-1 text-sm text-red-500">
                                                    {hasError}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            type="submit"
                            disabled={signupMutation.isPending}
                            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {signupMutation.isPending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <BiLoader className="animate-spin" />
                                    Creating account...
                                </span>
                            ) : (
                                "Start Free Trial"
                            )}
                        </button>

                        <p className="text-center text-xs text-gray-500 mt-4">
                            By signing up, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                        <p className="text-gray-600">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;