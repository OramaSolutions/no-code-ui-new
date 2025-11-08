import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../commonComponent/DashboardLayout';
import { dashboardList } from '../../reduxToolkit/Slices/dashboardSlices';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../commonComponent/Loader';
import { useNavigate } from 'react-router-dom';
import CalendarComponent from './Calender';
import CreateProject from './CreateProject';
import { HiArrowRight } from 'react-icons/hi';
import { MdAutoFixHigh, MdImage, MdCategory, MdTextFields } from 'react-icons/md';
import { FaCheck } from 'react-icons/fa';
import NewProjects from './NewProjects';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [createProjectState, setCreateProjectState] = useState({
        open: false,
        model: ""
    });

    const { dashboardData, loader } = useSelector((state) => state.dashboard);
   
    useEffect(() => {
        dispatch(dashboardList());
    }, []);

    const navigateHandler = (projectName, versionNumber, projectId, model) => {
        const redirect = model == "objectdetection" ? "/object-detection-training" :
            model == "Classification" ? "/classification-training" :
                "/defect-detection-training";
        navigate(redirect, {
            state: { name: projectName, version: versionNumber, projectId: projectId }
        });
    };

    const openCreateModal = (type) => {
        setCreateProjectState({ open: true, model: type });
    };



    return (
        <DashboardLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
                {/* Middle Section - Create New Project (Takes 2 columns on large screens) */}
                <div className="lg:col-span-2 space-y-6">


                  

                    {/* Create New Project Section */}
                    <NewProjects openCreateModal={openCreateModal} />
                </div>

                {/* Right Sidebar - Calendar & Latest Projects */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Calendar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <CalendarComponent />
                    </motion.div>

                    {/* Latest Projects */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">
                                Latest Projects
                            </h3>
                            <button
                                onClick={() => navigate('/project-management')}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                View All
                            </button>
                        </div>

                        {loader ? (
                            <Loader />
                        ) : dashboardData?.result?.length > 0 ? (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {dashboardData.result.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        // initial={{ opacity: 0, x: 20 }}
                                        // animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + index * 0.05, duration: 0.3 }}
                                        // whileHover={{ scale: 1.02, x: 5 }}
                                        className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer"
                                        onClick={() => navigateHandler(
                                            item?.name,
                                            item?.versionNumber,
                                            item?.projectId,
                                            item?.model
                                        )}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 flex-1">
                                                {item?.name}
                                            </h4>
                                            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full ml-2">
                                                v{item?.versionNumber}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 mb-2">
                                            {item?.model}
                                        </p>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {new Date(item?.createdAt).toLocaleDateString()}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 text-sm font-medium">No projects yet</p>
                                <p className="text-gray-400 text-xs mt-1">Create your first project above</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Quick Actions Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg p-5 text-white"
                    >
                        <h3 className="text-lg font-bold mb-2">Need Help?</h3>
                        <p className="text-indigo-100 text-sm mb-4">
                            Check out our documentation or contact support
                        </p>
                        <div className="space-y-2">
                            <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm">
                                View Documentation
                            </button>
                            <button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm">
                                Contact Support
                            </button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Create Project Modal */}
            <CreateProject
                istate={createProjectState}
                updateIstate={setCreateProjectState}
            />
        </DashboardLayout>
    );
};

export default Dashboard;
