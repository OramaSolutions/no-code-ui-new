import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiLogOut, FiX } from "react-icons/fi";
import { commomObj } from "../utils";
import { logout } from "../reduxToolkit/Slices/authSlices";
import { logoutUser } from "../api/authApi";

const LogoutModal = ({ istate, updateIstate }) => {
  const { openModal } = istate;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logoutUser();  // ✅ Wait for backend to clear cookie

      dispatch(logout());
      toast.success("Logout Successfully", commomObj);

      updateIstate({ ...istate, openModal: false });
      navigate("/", { replace: true });

    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed", commomObj);
    }
  };

  const handleClose = () => {
    updateIstate({ ...istate, openModal: false });
  };

  return (
    <AnimatePresence>
      {openModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 180, damping: 15 }}
            className="relative w-[90%] max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-6"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-indigo-600 transition"
            >
              <FiX size={22} />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                <FiLogOut size={36} />
              </div>
            </div>

            {/* Title & Message */}
            <h3 className="text-xl font-semibold text-gray-800 text-center">
              Log Out
            </h3>
            <p className="text-gray-500 text-center mt-2">
              Are you sure you want to log out?
            </p>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleClose}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 transition font-medium"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogoutModal;
