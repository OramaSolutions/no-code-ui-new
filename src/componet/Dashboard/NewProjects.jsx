import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';


import { HiArrowRight } from 'react-icons/hi';
import { MdAutoFixHigh, MdImage, MdCategory, MdTextFields } from 'react-icons/md';
import { FaCheck } from 'react-icons/fa';

const projectTypes = [
    {
        id: 'objectdetection',
        title: 'Object Detection',
        description: 'Train a model with as little as 20 labeled data for detecting objects within images.',
        icon: MdImage,
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'from-blue-50 to-indigo-50',
        img: '/images/objectD.png',

        applications: [
            'Single Page Object Detection',
            'Multiple Projects, User and Admin Supported Object Detection',
            'Labelling Tool Integrated for Re-Training Support to Increase Accuracy'
        ]
    },
    {
        id: 'defectdetection',
        title: 'Defect Detection',
        description: 'Perform defect detection with limited labeling',
        icon: MdAutoFixHigh,
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'from-purple-50 to-pink-50',
        img: '/images/defectD.png',

        applications: [
            'Automated Industrial Defect Detection System',
            'Supports Multi-Category Defect Analysis for Quality Control',
            'Real-Time Feedback Loop for Improved Model Accuracy'
        ]
    },
    {
        id: 'Classification',
        title: 'Classification',
        description: 'Perform classification tasks with your custom data',
        icon: MdCategory,
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'from-green-50 to-teal-50',
        img: '/images/classF.png',

        applications: [
            'Custom Image Classification Projects',
            'Live Model Monitoring & Metric Visualization',
            'Supports Incremental Training and Multi-Class Classification'
        ]
    },
    {
        id: 'textextraction',
        title: 'Text Extraction',
        description: 'Extract text from images using OCR technology',
        icon: MdTextFields,
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'from-orange-50 to-red-50',
        img: '/images/textE.png',

        applications: [
            'OCR-Based Text Extraction from Images and Documents',
            'Supports Multi-Language Text Recognition',
            'Editable and Searchable Output Generation for Digital Archives'
        ]
    }
];




const NewProjects = ({ openCreateModal }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
        >
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Create New Project
                </h2>
                <p className="text-gray-600 text-sm">
                    Choose a project type to start your AI model training
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {projectTypes.map((project, index) => {
                    const Icon = project.icon;
                    return (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                            whileHover={{ y: -5 }}
                            className="group cursor-pointer"
                            onClick={() => openCreateModal(project.id)}
                        >
                            <div className={`bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden h-full flex flex-col`}>
                                {/* Image Header */}
                                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                                    <img
                                        src={project.img}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {/* <div className="absolute top-4 right-4">
                                        <div className={`w-12 h-12 bg-gradient-to-br ${project.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                    </div> */}
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {project.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {project.description}
                                    </p>

                                    {/* Requirements/Checkpoints */}
                                    <div className="flex-1 mb-4">
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                                            Applications
                                        </h4>
                                        <ul className="space-y-2">
                                            {project.applications?.map((req, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                                                    <FaCheck className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                    <span className="leading-relaxed">{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Create Button */}
                                    <button className={`w-full bg-gradient-to-r ${project.color} text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group-hover:scale-105`}>
                                        <span>Create Project</span>
                                        <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    )
}

export default NewProjects