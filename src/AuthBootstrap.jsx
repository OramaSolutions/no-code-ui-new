import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuth, logout, authResolved } from "./reduxToolkit/Slices/authSlices";
import { fetchUserDetails } from "./api/dashboardApi";
import axiosInstance from "./api/axiosInstance";

export default function AuthBootstrap({ children }) {
    const dispatch = useDispatch();

    useEffect(() => {
        const initAuth = async () => {
            try {
                // 1️⃣ Try refresh first
                await axiosInstance.post("/user/refresh");

                // 2️⃣ If refresh succeeds, fetch user
                const res = await fetchUserDetails();
                dispatch(setAuth({ user: res.data.user }));
            } catch {
                // 3️⃣ Refresh failed → user truly logged out
                dispatch(authResolved());
            
            }
        };

        initAuth();
    }, [dispatch]);

    return children;
}
