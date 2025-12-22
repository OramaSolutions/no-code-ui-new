import React from 'react'
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {

    FiX,
    FiImage,
    FiTag,
    FiScissors,
    FiDownload,
    FiChevronDown,
    FiBarChart2,
    FiClock,
    FiCalendar,
    FiUser,
    FiRefreshCw,
    FiCheckCircle,
    FiXCircle,
    FiPercent,
    FiChevronLeft

} from "react-icons/fi";

import TrainingStatusModal from './TrainingStatusModal'


const OverviewHeader = ({ trainLoading,

    backURL,
    projectName,
    datasetLength,
    handleTypeChange,
    loadingType,
    labelOrSegment,

    setShowStatsDropdown,
    stats,
    showStatsDropdown
}) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col justify-between  mx-2 w-full pt-20">
            {" "}
            <div className="mb-4">
                <button
                    className="bg-gray-100 flex items-center px-2 py-1 rounded hover:bg-blue-200 hover:text-blue-500 hover:underline"
                    onClick={() => navigate(backURL)}
                >
                    <FiChevronLeft />   Dashboard
                </button>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{projectName}</h1>
                    <p className="text-gray-500 mt-1">
                        Dataset Length - {datasetLength}
                    </p>
                </div>

                <div className="flex flex-row gap-5 justify-between items-center">
                    <div className="mt-4 md:mt-0 flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                            className={`flex items-center px-2 py-1 rounded-md transition-all ${labelOrSegment === "bbox"
                                ? "bg-indigo-600 text-white shadow-sm"
                                : "text-gray-700 hover:bg-gray-200"
                                }`}
                            onClick={() => handleTypeChange("bbox")}
                            disabled={loadingType}
                        >
                            <FiTag className="mr-2" />
                            Bounding Box
                            {loadingType && labelOrSegment === "bbox" && (
                                <span className="ml-2 inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            )}
                        </button>
                        <button
                            className={`flex items-center px-2 py-1 rounded-md transition-all ${labelOrSegment === "segment"
                                ? "bg-indigo-600 text-white shadow-sm"
                                : "text-gray-700 hover:bg-gray-200"
                                }`}
                            onClick={() => handleTypeChange("segment")}
                            disabled={loadingType}
                        >
                            <FiScissors className="mr-2" />
                            Segment
                            {loadingType && labelOrSegment === "segment" && (
                                <span className="ml-2 inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            )}
                        </button>

                    </div>


                    <ProjectStats setShowStatsDropdown={setShowStatsDropdown} stats={stats} showStatsDropdown={showStatsDropdown} />
                </div>
            </div>
        </div>
    )
}

export default OverviewHeader

const ProjectStats = ({ showStatsDropdown, setShowStatsDropdown, stats }) => {
    return (
        <div className="relative">
            <button
                className="group flex items-center px-1 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                onClick={() => setShowStatsDropdown(!showStatsDropdown)}
            >
                <span className="">Project Stats</span>
                <FiChevronDown
                    className={`ml-2 w-4 h-4 transition-transform duration-200 ${showStatsDropdown ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {showStatsDropdown && stats && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50 animate-fade-in-up">
                    {/* Header */}
                    <div className="px-5 py-3.5 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-100">
                        <h3 className="font-semibold text-indigo-800 flex items-center">
                            <FiBarChart2 className="w-5 h-5 mr-2 text-indigo-600" />
                            Project Overview
                        </h3>
                    </div>

                    {/* Stats List */}
                    <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                        {[
                            { label: "Annotation Type", value: stats.annotationType, icon: <FiTag className="text-gray-400" /> },
                            { label: "Total Images", value: stats.totalImages, icon: <FiImage className="text-gray-400" /> },
                            { label: "Labeled Images", value: stats.labeledImages, icon: <FiCheckCircle className="text-gray-400" /> },
                            { label: "Unlabeled Images", value: stats.unlabeledImages, icon: <FiXCircle className="text-gray-400" /> },
                            {
                                label: "Completion",
                                value: `${stats.completionPercentage}%`,
                                icon: <FiPercent className="text-gray-400" />,
                                extra: (
                                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                                        <div
                                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full"
                                            style={{ width: `${stats.completionPercentage}%` }}
                                        ></div>
                                    </div>
                                )
                            },
                        ].map((item, index) => (
                            <li key={index} className="px-5 py-3 hover:bg-gray-50 transition-colors duration-150">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-0.5">
                                        {item.icon}
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {item.label}
                                        </div>
                                        <div className="text-sm font-semibold text-gray-800 mt-0.5">
                                            {item.value}
                                        </div>
                                        {item.extra && item.extra}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Footer */}
                    <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
                        <span>Last updated: {new Date().toLocaleTimeString()}</span>
                        <button
                            className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center"
                            onClick={() => setShowStatsDropdown(false)}
                        >
                            <FiX className="mr-1" /> Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};