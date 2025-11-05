import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';


import { HiArrowRight } from 'react-icons/hi';
import { MdAutoFixHigh, MdImage, MdCategory, MdTextFields } from 'react-icons/md';
import { FaCheck } from 'react-icons/fa';

const projectTypes = [
    {
        id: 'objectdetection',
        title: 'Object Detection',
        description: 'Train a model with labeled data for detecting objects within images.',
        icon: MdImage,
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'from-blue-50 to-indigo-50',

        requirements: [
            'Use labeled data in YOLO format',
            'Require a minimum of 300 images for training',
            'Ensure proper labeling of objects without any errors'
        ]
    },
    {
        id: 'defectdetection',
        title: 'Defect Detection',
        description: 'Perform defect detection with limited labeling',
        icon: MdAutoFixHigh,
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'from-purple-50 to-pink-50',

        requirements: [
            'Prepare dataset in four folders: good_train, bad_train, good_test, bad_test',
            'Each folder should contain 30 images',
            'Folder name should be same as project name (lowercase, no spaces)'
        ]
    },
    {
        id: 'Classification',
        title: 'Classification',
        description: 'Perform classification tasks with your custom data',
        icon: MdCategory,
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'from-green-50 to-teal-50',

        requirements: [
            'Train and Visualize Metrics',
            'Monitor training progress in real-time',
            'Evaluate on Saved Images & Camera'
        ]
    },
    {
        id: 'textextraction',
        title: 'Text Extraction',
        description: 'Extract text from images using OCR technology',
        icon: MdTextFields,
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'from-orange-50 to-red-50',

        requirements: [
            'Add labeled data with images and corresponding text labels',
            'Train the Detector and the Recognizer',
            'Test on images with options to alter settings'
        ]
    }
];



const NewProjects = ({openCreateModal}) => {
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
                                    {/* <img 
                                                    src={project.image} 
                                                    alt={project.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                /> */}
                                    <div className="absolute top-4 right-4">
                                        <div className={`w-12 h-12 bg-gradient-to-br ${project.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
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
                                            Requirements
                                        </h4>
                                        <ul className="space-y-2">
                                            {project.requirements.map((req, idx) => (
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