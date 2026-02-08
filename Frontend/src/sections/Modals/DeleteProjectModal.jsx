import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { deleteProject } from "@/redux/slices/projectsSlice";

const DeleteProjectModal = ({ project, onClose, onDeleted }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.projects);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    try {
      await dispatch(deleteProject(project.id)).unwrap();
      onClose();

      // Optional callback (for redirect/navigation)
      if (onDeleted) onDeleted();
    } catch (err) {
      setError(err || "Failed to delete project");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-[#0a0a0a] border border-red-500/20 p-6">

        {/* Header */}
        <h2 className="text-lg font-semibold text-red-400">
          Delete Project
        </h2>

        <p className="mt-2 text-sm text-gray-400 leading-relaxed">
          You are about to permanently delete{" "}
          <span className="font-semibold text-white">
            {project.name}
          </span>
          .
          <br />
          This action <span className="text-red-400 font-semibold">cannot be undone</span>.
        </p>

        {/* Error */}
        {error && (
          <p className="mt-4 text-xs text-red-400">{error}</p>
        )}

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
            onClick={handleDelete}
            disabled={loading}
            className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete Project"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProjectModal;
