import { useState } from "react";
import toast from "react-hot-toast";
import { Camera, ImagePlus, Film, Clapperboard, Loader2 } from "lucide-react";
import { uploadCamera } from "../api/cameras";
import { notifyError, notifyResult } from "../utils/apiError";

function AddCameraForm({ projectId, onAdded }) {
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [cameraName, setCameraName] = useState("");
  const [totalFrame, setTotalFrame] = useState("");
  const [randerFrame, setRanderFrame] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !cameraName.trim() || !totalFrame || !randerFrame) {
      toast.error("Please fill all the details");
      return;
    }

    const formData = new FormData();
    formData.append("projectid", projectId);
    formData.append("imageFile", image);
    formData.append("cameraName", cameraName);
    formData.append("totalFrame", totalFrame);
    formData.append("randerFrame", randerFrame);

    try {
      setSubmitting(true);
      const { data } = await uploadCamera(formData);
      if (notifyResult(data)) {
        setPreview(null);
        setImage(null);
        setCameraName("");
        setTotalFrame("");
        setRanderFrame("");
        document.getElementById("add_camera_modal")?.close();
        onAdded?.();
      }
    } catch (error) {
      notifyError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
          <Camera size={18} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Add Camera</h3>
          <p className="text-xs text-gray-500">
            Upload a preview image and set frame details
          </p>
        </div>
      </div>

      {/* Image upload */}
      <label
        htmlFor="camera-image-input"
        className="group relative flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 transition-colors hover:border-sky-300 hover:bg-sky-50/40"
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="h-40 w-full rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-40 w-full flex-col items-center justify-center gap-2 text-gray-400 group-hover:text-sky-500">
            <ImagePlus size={28} strokeWidth={1.5} />
            <span className="text-xs font-medium">
              Click to upload camera image
            </span>
            <span className="text-[11px] text-gray-400">
              PNG, JPG up to a few MB
            </span>
          </div>
        )}
        <input
          id="camera-image-input"
          type="file"
          name="imageFile"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        {preview && (
          <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
            Change image
          </span>
        )}
      </label>

      {/* Camera name */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Camera Name
        </label>
        <input
          type="text"
          value={cameraName}
          onChange={(e) => setCameraName(e.target.value)}
          placeholder="e.g. Front Entrance Cam"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
        />
      </div>

      {/* Frames */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
            <Film size={14} className="text-gray-400" />
            Total Frame
          </label>
          <input
            type="number"
            min="0"
            value={totalFrame}
            onChange={(e) => setTotalFrame(e.target.value)}
            placeholder="0"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          />
        </div>
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
            <Clapperboard size={14} className="text-gray-400" />
            Rendered Frame
          </label>
          <input
            type="number"
            min="0"
            value={randerFrame}
            onChange={(e) => setRanderFrame(e.target.value)}
            placeholder="0"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Uploading...
          </>
        ) : (
          "Add Camera"
        )}
      </button>
    </form>
  );
}

export default AddCameraForm;
