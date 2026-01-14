import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { commomObj } from '../../utils';
import { checkProject } from '../../reduxToolkit/Slices/projectSlices';
import CreateVersion from './CreateVersion';
import CheckVersion from './CheckVersion';
import { IoClose } from 'react-icons/io5';
import { MdDriveFileRenameOutline } from 'react-icons/md';

const initialState = {
  projectName: "",
  openVersion: false,
  openModal: false,
};

const validateProjectName = (name) => {
  const trimmed = name.trim();
  
  // Check if empty
  if (!trimmed) {
    return { valid: false, message: "Project name is required" };
  }
  
  // Check if only numbers
  if (/^\d+$/.test(trimmed)) {
    return { valid: false, message: "Project name cannot be only numbers" };
  }
  
  // Check for spaces
  if (/\s/.test(trimmed)) {
    return { valid: false, message: "Project name cannot contain spaces" };
  }
  
  // Check for valid characters (alphanumeric, hyphens, underscores only)
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return { valid: false, message: "Project name can only contain letters, numbers, hyphens, and underscores" };
  }
  
  // Check if starts with a letter
  if (!/^[a-zA-Z]/.test(trimmed)) {
    return { valid: false, message: "Project name must start with a letter" };
  }
  
  return { valid: true, message: "" };
};

function CreateProject({ istate, updateIstate }) {
  const [show, setShow] = useState(initialState);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { projectName, openVersion, openModal } = show;
  const { open, model } = istate;
  const dispatch = useDispatch();

  const handleClose = () => {
    updateIstate({ ...istate, open: false, model: "" });
    setShow(initialState);
    setError(false);
    setErrorMessage("");
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setShow({ ...show, [name]: value });
    if (error) {
      setError(false);
      setErrorMessage("");
    }
  };

  const saveHandler = async () => {
    try {
      // Convert to lowercase before validation and sending
      const normalizedName = projectName.toLowerCase();
      const validation = validateProjectName(normalizedName);
      
      if (!validation.valid) {
        setError(true);
        setErrorMessage(validation.message);
      } else {
        const data = { model, name: normalizedName };
        const response = await dispatch(checkProject(data));
        
        if (response?.payload?.code === 200) {
          toast.success(response?.payload?.message, commomObj);
          setShow({ ...show, openVersion: true });
          updateIstate({ ...istate, open: false });
        } else if (response?.payload?.code === 402) {
          toast.error(response?.payload?.message, commomObj);
          setShow({ ...show, openModal: true });
          updateIstate({ ...istate, open: false });
        } else {
          toast.error(response?.payload?.message, commomObj);
        }
      }
    } catch (err) {
      console.log(err, "err");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveHandler();
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 relative">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                  >
                    <IoClose className="w-6 h-6" />
                  </motion.button>
                  <h2 className="text-2xl font-bold text-white">New Project</h2>
                  <p className="text-blue-100 text-sm mt-1">Create a new project to get started</p>
                </div>

                {/* Body */}
                <div className="p-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Project Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MdDriveFileRenameOutline className="w-5 h-5 text-gray-400" />
                      </div>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="text"
                        name="projectName"
                        value={projectName}
                        onChange={inputHandler}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter project name"
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none ${
                          error && !projectName.trim()
                            ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                            : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                        }`}
                      />
                    </div>
                    <AnimatePresence>
                      {error && errorMessage && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-500 text-sm font-medium"
                        >
                          {errorMessage}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={saveHandler}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Create Project
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {openModal && (
        <CheckVersion
          show={show}
          setShow={setShow}
          model={model}
          istate={istate}
          setIstate={updateIstate}
        />
      )}

      {openVersion && (
        <CreateVersion show={show} setShow={setShow} model={model} />
      )}
    </>
  );
}

export default CreateProject;
