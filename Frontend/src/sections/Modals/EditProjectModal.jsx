import { updateProject } from "@/redux/slices/projectsSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const EditProjectModal = ({ project, onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.projects);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);

  // Prefill form
  useEffect(() => {
    if (project) {
      setName(project.name || "");
      setDescription(project.description || "");
    }
  }, [project]);

  const handleUpdate = async () => {
    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    try {
      await dispatch(
        updateProject({
          projectId: project.id,
          name,
          description,
        })
      ).unwrap();

      onClose(); // close modal on success
    } catch (err) {
      setError(err || "Failed to update project");
      console.log("Update project error:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-[#0a0a0a] border border-white/10 p-6">

        {/* Header */}
        <h2 className="text-lg font-semibold text-white">
          Edit Project
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          Update your project details. Changes apply immediately.
        </p>

        {/* Form */}
        <div className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl bg-black border border-white/10 px-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none"
          />

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl bg-black border border-white/10 px-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none"
          />

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="rounded-xl bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-500 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;
