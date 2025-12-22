import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { commomObj } from "../utils";
import { SetPassword } from "../api/authApi";

import LogoInner from "../assets/images/Logo-Inner.png";
import LoginIllustrationBlur from "/images/login-bg_blur.webp";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { BiLoader } from "react-icons/bi";

const SetPasswordPage = () => {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const setPasswordMutation = useMutation({
    mutationFn: SetPassword,

    onSuccess: (res) => {
      toast.success(res.data.message, commomObj);
      navigate("/login");
    },

    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Token expired or invalid",
        commomObj
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password || password !== confirmPassword) {
      return toast.error("Passwords do not match", commomObj);
    }

    setPasswordMutation.mutate({ token, password });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">

      <img src={LoginIllustrationBlur} className="absolute inset-0 blur-xl" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="rounded-2xl shadow-xl p-8 bg-white/60 backdrop-blur-sm">

          <div className="flex justify-center mb-6">
            <img src={LogoInner} className="max-h-14" />
          </div>

          <h3 className="text-2xl font-bold text-center mb-2">
            Set Your Password
          </h3>

          <p className="text-center text-gray-600 mb-6 text-sm">
            This link is time-sensitive for your security.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                className="input w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="input w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={setPasswordMutation.isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg"
            >
              {setPasswordMutation.isPending ? (
                <span className="flex justify-center gap-2">
                  <BiLoader className="animate-spin" /> Saving...
                </span>
              ) : (
                "Set Password"
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default SetPasswordPage;
