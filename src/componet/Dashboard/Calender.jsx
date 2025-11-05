import React, { useState } from "react";
import { motion } from "framer-motion";

const CalendarComponent = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const generateDaysForCurrentWeek = () => {
        const days = [];
        const today = currentDate.getDate();
        const currentDayOfWeek = currentDate.getDay();
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(today - currentDayOfWeek);

        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            days.push({
                day: day.getDate(),
                isToday: day.toDateString() === new Date().toDateString(),
                dayOfWeek: day.getDay(),
                fullDate: day,
            });
        }
        return days;
    };

    const days = generateDaysForCurrentWeek();
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-md font-semibold text-gray-900">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">This Week</p>
                </div>
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03, duration: 0.2 }}
                        whileHover={{ scale: day.isToday ? 1 : 1.1 }}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                            day.isToday
                                ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md scale-105'
                                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                    >
                        <span className={`text-xs font-medium mb-1 ${day.isToday ? 'text-blue-100' : 'text-gray-500'}`}>
                            {dayNames[day.dayOfWeek]}
                        </span>
                        <span className={`text-base font-bold ${day.isToday ? 'text-white' : 'text-gray-900'}`}>
                            {day.day}
                        </span>
                        {day.isToday && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring" }}
                                className="w-1 h-1 bg-white rounded-full mt-1"
                            />
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CalendarComponent;
