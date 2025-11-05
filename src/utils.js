import { Bounce } from "react-toastify";
import axios from 'axios';


export function isLoggedIn(userType) {
  let session = getObject(userType) || {};
  session = Object.keys(session).length && JSON.parse(session)
  let accessToken = (session?.token) || "";
  return accessToken;
}


export function getObject(key) {
  if (window && window.localStorage) {
    return window.localStorage.getItem(key);
  }
}
//=============================================toast object=========================================================
export const commomObj = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
}
//========================================date handler====================================================================
export const handledate = (str) => {
  let data = str?.split("T");
  if (data) {
    let dataa = data[0].split("-")
    return `${dataa[2]}-${dataa[1]}-${dataa[0]}`
  } else {
    return ""
  }
}
//==================================================for images filtering=============================================
export const detectMimeType = (binaryString) => {
  // Example detection based on file signatures (magic numbers)
  const signatures = {
    '89504E47': 'image/png',   // PNG signature
    '47494638': 'image/gif',   // GIF signature
    'FFD8FF': 'image/jpeg',    // JPEG signature
  };

  const hex = binaryString.substring(0, 4).toUpperCase();
  return signatures[hex] || 'application/octet-stream'; // Default type
};
//===================================api cancel functionality==============================================================

export const makeCancelableRequest = async (apiCall, payload, rejectWithValue, signal) => {
  try {
    const response = await apiCall(payload, signal);
    if (response.status === 200) {
      return response.data;
    } else {
      return rejectWithValue(response.data);
    }
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log('Request canceled:', err.message);
      return rejectWithValue({ message: 'Request canceled' });
    } else {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
};
