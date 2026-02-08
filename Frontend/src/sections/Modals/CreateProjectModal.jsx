import { createProject } from "@/redux/slices/projectsSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const CreateProjectModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.projects);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    try {
      await dispatch(
        createProject({
          name,
          description,
        })
      ).unwrap();

      onClose(); // close modal on success
    } catch (err) {
      setError(err || "Failed to create project");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-[#0a0a0a] border border-white/10 p-6">

        <h2 className="text-lg font-semibold text-white">
          Create New Project
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          Projects isolate email streams, API keys, and templates.
        </p>

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

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="rounded-xl bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-500 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
