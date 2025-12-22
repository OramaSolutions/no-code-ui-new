import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { commomObj } from '../../utils';
import { useQuery } from "@tanstack/react-query";

import { fetchProjectList } from "../../api/projectApi";
import DashboardLayout from '../../commonComponent/DashboardLayout';
import FilterSection from './FilterSection';
import ProjectTable from './ProjectTable';
import Pagination from './Pagination';
import OpenProjectModal from './OpenProjectModal';

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

    const [disable, setDisable] = useState(false);
    const [currentpage, setCurrentpage] = useState(1);
    const [serialNo] = useState(10);

    const [istate, setIstate] = useState(initialState);
    const { startdate, enddate, search, timeFrame, openModal, projectName, projectId, model } = istate;

    // -------------------------
    // FETCH PROJECT LIST (React Query)
    // -------------------------
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["projectList", currentpage, startdate, enddate, search, timeFrame, model],

        queryFn: () =>
            fetchProjectList({
                model: model ?? "",
                page: currentpage ?? 1,
                startDate: startdate ?? "",
                endDate: enddate ?? "",
                search: search ?? "",
                timeframe: timeFrame ?? "",
            }),

     

        keepPreviousData: true,
    });


    const projectData = data?.data; // backend response root
    const tableData = projectData?.result?.[0]?.paginationData || [];

    // -------------------------
    // TOTAL COUNT FOR PAGINATION
    // -------------------------
    const totalCountValue =
        projectData?.result?.[0]?.totalCount?.[0]?.count ??
        projectData?.result?.[0]?.totalCount?.[0]?.total ??
        0;

    const totalPages = totalCountValue ? Math.ceil(totalCountValue / serialNo) : 0;

    // -------------------------
    // HANDLERS
    // -------------------------
    const Pagehandler = (pageNumber) => {
        setCurrentpage(pageNumber);
    };

    const refreshandler = () => {
        setIstate({
            ...istate,
            startdate: '',
            enddate: '',
            search: '',
            timeFrame: '',
        });

        setCurrentpage(1);
        refetch();
    };

    const addinputhandler = (e) => {
        const { name, value } = e.target;
        setIstate({ ...istate, [name]: value });
    };

    const applyhandler = async () => {
        if (!startdate && !enddate && !search && !timeFrame) {
            toast.error('Please select the value', commomObj);
            return;
        }

        if (!startdate && enddate && !search && !timeFrame) {
            toast.error('Please select the start date', commomObj);
            return;
        }

        if (startdate && !enddate && !search && !timeFrame) {
            toast.error('Please select the end date', commomObj);
            return;
        }

        if (startdate && enddate) {
            if (new Date(startdate).getTime() >= new Date(enddate).getTime()) {
                toast.error('End date must be greater than start date', commomObj);
                return;
            }
        }

        setDisable(true);

        // Reset page & refetch
        setCurrentpage(1);
        refetch();

        setDisable(false);
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

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >

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
                        projectData={tableData}
                        loader={isLoading}
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
