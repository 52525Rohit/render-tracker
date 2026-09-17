import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import AddCameraModal from "../components/AddCameraModal";
import CameraDetailsModal from "../components/CameraDetailsModal";
import EditCameraModal from "../components/EditCameraModal";
import {
  RiEditLine,
  RiArrowLeftLine,
  RiDeleteBinLine,
  RiEyeLine,
  RiCameraLine,
  RiAddLine,
  RiSearchLine,
  RiLoader4Line,
  RiTimeLine,
  RiCheckDoubleLine,
  RiAlertLine,
  RiCloseCircleLine,
} from "react-icons/ri";
import { API_END_POINT } from "../utils/context";
import { getCameraDetails, deleteCamera } from "../api/cameras";
import { notifyError, notifyResult } from "../utils/apiError";

function convertTime(seconds) {
  const safeSeconds = Math.max(0, seconds || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return {
    seconds: `${safeSeconds}s`,
    minutes: `${minutes}m ${remainingSeconds}s`,
    hours: `${hours}h ${remainingMinutes}m ${remainingSeconds}s`,
  };
}

function withComputedTimes(camera, unit) {
  const totalFrame = Number(camera.total_frame || 0);
  const renderFrame = Number(camera.rander_frame || 0);
  const frameTime = Number(camera.frame_time || 0);

  return {
    ...camera,
    frame_time_display: convertTime(frameTime)[unit],
    estimated_time: convertTime(frameTime * totalFrame)[unit],
    total_rander_time: convertTime(renderFrame * frameTime)[unit],
    time_left: convertTime(frameTime * Math.max(0, totalFrame - renderFrame))[
      unit
    ],
    progress_percentage:
      totalFrame > 0
        ? Math.min(100, Math.round((renderFrame / totalFrame) * 100))
        : 0,
  };
}

function progressAccent(pct) {
  if (pct >= 100)
    return {
      bar: "bg-emerald-500",
      text: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: "text-emerald-500",
    };
  if (pct >= 40)
    return {
      bar: "bg-blue-600",
      text: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-500",
    };
  return {
    bar: "bg-amber-500",
    text: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "text-amber-500",
  };
}

function ProjectDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const project = location.state?.project;
  const projectName = location.state?.projectName;

  const unitRef = useRef();
  const [cameras, setCameras] = useState([]);
  const [unit, setUnit] = useState("seconds");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedViewCameraId, setSelectedViewCameraId] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEditCameraId, setSelectedEditCameraId] = useState(null);

  const fetchCameraDetails = async () => {
    if (!project) return;
    try {
      setLoading(true);
      const { data } = await getCameraDetails(project);
      setCameras(data.message || []);
    } catch (error) {
      notifyError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCameraDetails();
  }, [project]);

  const handleDeleteCamera = async (id) => {
    try {
      const { data } = await deleteCamera(id);
      if (notifyResult(data)) fetchCameraDetails();
    } catch (error) {
      notifyError(error);
    }
  };

  const confirmDeleteCamera = (camera) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="relative p-6 pb-0">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <RiCloseCircleLine className="text-2xl" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30">
                    <RiDeleteBinLine className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Delete Camera
                    </h3>
                    <p className="text-sm text-slate-500">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="rounded-2xl bg-red-50 border border-red-200/50 p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <RiAlertLine className="text-red-500 text-xl mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-800">
                        Are you sure you want to delete
                      </p>
                      <p className="text-base font-bold text-red-900 mt-0.5">
                        "{camera.camera_name}"?
                      </p>
                      <p className="text-sm text-red-700/70 mt-1">
                        All associated data and render progress will be
                        permanently removed.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 text-xs text-slate-500">
                  <RiTimeLine className="text-slate-400" />
                  <span>Camera ID: #{camera.id}</span>
                  <span className="w-px h-4 bg-slate-200" />
                  <span>
                    {camera.total_frame || 0} frames ·{" "}
                    {camera.rander_frame || 0} rendered
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 p-6 pt-0 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleDeleteCamera(camera.id);
                    onClose();
                  }}
                  className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/30 transition-all hover:shadow-red-500/50 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  <RiDeleteBinLine className="text-lg" />
                  Delete Camera
                </button>
              </div>
            </div>
          </div>
        );
      },
      buttons: [], // Remove default buttons
    });
  };

  const openViewModal = (cameraId) => {
    setSelectedViewCameraId(cameraId);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedViewCameraId(null);
  };

  const openEditModal = (cameraId) => {
    setSelectedEditCameraId(cameraId);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEditCameraId(null);
  };

  const rows = cameras.map((camera) => withComputedTimes(camera, unit));
  const filteredRows = rows.filter((c) =>
    c.camera_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalFramesAll = cameras.reduce(
    (acc, c) => acc + Number(c.total_frame || 0),
    0,
  );
  const renderedFramesAll = cameras.reduce(
    (acc, c) => acc + Number(c.rander_frame || 0),
    0,
  );
  const overallProgress =
    totalFramesAll > 0
      ? Math.round((renderedFramesAll / totalFramesAll) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Back Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 rounded-xl bg-white/80 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm border border-slate-200/60 transition-all hover:bg-white hover:text-sky-600 hover:shadow-md hover:border-sky-200"
        >
          <RiArrowLeftLine className="transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </button>

        {/* Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-100 via-sky-50 to-white p-6 sm:p-8 text-slate-900 shadow-sm border border-sky-200">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-300/30 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-sky-700 border border-sky-200 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                Project #{project || "N/A"}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl text-slate-900">
                  {projectName || "Project Details"}
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Manage cameras and track rendering progress in real-time
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                document.getElementById("add_camera_modal").showModal()
              }
              className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/30 transition-all hover:shadow-sky-500/50 hover:scale-[1.02] active:scale-95"
            >
              <RiAddLine className="text-xl transition-transform group-hover:rotate-90 duration-300" />
              <span>Add Camera</span>
            </button>
          </div>
        </div>

        {/* Modals */}
        <AddCameraModal projectId={project} onAdded={fetchCameraDetails} />
        <CameraDetailsModal
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
          cameraId={selectedViewCameraId}
        />
        <EditCameraModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          cameraId={selectedEditCameraId}
          onSuccess={fetchCameraDetails}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg shadow-sky-500/5 transition-all hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 border border-sky-100/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center justify-between relative">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total Cameras
                </p>
                <p className="mt-2 text-3xl font-black text-slate-900">
                  {loading ? "—" : cameras.length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30 transition-transform group-hover:scale-110">
                <RiCameraLine className="text-2xl" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg shadow-emerald-500/5 transition-all hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 border border-emerald-100/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center justify-between relative">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Overall Progress
                </p>
                <p className="mt-2 text-3xl font-black text-emerald-600">
                  {loading ? "—" : `${overallProgress}%`}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 transition-transform group-hover:scale-110">
                <RiCheckDoubleLine className="text-2xl" />
              </div>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg shadow-blue-500/5 transition-all hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 border border-blue-100/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center justify-between relative">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total Frames
                </p>
                <p className="mt-2 text-2xl font-black text-slate-900">
                  {loading ? "—" : `${renderedFramesAll} / ${totalFramesAll}`}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-110">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Table Card */}
        <div className="overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg shadow-sky-500/5">
          {/* Toolbar */}
          <div className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-white p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-xs">
                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search cameras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 hover:border-sky-300"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-400">
                  Time Unit:
                </span>
                <select
                  ref={unitRef}
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 hover:border-sky-300"
                >
                  <option value="seconds">Seconds</option>
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content States */}
          {loading ? (
            <div className="flex h-72 flex-col items-center justify-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-slate-200 border-t-sky-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-sky-500 to-purple-500 animate-pulse" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 animate-pulse">
                Loading cameras...
              </p>
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-50 to-sky-100/50 text-sky-600 mb-4">
                <RiCameraLine className="text-4xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {searchTerm
                  ? "No cameras match your search"
                  : "No cameras added yet"}
              </h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                {searchTerm
                  ? "Try a different camera name or clear the search filter."
                  : "Add your first camera to start tracking render progress."}
              </p>
              {!searchTerm && (
                <button
                  onClick={() =>
                    document.getElementById("add_camera_modal").showModal()
                  }
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <RiAddLine className="text-lg" /> Add Camera
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[920px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-white text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th className="px-6 py-4">Camera</th>
                      <th className="px-6 py-4">Progress</th>
                      <th className="px-6 py-4">Time / Frame</th>
                      <th className="px-6 py-4">Estimated</th>
                      <th className="px-6 py-4">Rendered</th>
                      <th className="px-6 py-4">Left</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredRows.map((camera) => {
                      const accent = progressAccent(camera.progress_percentage);
                      return (
                        <tr
                          key={camera.id}
                          className="group transition-all hover:bg-sky-50/30 hover:shadow-sm"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border-2 border-slate-200 bg-slate-50 transition-all group-hover:border-sky-300 group-hover:shadow-md">
                                {camera.image_url ? (
                                  <img
                                    className="h-full w-full object-cover"
                                    src={`${API_END_POINT}/uploads/${camera.image_url}`}
                                    alt={camera.camera_name}
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <RiCameraLine className="text-lg text-slate-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">
                                  {camera.camera_name}
                                </div>
                                <div className="text-xs text-slate-400">
                                  ID: #{camera.id}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="min-w-[200px] px-6 py-4">
                            <div className="mb-1.5 flex items-center justify-between text-xs">
                              <span className="text-slate-500">
                                {camera.rander_frame} / {camera.total_frame}
                              </span>
                              <span className={`font-semibold ${accent.text}`}>
                                {camera.progress_percentage}%
                              </span>
                            </div>
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ease-out ${accent.bar}`}
                                style={{
                                  width: `${camera.progress_percentage}%`,
                                }}
                              />
                            </div>
                          </td>

                          <td className="px-6 py-4 font-mono font-medium text-slate-700">
                            {camera.frame_time_display}
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-500">
                            {camera.estimated_time}
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-500">
                            {camera.total_rander_time}
                          </td>
                          <td className="px-6 py-4 font-mono font-medium text-slate-700">
                            {camera.time_left}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => openViewModal(camera.id)}
                                className="group/btn inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-sky-50 hover:text-sky-600 hover:shadow-sm"
                                title="View Details"
                              >
                                <RiEyeLine className="text-base transition-transform group-hover/btn:scale-110" />
                              </button>
                              <button
                                onClick={() => openEditModal(camera.id)}
                                className="group/btn inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm"
                                title="Edit Camera"
                              >
                                <RiEditLine className="text-base transition-transform group-hover/btn:scale-110" />
                              </button>
                              <button
                                onClick={() => confirmDeleteCamera(camera)}
                                className="group/btn inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-red-50 hover:text-red-600 hover:shadow-sm"
                                title="Delete Camera"
                              >
                                <RiDeleteBinLine className="text-base transition-transform group-hover/btn:scale-110" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-white px-6 py-4 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>
                    Showing {filteredRows.length} of {cameras.length} camera
                    {cameras.length !== 1 ? "s" : ""}
                  </span>
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="font-semibold text-sky-600 transition-all hover:text-sky-700 hover:underline flex items-center gap-1"
                  >
                    <RiCloseCircleLine className="text-sm" />
                    Clear search
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;
