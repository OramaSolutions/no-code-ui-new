import React from 'react';
import { motion } from 'framer-motion';
import { MdSearch, MdRefresh, MdFilterList } from 'react-icons/md';

function FilterSection({ startdate, enddate, search, timeFrame, addinputhandler, applyhandler, refreshandler, disable }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 mb-4"
        >
            <div className="flex items-center gap-2 mb-2">
                <MdFilterList className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-800">Filters</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Search Project</label>
                    <div className="relative">
                        <MdSearch className="absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            name="search"
                            value={search}
                            onChange={addinputhandler}
                            placeholder="Search by name..."
                            className="w-full pl-6 pr-2 py-1 bg-white border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        />
                    </div>
                </div>

                {/* Start Date */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date</label>
                    <input
                        type="date"
                        name="startdate"
                        value={startdate}
                        onChange={addinputhandler}
                        className="w-full px-2 py-1 bg-white border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                </div>

                {/* End Date */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">End Date</label>
                    <input
                        type="date"
                        name="enddate"
                        value={enddate}
                        onChange={addinputhandler}
                        className="w-full px-2 py-1 bg-white border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                </div>

                {/* Time Frame */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Time Frame</label>
                    <select
                        name="timeFrame"
                        value={timeFrame}
                        onChange={addinputhandler}
                        className="w-full px-2 py-1 bg-white border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    >
                        <option value="">Select timeframe</option>
                        <option value="Today">Today</option>
                        <option value="Week">This Week</option>
                        <option value="Month">This Month</option>
                        <option value="Year">This Year</option>
                    </select>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={applyhandler}
                    disabled={disable}
                    className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <MdSearch className="w-5 h-5" />
                    Apply Filters
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={refreshandler}
                    className="px-3 py-2 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors shadow-md flex items-center gap-2"
                >
                    <MdRefresh className="w-5 h-5" />
                    Reset
                </motion.button>
            </div>
        </motion.div>
    );
}

export default FilterSection;
