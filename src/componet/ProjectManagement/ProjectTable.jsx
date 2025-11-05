import React from 'react';
import { motion } from 'framer-motion';
import { MdOpenInNew, MdDateRange } from 'react-icons/md';
import { handledate } from '../../utils';

function ProjectTable({ projectData, loader, currentpage, openUpdateModal }) {
    if (loader) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto"
                />
                <p className="text-slate-600 mt-4">Loading projects...</p>
            </div>
        );
    }

    if (!projectData?.length) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MdOpenInNew className="w-10 h-10 text-slate-400" />
                </div>
                <p className="text-xl font-semibold text-slate-800">No Projects Found</p>
                <p className="text-sm text-slate-600 mt-2">Try adjusting your filters</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden w-"
        >
            {/* Table wrapper with horizontal scroll ONLY inside table */}
            <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                <table className="w-full min-w-[1100px]">
                    <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-slate-200 sticky top-0 z-10">
                        <tr>
                            <th className="px-2 py-1 text-left text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                #
                            </th>
                            <th className="px-2 py-1 text-left text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                Project ID
                            </th>
                            <th className="px-2 py-1 text-left text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                Project Name
                            </th>
                            <th className="px-2 py-1 text-left text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                Model
                            </th>
                            <th className="px-2 py-1 text-left text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                Created
                            </th>
                            <th className="px-2 py-1 text-left text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                Status
                            </th>
                            <th className="px-2 py-1 text-left text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                Updated
                            </th>
                            <th className="px-2 py-1 text-left text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                Owner
                            </th>
                            {/* <th className="px-2 py-1 text-center text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                Action
                            </th> */}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {projectData?.map((item, i) => (
                            <motion.tr
                                key={item._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ backgroundColor: '#f8fafc' }}
                                className="transition-colors"
                            >
                                {/* Serial Number */}
                                <td className="px-2 py-1 text-sm font-semibold text-slate-500 whitespace-nowrap">
                                    {(currentpage - 1) * 10 + i + 1}
                                </td>

                                {/* Project ID */}
                                <td className="px-2 py-1 whitespace-nowrap">
                                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md inline-block">
                                        {item?.project_number}
                                    </span>
                                </td>

                                {/* Project Name */}
                                {/* <td className="px-2 py-1 max-w-xs">
                                    <div className="text-sm font-semibold text-slate-900 truncate" title={item?.name}>
                                        {item?.name}
                                    </div>
                                </td> */}

                                <td className="px-2 py-1 max-w-xs">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => openUpdateModal(item?.name, item?._id, item?.model)}
                                        className=" text-sm font-semibold cursor-pointer flex items-center justify-center gap-1.5"
                                    >
                                        <MdOpenInNew className="w-3.5 h-3.5" />
                                        {item?.name}
                                    </motion.button>
                                </td>

                                {/* Model */}
                                <td className="px-2 py-1 whitespace-nowrap">
                                    <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md inline-block capitalize">
                                        {item?.model}
                                    </span>
                                </td>

                                {/* Created Date */}
                                <td className="px-2 py-1 whitespace-nowrap">
                                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                        <MdDateRange className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                        <span className="text-xs">{handledate(item?.createdAt)}</span>
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="px-2 py-1 whitespace-nowrap">
                                    <span
                                        className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${item?.projectStatus === 'OPEN'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-amber-100 text-amber-700'
                                            }`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${item?.projectStatus === 'OPEN' ? 'bg-green-500' : 'bg-amber-500'
                                            }`}></span>
                                        {item?.projectStatus}
                                    </span>
                                </td>

                                {/* Updated Date */}
                                <td className="px-2 py-1 whitespace-nowrap">
                                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                        <MdDateRange className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                        <span className="text-xs">{handledate(item?.updatedAt)}</span>
                                    </div>
                                </td>

                                {/* Owner */}
                                <td className="px-2 py-1 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                            {item?.userData?.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <span className="text-sm text-slate-900 max-w-[120px] truncate" title={item?.userData?.name}>
                                            {item?.userData?.name}
                                        </span>
                                    </div>
                                </td>

                                {/* Action */}
                                {/* <td className="px-2 py-1 whitespace-nowrap">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => openUpdateModal(item?.name, item?._id, item?.model)}
                                        className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5"
                                    >
                                        <MdOpenInNew className="w-3.5 h-3.5" />
                                        Open
                                    </motion.button>
                                </td> */}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Scroll indicator */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-4 py-2 border-t border-slate-200">
                <p className="text-xs text-slate-500 text-center flex items-center justify-center gap-1">
                    <span>←</span>
                    <span>Scroll horizontally to view all columns</span>
                    <span>→</span>
                </p>
            </div>
        </motion.div>
    );
}

export default ProjectTable;
