import axiosInstance from "./axiosInstance";

// ✅ Project List
export const fetchProjectList = (payload) => {
  return axiosInstance.get(
    `/user/myProjectList?model=${payload.model ?? ""}&page=${payload.page ?? 1}&startDate=${payload.startDate ?? ""}&endDate=${payload.endDate ?? ""}&search=${payload.search ?? ""}&timeframe=${payload.timeframe ?? ""}`
  );
};
// ✅ Version List
export const fetchVersionList = (payload) => {
  console.log('calling version api')
  return axiosInstance.get(
    `/user/versionDropDown?name=${payload.projectName}`
  );
};

// ✅ Open Project
export const openProjectApi = (payload) => {
  return axiosInstance.post(`/user/getProjectForOpen`, payload);
};
