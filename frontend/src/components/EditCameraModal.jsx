// src/components/EditCameraModal.jsx
import { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  X,
  ImagePlus,
  Camera,
  Film,
  Clapperboard,
  Loader2,
  Save,
  Maximize2,
  Minimize2,
  Clock,
  CheckCircle2,
  Edit3,
} from "lucide-react";
import { API_END_POINT } from "../utils/context";
import { getViewDetails, updateCamera } from "../api/cameras";
import { notifyError, notifyResult } from "../utils/apiError";

function InfoRow({ label, value, color = "text-gray-900" }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-semibold ${color}`}>{value}</span>
    </div>
  );
}

function EditCameraModal({ isOpen, onClose, cameraId, onSuccess }) {
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [cameraName, setCameraName] = useState("");
  const [totalFrame, setTotalFrame] = useState("");
  const [randerFrame, setRanderFrame] = useState("");
  const [frameTime, setFrameTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isOpen && cameraId) {
      setLoading(true);
      getViewDetails(cameraId)
        .then(({ data }) => {
          const camera = data.message[0];
          setCameraName(camera.camera_name || "");
          setTotalFrame(camera.total_frame || "");
          setRanderFrame(camera.rander_frame || "");
          setFrameTime(Number(camera.frame_time) || 0);
          if (camera.image_url) {
            setPreview(`${API_END_POINT}/uploads/${camera.image_url}`);
          }
        })
        .catch(notifyError)
        .finally(() => setLoading(false));
    }
  }, [cameraId, isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("id", cameraId);
    formData.append("cameraName", cameraName);
    formData.append("totalFrame", totalFrame);
    formData.append("randerFrame", randerFrame);
    if (image) {
      formData.append("imageFile", image);
    }

    try {
      setSubmitting(true);
      const { data } = await updateCamera(formData);
      if (notifyResult(data)) {
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      notifyError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmSave = () => {
    confirmAlert({
      customUI: ({ onClose: closeAlert }) => {
        return (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="relative p-6 pb-0">
                <button
                  onClick={closeAlert}
                  className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X className="text-2xl" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30">
                    <Save className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Confirm Update
                    </h3>
                    <p className="text-sm text-slate-500">
                      Review changes before saving
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="rounded-2xl bg-indigo-50 border border-indigo-200/50 p-4">
                  <div className="flex items-start gap-3">
                    <Edit3 className="text-indigo-500 text-xl mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-indigo-800">
                        Are you sure you want to update
                      </p>
                      <p className="text-base font-bold text-indigo-900 mt-0.5">
                        "{cameraName || "this camera"}"?
                      </p>
                      <p className="text-sm text-indigo-700/70 mt-1">
                        Camera settings and frame data will be updated.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <span className="text-slate-500">Total Frames</span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {totalFrame || 0}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <span className="text-slate-500">Rendered</span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {randerFrame || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 p-6 pt-0 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl">
                <button
                  onClick={closeAlert}
                  className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleSubmit();
                    closeAlert();
                  }}
                  className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  <Save className="text-lg" />
                  Yes, Update
                </button>
              </div>
            </div>
          </div>
        );
      },
      buttons: [], // Remove default buttons
    });
  };

  // Calculate stats
  const total = Number(totalFrame) || 0;
  const rendered = Number(randerFrame) || 0;
  const remaining = Math.max(total - rendered, 0);
  const percent =
    total > 0 ? Math.min(100, Math.round((rendered / total) * 100)) : 0;
  const isComplete = percent >= 100;

  const formatTime = (seconds) => {
    if (seconds <= 0) return "0s";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full transition-all duration-300 ease-out ${
          isExpanded ? "max-w-5xl" : "max-w-3xl"
        } max-h-[90vh] rounded-3xl bg-white shadow-2xl flex flex-col overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex-none z-30 flex items-center justify-between bg-white/95 backdrop-blur-sm px-6 py-4 border-b border-slate-200/80 rounded-t-3xl">
          <div className="flex items-center gap-2">
            <Camera size={18} className="text-indigo-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">
              Edit Camera
            </h2>
            <span className="ml-2 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600">
              #{cameraId}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              title={isExpanded ? "Minimize" : "Expand"}
            >
              {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              confirmSave();
            }}
            className="space-y-6"
          >
            {/* Profile Section with Circular Image */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="relative flex flex-col items-center pt-8 pb-6 px-6">
                {/* Decorative Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-white to-white" />

                {/* Circular Image Upload */}
                <div className="relative z-10">
                  <label
                    htmlFor="edit-camera-image-input"
                    className="group relative cursor-pointer"
                  >
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 opacity-75 blur-sm transition-all group-hover:opacity-100" />
                      <div className="relative h-32 w-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100 transition-all group-hover:scale-105">
                        {loading ? (
                          <div className="flex h-full w-full items-center justify-center bg-slate-200">
                            <Loader2
                              size={32}
                              className="animate-spin text-indigo-400"
                            />
                          </div>
                        ) : preview ? (
                          <>
                            <img
                              src={preview}
                              alt="Camera preview"
                              className="h-full w-full object-cover transition-opacity group-hover:opacity-70"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                              <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
                                <ImagePlus size={20} className="text-white" />
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500">
                            <ImagePlus size={32} strokeWidth={1.5} />
                            <span className="mt-1 text-xs font-medium">
                              Upload
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <input
                      id="edit-camera-image-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                      className="hidden"
                    />
                  </label>

                  {/* Status Badge */}
                  {!loading && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide shadow-lg ${
                          isComplete
                            ? "bg-emerald-500 text-white"
                            : percent > 0
                              ? "bg-amber-500 text-white"
                              : "bg-gray-500 text-white"
                        }`}
                      >
                        {isComplete ? (
                          <CheckCircle2 size={12} />
                        ) : percent > 0 ? (
                          <Clock size={12} />
                        ) : (
                          <Camera size={12} />
                        )}
                        {isComplete
                          ? "Complete"
                          : percent > 0
                            ? `${percent}% Done`
                            : "Not Started"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Camera ID Badge */}
                <div className="mt-4 z-10">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1">
                    <span className="font-mono text-xs text-slate-600">
                      ID: {cameraId}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                {!loading && total > 0 && (
                  <div className="w-full max-w-md mt-4 z-10">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700">
                        Progress
                      </span>
                      <span className="font-mono text-sm font-bold text-slate-900">
                        {percent}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          isComplete
                            ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                            : "bg-gradient-to-r from-indigo-600 to-violet-500"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Two Column Layout */}
            <div
              className={`grid ${isExpanded ? "grid-cols-2" : "grid-cols-1"} gap-5`}
            >
              {/* Left Column - Form Fields */}
              <div className="space-y-5">
                {/* Camera Name Input */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Edit3 size={16} className="text-indigo-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Camera Information
                    </h3>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                      <Camera size={16} className="text-indigo-500" />
                      Camera Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cameraName}
                        onChange={(e) => setCameraName(e.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-base font-semibold text-gray-900 transition-all focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 placeholder:text-gray-400"
                        placeholder="Enter camera name"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Camera size={18} className="text-gray-300" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Frame Settings */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Film size={16} className="text-indigo-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Frame Settings
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {/* Total Frames */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                        <Film size={16} className="text-indigo-500" />
                        Total Frames
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          value={totalFrame}
                          onChange={(e) => setTotalFrame(e.target.value)}
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-lg font-semibold text-gray-900 transition-all focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 placeholder:text-gray-400"
                          placeholder="Enter total frames"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
                          frames
                        </span>
                      </div>
                    </div>

                    {/* Rendered Frames */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                        <Clapperboard size={16} className="text-emerald-500" />
                        Rendered Frames
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          value={randerFrame}
                          onChange={(e) => setRanderFrame(e.target.value)}
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-lg font-semibold text-gray-900 transition-all focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100 placeholder:text-gray-400"
                          placeholder="Enter rendered frames"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
                          frames
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Frame Time Display */}
                  {frameTime > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Time per Frame</span>
                        <span className="font-mono font-medium text-gray-700">
                          {formatTime(frameTime)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Quick Preview */}
              <div className="space-y-5">
                <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50/50 to-white p-5 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
                    Quick Preview
                  </h3>
                  <div className="space-y-3">
                    <InfoRow
                      label="Camera Name"
                      value={cameraName || "Not set"}
                      color="text-indigo-600"
                    />
                    <InfoRow label="Total Frames" value={totalFrame || "0"} />
                    <InfoRow
                      label="Rendered Frames"
                      value={randerFrame || "0"}
                      color="text-emerald-600"
                    />
                    <InfoRow
                      label="Remaining"
                      value={remaining}
                      color={
                        remaining > 0 ? "text-amber-600" : "text-emerald-600"
                      }
                    />
                    {frameTime > 0 && (
                      <>
                        <InfoRow
                          label="Est. Total Time"
                          value={formatTime(frameTime * total)}
                          color="text-blue-600"
                        />
                        <InfoRow
                          label="Est. Remaining"
                          value={formatTime(frameTime * remaining)}
                          color={
                            remaining > 0
                              ? "text-amber-600"
                              : "text-emerald-600"
                          }
                        />
                      </>
                    )}
                  </div>
                </div>

                {!isExpanded && (
                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                      Tips
                    </h3>
                    <ul className="space-y-2 text-xs text-gray-500">
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 text-indigo-400">•</span>
                        Click the camera image to upload a new photo
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 text-indigo-400">•</span>
                        Update frame counts to track progress
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 text-indigo-400">•</span>
                        Changes will be saved after confirmation
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:border-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition-all hover:shadow-indigo-600/30 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditCameraModal;
