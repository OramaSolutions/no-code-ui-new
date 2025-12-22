import axiosInstance from "./axiosInstance";

export const fetchDashboardList = async () => {
    return axiosInstance.get(`/user/myLatestProjectList`);
};


export const fetchUserDetails = async () => {
    return axiosInstance.get(`/user/me`);
}