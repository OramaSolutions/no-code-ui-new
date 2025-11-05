import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { commomObj, handledate } from '../../utils';
import { projectList } from '../../reduxToolkit/Slices/openSlices';
import DashboardLayout from '../../commonComponent/DashboardLayout';
import { MdFolderOpen } from 'react-icons/md';
import FilterSection from './FilterSection';
import ProjectTable from './ProjectTable';
import Pagination from './Pagination';
import OpenProjectModal from './OpenProjectModal';
import { Commonpagination } from '../../commonComponent/Pagination';
const initialState = {
    startdate: '',
    enddate: '',
    search: '',
    timeFrame: '',
    openModal: false,
    projectName: '',
    projectId: '',
    model: '',
};

function ProjectManagement() {
    const dispatch = useDispatch();
    const [disable, setDisable] = useState(false);
    const { projectData, loader } = useSelector((state) => state.openProject);
    // console.log(projectData?.result?.[0], '<<<<<projectData');
    const [currentpage, setCurrentpage] = useState(1);
    const [serialNo, setSerialNo] = useState(10);
    const [istate, setIstate] = useState(initialState);
    const { startdate, enddate, search, timeFrame, openModal, projectName, projectId, model } = istate;

    useEffect(() => {
        dispatch(
            projectList({
                model: '',
                page: '',
                startdate: '',
                enddate: '',
                search: '',
                timeFrame: '',
            })
        );
    }, []);

    // The API may return total count under `count` or `total` key inside totalCount[0].
    // Use `serialNo` (page size) state so changing page size will reflect here.
    const totalCountValue =
        projectData?.result?.[0]?.totalCount?.[0]?.count ?? projectData?.result?.[0]?.totalCount?.[0]?.total ?? 0;
    const totalPages = totalCountValue ? Math.ceil(totalCountValue / (serialNo || 10)) : 0;

    // console.log('ProjectManagement totalPages:', totalPages, 'projectDataSample:', projectData?.result?.[0]);

    const Pagehandler = (pageNumber) => {
        setCurrentpage(pageNumber);
        const data = {
            model: '',
            page: pageNumber,
            startdate: startdate,      // Preserve filters
            enddate: enddate,          // Preserve filters
            search: search,            // Preserve filters
            timeFrame: timeFrame,      // Preserve filters
        };
        dispatch(projectList(data));
    };
    const refreshandler = () => {
        setIstate({
            ...istate,
            startdate: '',
            enddate: '',
            search: '',
            timeFrame: '',
        });
        dispatch(
            projectList({
                model: '',
                page: currentpage,
                startdate: '',
                enddate: '',
                search: '',
                timeFrame: '',
            })
        );
    };

    const addinputhandler = (e) => {
        const { name, value } = e.target;
        setIstate({ ...istate, [name]: value });
    };

    const applyhandler = async () => {
        if (startdate.trim() === '' && enddate.trim() === '' && search.trim() === '' && timeFrame.trim() === '') {
            toast.error('Please select the value', commomObj);
            return;
        }
        if (startdate.trim() === '' && enddate.trim() !== '' && !search && !timeFrame) {
            toast.error('Please select the start date', commomObj);
            return;
        }
        if (startdate.trim() !== '' && enddate.trim() === '' && !search && !timeFrame) {
            toast.error('Please select the end date', commomObj);
            return;
        }
        if (startdate && enddate) {
            const newstartdate = new Date(startdate);
            const newenddate = new Date(enddate);
            if (newstartdate.getTime() >= newenddate.getTime()) {
                toast.error('End date must be greater than start date', commomObj);
                return;
            }
        }
        if (startdate && enddate || search || timeFrame) {
            setDisable(true);
            setCurrentpage(1);
            const data = {
                page: 1,
                startdate: startdate,
                enddate: enddate,
                search: search.trim(),
                timeFrame,
            };
            const res = await dispatch(projectList(data));
            setDisable(false);
        }
    };

    const openUpdateModal = (projectname, id, modelType) => {
        setIstate({
            ...istate,
            openModal: true,
            projectName: projectname,
            projectId: id,
            model: modelType,
        });
    };

    return (
        <>
            <DashboardLayout pageTitle='Project Management' pageDescription='Manage and view all your projects'>
                {/* Main container with proper overflow control */}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    
                >
                    {/* Page Header */}
                    {/* <div className="flex items-center gap-3 mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg"
                        >
                            <MdFolderOpen className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Project Management</h2>
                            <p className="text-sm text-slate-600">Manage and view all your projects</p>
                        </div>
                    </div> */}

                    {/* Filter Section */}
                    <FilterSection
                        startdate={startdate}
                        enddate={enddate}
                        search={search}
                        timeFrame={timeFrame}
                        addinputhandler={addinputhandler}
                        applyhandler={applyhandler}
                        refreshandler={refreshandler}
                        disable={disable}
                    />

                    {/* Project Table */}
                    <ProjectTable
                        projectData={projectData?.result?.[0]?.paginationData}
                        loader={loader}
                        currentpage={currentpage}
                        openUpdateModal={openUpdateModal}
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentpage}
                            totalPages={totalPages}
                            onPageChange={Pagehandler}
                        />
                    )}
                </motion.div>


                <OpenProjectModal
                    openModal={openModal}
                    setIstate={setIstate}
                    istate={istate}
                    projectName={projectName}
                    projectId={projectId}
                    model={model}
                />
            </DashboardLayout>
        </>
    );
}

export default ProjectManagement;
