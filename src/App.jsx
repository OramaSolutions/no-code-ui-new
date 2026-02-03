// App.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import store from "./reduxToolkit/store.js";

import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

// ---------- Lazy loaded pages ----------

// Public / auth
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./componet/Auth/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const SetPasswordPage = lazy(() => import("./pages/SetPassword"));
const Forgot = lazy(() => import("./componet/Auth/Forgot"));
const ResetPassword = lazy(() => import("./componet/Auth/ResetPassword"));
const LoginVerification = lazy(() =>
  import("./componet/Auth/LoginVerification")
);

// Protected
const Dashboard = lazy(() => import("./componet/Dashboard/Dashboard"));
const Project = lazy(() => import("./componet/Project/Project"));
const ProjectManagement = lazy(() =>
  import("./componet/ProjectManagement/ProjectManagement")
);
const DefectDetectionTraining = lazy(() =>
  import("./componet/DefectDetection/DDMain/TrainingMain.js")
);
const ObjectDetectionTraining = lazy(() =>
  import("./componet/ObjectDetection/ODMain/TrainingMain.js")
);
const ClassificationTraining = lazy(() =>
  import("./componet/Classification/Training/TrainingMain")
);
const MyAccout = lazy(() => import("./componet/Account/MyAccout"));
const ChangePassword = lazy(() =>
  import("./componet/Account/ChangePassword")
);
const Support = lazy(() => import("./componet/Support/Support"));

const ProjectOverview = lazy(() =>
  import("./label/ProjectOverview.jsx")
);
const LabelComponent = lazy(() =>
  import("./label/lableView/LabelView.jsx")
);
const SegmentComponent = lazy(() =>
  import('./label/segmentView/SegmentView.jsx')
)

import AuthBootstrap from "./AuthBootstrap.jsx";
import RequireAuth from "./RequireAuth.jsx";

// ---------- Query client ----------

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ---------- App ----------

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthBootstrap>
          <div className="App">
            <ToastContainer transition={Slide} />

            <BrowserRouter>
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center h-screen">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin" />
                    <p className="mt-3 text-gray-600">Loading...</p>
                  </div>
                }
              >
                <Routes>
                  {/* Public / marketing */}
                  <Route path="/" element={<LandingPage />} />

                  {/* Auth routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/set-password" element={<SetPasswordPage />} />
                  <Route path="/login-forgot" element={<Forgot />} />
                  <Route path="/userResetPassword" element={<ResetPassword />} />
                  <Route
                    path="/loginVerification"
                    element={<LoginVerification />}
                  />
                  <Route path="/loginSuccess" element={<LoginVerification />} />

                  {/* Protected app routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <RequireAuth>
                        <Dashboard />
                      </RequireAuth>
                    }
                  />

                  <Route
                    path="/projects"
                    element={
                      <RequireAuth>
                        <Project />
                      </RequireAuth>
                    }
                  />

                  <Route
                    path="/project-management"
                    element={
                      <RequireAuth>
                        <ProjectManagement />
                      </RequireAuth>
                    }
                  />

                  {/* Training routes */}
                  {/* <Route
                    path="/object-detection-training"
                    element={
                      <RequireAuth>
                        <ObjectDetectionTraining />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/classification-training"
                    element={
                      <RequireAuth>
                        <ClassificationTraining />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/defect-detection-training"
                    element={
                      <RequireAuth>
                        <DefectDetectionTraining />
                      </RequireAuth>
                    }
                  /> */}

                  <Route
                    path="/object-detection-training/:projectId/:projectName/:version"
                    element={
                      <RequireAuth>
                        <ObjectDetectionTraining />
                      </RequireAuth>
                    }
                  />

                  <Route
                    path="/classification-training/:projectId/:projectName/:version"
                    element={
                      <RequireAuth>
                        <ClassificationTraining />
                      </RequireAuth>
                    }
                  />

                  <Route
                    path="/defect-detection-training/:projectId/:projectName/:version"
                    element={
                      <RequireAuth>
                        <DefectDetectionTraining />
                      </RequireAuth>
                    }
                  />

                  {/* labeling routes  */}
                  <Route
                    path="dataset-overview/:backLink/:projectId/:projectName/:version"
                    element={
                      <RequireAuth>
                        <ProjectOverview />
                      </RequireAuth>
                    }
                  />
                  {/* navigate(
                        `dataset-overview/${backLink}/${state.projectId}/${state.name}/${state.version}`
                    )} */}

                  <Route
                    path="/image-label/:backLink/:projectId/:projectName/:version/image/:imageId"
                    element={
                      <RequireAuth>
                        <LabelComponent />
                      </RequireAuth>
                    }
                  />

                  <Route
                    path="/image-segment/:backLink/:projectId/:projectName/:version/image/:imageId"
                    element={
                      <RequireAuth>
                        <SegmentComponent />
                      </RequireAuth>
                    }
                  />



                  {/* Account / support */}
                  <Route
                    path="/my-account"
                    element={
                      <RequireAuth>
                        <MyAccout />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/change-password"
                    element={
                      <RequireAuth>
                        <ChangePassword />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/support"
                    element={
                      <RequireAuth>
                        <Support />
                      </RequireAuth>
                    }
                  />

                  {/* Catch-all */}
                  {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
                </Routes>
              </Suspense>
            </BrowserRouter>
          </div>
        </AuthBootstrap>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
