import logo from './logo.svg';

import './App.css';

import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import store from "./reduxToolkit/store.js"
import { ToastContainer, Slide } from 'react-toastify';
import Login from './componet/Auth/Login';
import Forgot from './componet/Auth/Forgot';
import ResetPassword from './componet/Auth/ResetPassword';
import LoginVerification from './componet/Auth/LoginVerification';

import MyAccout from './componet/Account/MyAccout';
import ChangePassword from './componet/Account/ChangePassword';
import Support from './componet/Support/Support';
import Project from './componet/Project/Project';

const Dashboard = lazy(() => import('./componet/Dashboard/Dashboard'));
const ProjectManagement = lazy(() => import('./componet/ProjectManagement/ProjectManagement'));
const DefectDetectionTraining = lazy(() => import('./componet/DefectDetection/Training/TrainingMain'));
const ObjectDetectionTraining = lazy(() => import('./componet/ObjectDetection/Training/TrainingMain'));
const ClassificationTraining = lazy(() => import('./componet/Classification/ClassificationTraining'));

function App() {
  return (
    <Provider store={store}>
      <div className="App">

        <ToastContainer
          transition={Slide}
        />

        <BrowserRouter  >
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center h-screen">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                <p className="mt-3 text-gray-600">Loading...</p>
              </div>
            }
          >
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/login-forgot' element={<Forgot />} />
              <Route path='/userResetPassword' element={<ResetPassword />} />
              <Route path='/loginVerification' element={<LoginVerification />} />
              <Route path='/loginSuccess' element={<LoginVerification />} />

              <Route path='/projects' element={<Project />} />
              <Route path='/dashboard' element={<Dashboard />} />
              {/* training routes */}
              <Route path='/object-detection-training' element={<ObjectDetectionTraining />} />
              <Route path='/classification-training' element={<ClassificationTraining />} />
              <Route path='/defect-detection-training' element={<DefectDetectionTraining />} />
              {/* ------ */}

              <Route path='/project-management' element={<ProjectManagement />} />
              <Route path='/my-account' element={<MyAccout />} />
              <Route path='/change-password' element={<ChangePassword />} />

              <Route path='/support' element={<Support />} />

            </Routes>
          </Suspense>
        </BrowserRouter>

      </div>
    </Provider>
  );
}

export default App;

