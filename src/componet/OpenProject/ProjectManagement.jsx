import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { commomObj, handledate } from '../../utils';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom'
import Sidenav from '../../commonComponent/Sidenav'
import Header from '../../commonComponent/Header'
import { projectList } from '../../reduxToolkit/Slices/openSlices';
import Loader from "../../commonComponent/Loader"
import { Commonpagination } from '../../commonComponent/Pagination';
import OpenProjectModal from './OpenProjectModal';

const initialState = {
    startdate: "",
    enddate: "",
    search: "",
    timeFrame: "",
    openModal:false,
    projectName:"",
    projectId:"",
    model:"",
}

function ProjectManagement() {
    const dispatch = useDispatch();
    const [disable, setDisable] = useState(false)
    const { projectData, loader } = useSelector((state) => state.openProject)
    console.log(projectData, "projectData")
    const [currentpage, setCurrentpage] = useState(1);   // for pagination
    const [serialNo, setSerialNo] = useState(10);
    const [istate, setIstate] = useState(initialState);
    const { startdate, enddate, search, timeFrame,openModal,projectName,projectId,model} = istate

//===================================useEffect================================================================
    useEffect(() => {
        dispatch(projectList({
            model:"",
            page: "",
            startdate: "",
            enddate: "",
            search: "",
            timeFrame: "",

        }))
    }, [])
     //..............................pagination.......................................................
    const Pagehandler = (pageNumber) => {
        let ser = pageNumber * 10;
        setSerialNo(ser);
        setCurrentpage(pageNumber);
        const data = {
            model:"",
            page: pageNumber,
            startdate: "",
            enddate: "",
            search: "",
            timeFrame: ""
        }
        dispatch(projectList(data));

    };
//==========================================refreshHandler==================================================
    const refreshandler = () => {
        setIstate({ ...istate, startdate: "", enddate: "", search: "", timeFrame: "", })
        dispatch(projectList({
            model:"",
            page: currentpage,
            startdate: "",
            enddate: "",
            search: "",
            timeFrame: "",
        }))
    }
   //=============================search handler============================================================
    const addinputhandler = (e) => {
        const { name, value } = e.target
        setIstate({ ...istate, [name]: value })
    }
    const applyhandler = async () => {
        if (startdate.trim() == '' && enddate.trim() == '' && search.trim() == '' && timeFrame.trim() == '') {
            toast.error("Please select the value", commomObj);
        }
        if (startdate.trim() == '' && enddate.trim() != '' && !search && !timeFrame) {
            toast.error("Please select the start date", commomObj);
        }
        if (startdate.trim() != '' && enddate.trim() == '' && !search && !timeFrame) {
            toast.error("Please select the end date", commomObj);
        }
        if (startdate && enddate || search || timeFrame) {
            const newstartdate = new Date(startdate)
            const newenddate = new Date(enddate)
            if (newstartdate.getTime() >= newenddate.getTime()) {
                toast.error("End date must be greater than start date", commomObj);
            } else {
                setDisable(true)
                const data = {
                    page: "",
                    startdate: startdate,
                    enddate: enddate,
                    search: search.trim(),
                    timeFrame,
                }
                console.log(data, 'DATAAAAAAAA')
                const res = await dispatch(projectList(data))
                if (res?.payload?.code == 200) {
                    setDisable(false)
                }
                else {
                    setDisable(false)
                }
            }

        }
    }
    //======================================open project modal===========================================
    const openUpdateModal = (projectname,id,model) => {
        console.log('clicked>>>>',projectname,id,model)
        setIstate({ ...istate, openModal:true,projectName:projectname,projectId:id,model:model })
    }
    return (
        <div>
            <Sidenav />
            <Header />
            <div className="WrapperArea">
                <div className="WrapperBox">
                    <div className="Small-Wrapper">
                        <div className="TitleBox">
                        </div>
                        <div className="Filter">
                            <div className="form-group">
                                <label>Search</label>
                                <input type="search"
                                    className="form-control"
                                    placeholder="Enter id or project name"
                                    name='search'
                                    value={search}
                                    onChange={addinputhandler}
                                    disabled={startdate || enddate || timeFrame}
                                />
                            </div>
                            <div className="form-group">
                                <label>From Date</label>
                                <input type="date" className="form-control"
                                    name='startdate'
                                    value={startdate}
                                    onChange={addinputhandler}
                                    disabled={search || timeFrame}
                                />
                            </div>
                            <div className="form-group">
                                <label>To Date</label>
                                <input type="date" className="form-control"
                                    name='enddate'
                                    value={enddate}
                                    onChange={addinputhandler}
                                    min={startdate}
                                    disabled={search || timeFrame}
                                />
                            </div>
                            <div className="form-group">
                                <label>Select From</label>
                                <select className="form-control"
                                    name='timeFrame'
                                    value={timeFrame}
                                    onChange={addinputhandler}
                                    disabled={startdate || enddate || search}
                                >
                                    <option value="">Select </option>
                                    <option value="Today">Today</option>
                                    <option value="Week">This Week</option>
                                    <option value="Month">This Month</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>&nbsp;</label>
                                <button className="Button mr-2"
                                    disabled={disable} onClick={applyhandler}
                                >Apply</button>
                                <button className="Button Cancel"
                                    disabled={disable} onClick={refreshandler}
                                >
                                    <i className="fa fa-refresh" />
                                </button>
                                {"  "}
                            </div>
                        </div>
                        <div className="TableList">
                            <table style={{ width: "100%" }}>
                                <thead>
                                    <tr>
                                        <th>Sr.No.</th>
                                        <th>Project Id</th>
                                        <th>Project Name</th>
                                        <th>Model Name</th>
                                        <th>Date of Creation</th>
                                        <th>Status</th>
                                        <th>Date of Closure</th>
                                        <th>User Id</th>
                                        <th>User Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!loader ?
                                        projectData?.result?.[0]?.paginationData?.length > 0 ? (
                                            projectData?.result?.[0]?.paginationData?.map((item, i) => {
                                                return (
                                                    <tr>
                                                        <td>{i + 1 + serialNo - 10}</td>
                                                        <td>
                                                            <Link>{item?.project_number}</Link>
                                                        </td>
                                                        <td>{item?.name}</td>
                                                        <td>{item?.model}</td>
                                                        <td>{handledate(item?.createdAt)}</td>
                                                        <td>
                                                            <span className={item?.projectStatus == "OPEN" ? "Green" : "Red"}>{item?.projectStatus}</span>
                                                        </td>
                                                        <td>{handledate(item?.updatedAt)}</td>
                                                        <td>
                                                            <a >{item?.userData?.user_number}</a>
                                                        </td>
                                                        <td>{item?.userData?.name}</td>
                                                        <td>
                                                            <a
                                                                className="Button"
                                                                title="Update Status"
                                                                onClick={() => openUpdateModal(item?.name,item?._id,item?.model)}
                                                            >
                                                                Open Project
                                                            </a>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="12">
                                                    <p><b>No Data found.</b></p>
                                                </td>
                                            </tr>
                                        ) : <Loader></Loader>}
                                </tbody>
                            </table>
                        </div>
                        <div className="pagination">
                            <ul>
                                {projectData?.result?.[0]?.totalCount?.[0]?.count > 0 && (
                                    <Commonpagination
                                        ActivePage={currentpage}
                                        ItemsCountPerPage={10}
                                        TotalItemsCount={projectData?.result?.[0]?.totalCount?.[0]?.count}
                                        PageRangeDisplayed={5}
                                        Onchange={Pagehandler}
                                    />
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <OpenProjectModal
            istate={istate}
            setIstate={setIstate}
            />
        </div>
    )
}

export default ProjectManagement
