import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdHourglassBottom, MdCheck, MdError, MdDownload, MdClose } from 'react-icons/md';

import axios from "axios";
import { isLoggedIn } from "../../utils";
import { useNavigate } from "react-router-dom";
import { Url as NodeUrl } from "../../config/config";
const POLLING_INTERVAL = 30000; // 30 seconds

import {
  startBuild,
  pollBuildStatus,
  getDownloadUrl
} from "../../api/applicationsApi";

const applications = [
  {
    id: 'assembly_verification_1',
    task: 'objectdetection',
    title: "Single Camera AI assembly verification System",
    description: "AI-powered object detection and assembly verification using a single camera vision system. Ensures precise assembly quality and reduces manual inspection effort.",
    image: "https://via.placeholder.com/400x250.png?text=Camera+Verification",
  },
];

const Application = ({ state, url, username, task, project, version }) => {
  const [selectedApp, setSelectedApp] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [buildStatus, setBuildStatus] = useState(null); // 'started', 'running', 'done', 'error'
  const [error, setError] = useState(null);
  const [buildResult, setBuildResult] = useState(null);
  const pollingRef = useRef(null);
  const projectId = state?.projectId;
  // Key in localStorage to store task info for this specific project

  // 1) Define a full shape for persisted build session
  const localStorageKey = `dockerBuild_${username}_${task}_${project}_${version}`;
  const navigate = useNavigate();



  const persistSession = (data) => {
    const now = Date.now();
    const base = {
      username,
      projectId,
      task,
      project,
      version,
    };
    localStorage.setItem(
      localStorageKey,
      JSON.stringify({ ...base, lastUpdated: now, ...data })
    );
  };

  const readSession = () => {
    const raw = localStorage.getItem(localStorageKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      localStorage.removeItem(localStorageKey);
      return null;
    }
  };

  const clearSession = () => {
    localStorage.removeItem(localStorageKey);
  };

  // 2) On mount: restore and resume polling strictly from persisted data
  useEffect(() => {
    const saved = readSession();
    if (saved) {
      setTaskId(saved.taskId || null);
      setBuildStatus(saved.status || null);
      setBuildResult(saved.result || null);
      // If we have a task that isn't done/error, resume polling
      if (saved.taskId && saved.status !== 'done' && saved.status !== 'error') {
        startPolling(saved.taskId, saved); // pass saved payload
      }
    }
    return () => stopPolling();

  }, []);

  // 3) startPolling now accepts the persisted payload so it never depends on volatile props
  const startPolling = (id, persisted) => {
    if (pollingRef.current) return;
    fetchStatus(id, persisted);
    pollingRef.current = setInterval(() => {
      fetchStatus(id, persisted);
    }, POLLING_INTERVAL);
  };
  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  // 4) fetchStatus strictly uses persisted identity data, not transient component state
  const fetchStatus = async (id, persistedOverride) => {
    const persisted = persistedOverride || readSession();
    if (!id || !persisted) {
      stopPolling(); // stop timer if context missing [web:46]
      clearSession();
      setTaskId(null);
      setBuildStatus(null);
      return;
    }

    try {
      const res = await pollBuildStatus(url, id, {
        username: persisted.username,
        projectId: persisted.projectId,
        task: persisted.task,
        name: persisted.project,
        version: persisted.version,
      });

      const { status, result, error: apiError } = res.data || {};

      // Accept only known statuses; otherwise treat as error
      if (status === 'done') {
        setBuildStatus('done');
        stopPolling(); // end polling on completion [web:46]
        setBuildResult(result);
        persistSession({ taskId: id, status: 'done', result });
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Docker Build Complete', {
            body: 'Your application is ready for download!',
            icon: '/favicon.ico',
          });
        }
        return;
      }

      if (status === 'running' || status === 'started') {
        setBuildStatus(status);
        persistSession({ taskId: id, status }); // keep session current [web:60]
        return;
      }

      // status === 'error' OR unexpected/invalid payloads
      const msg = apiError || 'Unexpected status from server';
      setBuildStatus('error');
      setError(msg);
      persistSession({ taskId: id, status: 'error', error: msg });
      stopPolling(); // stop on any error [web:46]
    } catch (err) {
      // Consolidated Axios error handling
      let msg = 'Request failed';
      if (err.response) {
        // Server responded with non-2xx
        msg = err.response.data?.message || `Server error: ${err.response.status}`; // show server message if present [web:60]
      } else if (err.request) {
        // Request made but no response (network/CORS/timeout)
        msg = 'Network error. Please check connection and try again.'; // user-friendly network error [web:56]
      } else {
        // Something else setting up request
        msg = err.message || 'Unexpected error occurred'; // generic fallback [web:60]
      }

      setBuildStatus('error');
      setError(msg);
      persistSession({ taskId: id, status: 'error', error: msg });
      stopPolling(); // ensure interval is cleared on errors [web:46]

      // Optional: special case for 404 task not found -> cleanup session
      if (err.response?.status === 404) {
        clearSession();
        setTaskId(null);
        setBuildStatus(null);
      }
    }
  };


  // 5) On build start: persist everything upfront
  const handleDownload = async (appTitle) => {
    if (!username || !task || !project || !version) {
      alert('Missing required project information');
      return;
    }

    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
    setError(null);

    try {

      const response = await startBuild({
        username,
        projectId,
        task,
        projectName: project,
        version,
        applicationId: selectedApp,
      });

      const { task_id } = response.data;
      setTaskId(task_id);
      setBuildStatus('started');

      // Persist full context immediately
      persistSession({
        taskId: task_id,
        status: 'started',
        result: null,
        error: null,
      });

      startPolling(task_id, readSession());
      alert(`Build started for ${appTitle}. This may take 20-30 minutes. You'll be notified when ready.`);
    } catch (err) {
      console.error('Error starting build:', err);
      setError(err.response?.data?.message || 'Failed to start build. Please try again.');
    }
  };

  // 6) Direct download should read from persisted result if state is empty
  const handleDirectDownload = async () => {
    const session = readSession();
    const _result = buildResult || session?.result;
    const _status = buildStatus || session?.status;

    if (_result?.zip_filename && _status === 'done') {
      const { data } = await getDownloadUrl(
        _result.zip_filename,
        {
          username: session?.username || username,
          task: session?.task || task,
          project: session?.project || project,
          version: session?.version || version,
          projectId: session?.projectId || projectId,
        }
      );
      const downloadUrl = `${url}${data.url}`;
      window.location.href = downloadUrl;
    } else {
      alert('Build is not ready to download yet.');
    }
  };

  // 7) Clear: wipe storage and state
  const clearBuildStatus = () => {
    clearSession();
    setTaskId(null);
    setBuildStatus(null);
    setError(null);
    setBuildResult(null);
    stopPolling();
  };


  const getStatusIcon = (buildStatus) => {
    switch (buildStatus) {
      case 'started':
      case 'running':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <MdHourglassBottom size={18} />
          </motion.div>
        );
      case 'done':
        return <MdCheck size={18} />;
      case 'error':
        return <MdError size={18} />;
      default:
        return <MdDownload size={18} />;
    }
  };

  const getStatusText = (buildStatus) => {
    switch (buildStatus) {
      case 'started':
        return 'Build Starting...';
      case 'running':
        return 'Building...';
      case 'done':
        return 'Ready to Download';
      case 'error':
        return 'Build Failed';
      default:
        return 'Download';
    }
  };

  const getButtonClass = (buildStatus) => {
    const baseClass = 'mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg ';

    switch (buildStatus) {
      case 'started':
      case 'running':
        return baseClass + 'bg-gradient-to-r from-amber-500 to-orange-500 text-white cursor-not-allowed opacity-75';
      case 'done':
        return baseClass + 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:shadow-xl';
      case 'error':
        return baseClass + 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 hover:shadow-xl';
      default:
        return baseClass + 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-6 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          Applications
        </h1>
        <p className="text-slate-600">Select an application to build and download</p>
      </motion.div>

      {/* Status Banner */}
      <AnimatePresence>
        {(buildStatus || error) && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="mb-8 max-w-3xl mx-auto"
          >
            {error ? (
              <div className="bg-white border-2 border-red-200 rounded-xl p-5 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-red-600">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <MdError size={22} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Build Error</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearBuildStatus}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <MdClose size={20} />
                  </motion.button>
                </div>
              </div>
            ) : buildStatus === 'done' ? (
              <div className="bg-white border-2 border-green-200 rounded-xl p-5 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-green-600">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center"
                    >
                      <MdCheck size={22} />
                    </motion.div>
                    <div>
                      <p className="font-bold text-sm">Build Complete!</p>
                      <p className="text-sm">Your application is ready for download</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearBuildStatus}
                    className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors"
                  >
                    <MdClose size={20} />
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="bg-white border-2 border-amber-200 rounded-xl p-5 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-amber-600">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        <MdHourglassBottom size={22} />
                      </motion.div>
                    </div>
                    <div>
                      <p className="font-bold text-sm">Build in Progress</p>
                      <p className="text-sm">This may take 20-30 minutes</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearBuildStatus}
                    className="text-amber-600 hover:bg-amber-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
                {/* Progress bar */}
                <div className="mt-4 h-2 bg-amber-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 30, ease: 'linear' }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {applications.map((app, index) => {
          const isSelected = selectedApp === app.id;
          return (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedApp(app.id)}
              className="cursor-pointer group"
            >
              <div
                className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 ${isSelected
                  ? 'ring-4 ring-blue-500 shadow-2xl'
                  : 'shadow-lg hover:shadow-2xl'
                  }`}
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                  <motion.img
                    src={app.image}
                    alt={app.title}
                    className="h-full w-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
                    >
                      <MdCheck className="text-white" size={18} />
                    </motion.div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {app.title}
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {app.description}
                  </p>

                  {/* Download Button */}

                  {isSelected && (
                    <motion.button

                      whileHover={{ scale: buildStatus === 'started' || buildStatus === 'running' ? 1 : 1.02 }}
                      whileTap={{ scale: buildStatus === 'started' || buildStatus === 'running' ? 1 : 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (buildStatus === 'done') {
                          handleDirectDownload();
                        } else if (!buildStatus || buildStatus === 'error') {
                          handleDownload(app.title);
                        }
                      }}
                      className={getButtonClass(buildStatus)}
                      disabled={buildStatus === 'started' || buildStatus === 'running'}
                    >
                      {getStatusIcon(buildStatus)}
                      {getStatusText(buildStatus)}
                    </motion.button>
                  )}

                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Application;
