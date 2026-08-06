// src/components/CameraDetailsModal.jsx
import { useEffect, useState } from "react";
import {
  X,
  Maximize2,
  Minimize2,
  Camera as CameraIcon,
  Film,
  Hash,
  Activity,
  BarChart3,
  CheckCircle2,
  Clock,
  Layers,
  Calendar,
  TrendingUp,
  Timer,
} from "lucide-react";
import { API_END_POINT } from "../utils/context";
import { getViewDetails } from "../api/cameras";
import { notifyError } from "../utils/apiError";

function StatBlock({
  label,
  value,
  icon: Icon,
  colorClass = "text-slate-900",
  subtitle,
}) {
  return (
    <div className="flex flex-col rounded-2xl bg-slate-50/80 p-4 border border-slate-100 transition-all hover:bg-slate-100/60 hover:shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} className="text-slate-400" />}
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {label}
          </p>
        </div>
      </div>
      <p
        className={`mt-1.5 font-mono text-2xl font-bold tabular-nums ${colorClass}`}
      >
        {value.toLocaleString()}
      </p>
      {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
}

function InfoItem({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
        <Icon size={15} className="text-slate-500" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function CameraDetailsModal({ isOpen, onClose, cameraId }) {
  const [camera, setCamera] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isOpen && cameraId) {
      setLoading(true);
      getViewDetails(cameraId)
        .then(({ data }) => {
          const cameraData = data.message?.[0] || data;
          setCamera(cameraData);
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

  if (!isOpen) return null;

  if (loading || !camera) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative w-full max-w-5xl rounded-3xl bg-white p-8 shadow-2xl">
          <div className="space-y-5">
            <div className="flex justify-end">
              <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="h-36 w-36 animate-pulse rounded-full bg-slate-200" />
              <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-80 w-full animate-pulse rounded-3xl bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const total = Number(camera.total_frame) || 0;
  const rendered = Number(camera.rander_frame) || 0;
  const remaining = Math.max(total - rendered, 0);
  const percent = total
    ? Math.min(100, Math.round((rendered / total) * 100))
    : 0;
  const isComplete = percent >= 100;

  const frameTime = Number(camera.frame_time) || 0;
  const estimatedRemaining = frameTime * remaining;

  const formatTime = (seconds) => {
    if (seconds <= 0) return "Complete";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal - Larger size with no scroll */}
      <div
        className={`relative w-full transition-all duration-300 ease-out ${
          isExpanded ? "max-w-7xl" : "max-w-5xl"
        } h-[85vh] rounded-3xl bg-white shadow-2xl flex flex-col overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header - Fixed */}
        <div className="flex-none z-30 flex items-center justify-between bg-white/95 backdrop-blur-sm px-6 py-4 border-b border-slate-200/80 rounded-t-3xl">
          <div className="flex items-center gap-2">
            <CameraIcon size={18} className="text-indigo-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">
              Camera Details
            </h2>
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

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Two Column Layout for larger modal */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Column - Profile and Stats (3 columns) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Profile Card */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-md">
                <div className="relative flex flex-col items-center pt-8 pb-6 px-6">
                  {/* Decorative Background */}
                  <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-white to-white" />

                  {/* Circular Image */}
                  <div className="relative z-10">
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 opacity-75 blur-sm" />
                      <div className="relative h-36 w-36 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100">
                        {camera.image_url ? (
                          <img
                            src={`${API_END_POINT}/uploads/${camera.image_url}`}
                            alt={camera.camera_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-200">
                            <CameraIcon size={40} className="text-slate-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide shadow-lg ${
                          isComplete
                            ? "bg-emerald-500 text-white"
                            : "bg-amber-500 text-white"
                        }`}
                      >
                        {isComplete ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <Clock size={12} />
                        )}
                        {isComplete ? "Completed" : "Rendering"}
                      </span>
                    </div>
                  </div>

                  {/* Camera Info */}
                  <div className="mt-6 text-center z-10">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
                      <CameraIcon size={14} />
                      <span>Camera View</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                      {camera.camera_name}
                    </h1>
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1">
                      <Hash size={12} className="text-slate-400" />
                      <span className="font-mono text-xs text-slate-600">
                        ID: {cameraId}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar Section */}
                  <div className="w-full max-w-md mt-6 z-10">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700">
                        Progress
                      </span>
                      <span className="font-mono text-sm font-bold text-slate-900">
                        {percent}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          isComplete
                            ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                            : "bg-gradient-to-r from-indigo-600 to-violet-500"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    {!isComplete && (
                      <p className="mt-1.5 text-xs text-slate-500 text-right">
                        Estimated remaining: {formatTime(estimatedRemaining)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <StatBlock
                  label="Total Frames"
                  value={total}
                  icon={Film}
                  subtitle="Total frames to render"
                />
                <StatBlock
                  label="Rendered"
                  value={rendered}
                  icon={CheckCircle2}
                  colorClass="text-emerald-600"
                  subtitle={`${percent}% complete`}
                />
                <StatBlock
                  label="Remaining"
                  value={remaining}
                  icon={Clock}
                  colorClass={
                    remaining > 0 ? "text-amber-600" : "text-emerald-600"
                  }
                  subtitle={remaining > 0 ? "Still in progress" : "All done!"}
                />
              </div>

              {/* Additional Stats - Always visible in larger modal */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <StatBlock
                  label="Time per Frame"
                  value={frameTime.toFixed(2)}
                  icon={Timer}
                  colorClass="text-blue-600"
                  subtitle="Seconds per frame"
                />
                <StatBlock
                  label="Total Time"
                  value={formatTime(frameTime * total)}
                  icon={TrendingUp}
                  colorClass="text-purple-600"
                />
                <StatBlock
                  label="Rendered Time"
                  value={formatTime(frameTime * rendered)}
                  icon={Layers}
                  colorClass="text-teal-600"
                />
              </div>
            </div>

            {/* Right Column - Detailed Information (2 columns) */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm h-full">
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={18} className="text-indigo-600" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">
                    Camera Details
                  </h2>
                </div>

                <div className="space-y-2">
                  <InfoItem
                    label="Camera ID"
                    value={cameraId || "N/A"}
                    icon={Hash}
                  />
                  <InfoItem
                    label="Camera Name"
                    value={camera.camera_name || "N/A"}
                    icon={CameraIcon}
                  />
                  <InfoItem
                    label="Total Frames"
                    value={total.toLocaleString()}
                    icon={Film}
                  />
                  <InfoItem
                    label="Rendered Frames"
                    value={rendered.toLocaleString()}
                    icon={CheckCircle2}
                  />
                  <InfoItem
                    label="Remaining Frames"
                    value={remaining.toLocaleString()}
                    icon={Clock}
                  />
                  <InfoItem
                    label="Status"
                    value={isComplete ? "Completed ✓" : "In Progress"}
                    icon={Activity}
                  />
                  {camera.created_at && (
                    <InfoItem
                      label="Created"
                      value={new Date(camera.created_at).toLocaleDateString()}
                      icon={Calendar}
                    />
                  )}
                </div>

                {/* Quick Stats Summary */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={16} className="text-slate-400" />
                    <span className="text-xs text-slate-500">
                      Rendering {isComplete ? "completed" : "in progress"} •
                      {percent}% done •
                      {isComplete
                        ? " All frames rendered"
                        : ` ${remaining} frames remaining`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CameraDetailsModal;
