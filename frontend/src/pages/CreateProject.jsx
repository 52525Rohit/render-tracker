import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FolderPlus, Loader2 } from "lucide-react";
import { createProject } from "../api/projects";
import { notifyError, notifyResult } from "../utils/apiError";

function CreateProject({ onCreated }) {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await createProject(projectName.trim());
      if (notifyResult(data)) {
        setProjectName("");
        if (onCreated) {
          onCreated();
          document.getElementById("create_project_modal")?.close();
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      notifyError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
          <FolderPlus size={18} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">New Project</h3>
          <p className="text-xs text-gray-500">
            Give your project a name to get started
          </p>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Project Name
        </label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="e.g. Divine Serenity Renders"
          autoFocus
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Saving...
          </>
        ) : (
          "Save"
        )}
      </button>
    </form>
  );
}

export default CreateProject;
