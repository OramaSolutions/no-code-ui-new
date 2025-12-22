import axios from "axios";
import axiosInstance from "./axiosInstance";
import { Url } from "../config/config";



export const userLogin = (payload) => {
  return axiosInstance.post(`${Url}user/userLogin`, payload);
};

export const userSignup = (payload) => {
  return axios.post(`${Url}user/userSignup`, payload);
};





export const SetPassword = ({ token, password }) => {
  return axiosInstance.put(`user/setPassword?token=${token}`, { password });
};


export const changePassword = (payload) => {

  return axiosInstance.put(`user/changePassword`, payload);
};


export const updateProfile = (payload) => {

  return axiosInstance.post(`user/editProfile`, payload);
};


export const viewProfile = () => {

  return axiosInstance.get(`user/viewProfile`);
};


export const logoutUser = () => {
  return axiosInstance.get(`user/logout`)
}