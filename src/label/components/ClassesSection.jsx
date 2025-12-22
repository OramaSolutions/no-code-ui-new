import React from 'react'
import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiSave,
    FiX,

    FiTag,


} from "react-icons/fi";
const ClassesSection = ({ 
    newClassName,
    setNewClassName,
    handleAddClass,
    classes,
    editingClass,
    editClassValue,
    setEditClassValue,
    setEditingClass,
    handleEditClass,
    handleDeleteClass
}) => {
    return (
        <div className="w-full flex flex-row justify-evenly">
            {/* Classes Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center mb-6">
                    <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                        <FiTag className="text-indigo-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Classes</h2>
                </div>

                {/* Add New Class */}
                <div className="flex mb-6">
                    <input
                        type="text"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        placeholder="New class name (comma separated for multiple)"
                        className="flex-1 p-3 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                        onKeyPress={(e) => e.key === "Enter" && handleAddClass()}
                    />
                    <button
                        onClick={handleAddClass}
                        className="px-4 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition flex items-center justify-center"
                    >
                        <FiPlus size={18} />
                    </button>
                </div>

                {/* Classes List */}
                {classes.length === 0 ? (
                    <div className="text-center py-6 text-gray-400">
                        No classes defined yet
                    </div>
                ) : (
                    <ul className="space-y-1 max-h-[250px] overflow-y-auto pr-2">
                        {classes.map((cls, index) => (
                            <li
                                key={cls.index}
                                className="group flex justify-between px-2 items-center border border-gray-100 rounded-lg hover:bg-gray-50 transition"
                            >
                                {editingClass === index ? (
                                    <div className="flex flex-1">
                                        <input
                                            type="text"
                                            value={editClassValue}
                                            onChange={(e) => setEditClassValue(e.target.value)}
                                            className="flex-1 p-2 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                                            onKeyPress={(e) =>
                                                e.key === "Enter" && handleEditClass(index)
                                            }
                                        />
                                        <button
                                            onClick={() => handleEditClass(cls.id)}
                                            className="px-3 bg-emerald-500 text-white hover:bg-emerald-600 transition flex items-center"
                                        >
                                            <FiSave size={16} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingClass(null);
                                                setEditClassValue("");
                                            }}
                                            className="px-3 bg-gray-200 text-gray-700 hover:bg-gray-300 transition flex items-center"
                                        >
                                            <FiX size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center">
                                            <span
                                                className="w-3 h-3 rounded-full mr-3"
                                                style={{ backgroundColor: cls.color || "#6b7280" }}
                                            ></span>
                                            <span className="font-medium text-gray-700">
                                                {cls.name}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                                            <button
                                                onClick={() => {
                                                    setEditingClass(index);
                                                    setEditClassValue(cls.name);
                                                }}
                                                className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                                            >
                                                <FiEdit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClass(cls.id)}
                                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {/* More image uploads */}

        </div>
    )
}

export default ClassesSection