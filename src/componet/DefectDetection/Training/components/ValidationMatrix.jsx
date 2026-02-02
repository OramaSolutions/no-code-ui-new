import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdTableChart } from 'react-icons/md';
import Loader from '../../../../commonComponent/Loader';



function ValidationMatrix({ task,  fetchAllowed, rows, status, fetchData }) {
    const tableRef = useRef(null);

    useEffect(() => {
        if (tableRef.current) {
            tableRef.current.scrollTop = tableRef.current.scrollHeight;
        }
    }, [rows]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden"
        >
            <div className="bg-gradient-to-r from-slate-50 to-purple-50 px-4 py-3 border-b-2 border-slate-200 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <MdTableChart className="w-5 h-5 text-indigo-600" />
                    Matrix
                </h3>
                { fetchAllowed &&
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={fetchData}
                        disabled={!fetchAllowed}
                        className="px-3 py-1 text-sm bg-indigo-600  text-white rounded-lg font-medium transition-colors"
                    >
                        Fetch Data
                    </motion.button>
                }
            </div>

            {status.loadingMatrix && <div className="px-4 py-2 text-indigo-600 text-sm">Loading validation matrix...</div>}
            {status.errorMatrix && <div className="px-4 py-2 text-red-600 text-sm">{status.errorMatrix}</div>}

            <div ref={tableRef} className="max-h-[300px] overflow-y-auto">
                <table className="w-full">
                    <thead className="bg-slate-100 sticky top-0">
                        {task === 'classification' ? (
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Class</th>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Accuracy (%)</th>
                            </tr>
                        ) : (
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Class</th>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Precision (%)</th>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Recall (%)</th>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase">Accuracy (%)</th>
                            </tr>
                        )}
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {rows?.length > 0 ? (
                            rows.map((row, index) =>
                                task === 'classification' ? (
                                    <tr key={index} className="hover:bg-slate-50">
                                        <td className="px-4 py-2 text-sm text-slate-900">{row.Class}</td>
                                        <td className="px-4 py-2 text-sm text-slate-900">{row.Accuracy}%</td>
                                    </tr>
                                ) : (
                                    <tr key={index} className="hover:bg-slate-50">
                                        <td className="px-4 py-2 text-sm text-slate-900">{row.className}</td>
                                        <td className="px-4 py-2 text-sm text-slate-900">{row.precision}</td>
                                        <td className="px-4 py-2 text-sm text-slate-900">{row.recall}</td>
                                        <td className="px-4 py-2 text-sm text-slate-900">{row.accuracy}</td>
                                    </tr>
                                )
                            )
                        ) : (
                            <tr>
                                <td colSpan={task === 'objectdetection' ? 4 : 2} className="px-4 py-8 text-center">
                                    <Loader />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}

export default ValidationMatrix;
