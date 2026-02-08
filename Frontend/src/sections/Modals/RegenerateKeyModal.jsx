import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { regenerateApiKey } from "@/redux/slices/projectsSlice";

const RegenerateKeyModal = ({ projectId, onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.projects);
  const [error, setError] = useState(null);

  const handleRegenerate = async () => {
    try {
      await dispatch(regenerateApiKey(projectId)).unwrap();
      onClose();
    } catch (err) {
      setError(err || "Failed to regenerate API key");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-purple-500/20 bg-[#0a0a0a] p-6 overflow-hidden">

        {/* Ambient Glow */}
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-purple-600/20 blur-[80px]" />

        {/* Header */}
        <h2 className="relative z-10 text-lg font-semibold text-white">
          Regenerate API Key
        </h2>

        <p className="relative z-10 mt-2 text-sm text-gray-400 leading-relaxed">
          This will generate a new secret key for this project and immediately
          invalidate the current one.
        </p>

        {/* Warning Box */}
        <div className="relative z-10 mt-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <p className="text-xs font-semibold text-amber-400 mb-2 uppercase tracking-widest">
            Important
          </p>
          <ul className="space-y-2 text-xs text-amber-300 leading-relaxed">
            <li>• Existing integrations using the current key will stop working</li>
            <li>• You must update the new key in all clients and services</li>
            <li>• This action cannot be reversed</li>
          </ul>
        </div>

        {/* Error */}
        {error && (
          <p className="relative z-10 mt-4 text-xs text-red-400">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="relative z-10 mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="rounded-xl bg-purple-600/20 border border-purple-500/30 px-5 py-2
                       text-sm font-semibold text-purple-300
                       hover:bg-purple-600/30
                       shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)]
                       disabled:opacity-60"
          >
            {loading ? "Regenerating..." : "Regenerate Key"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegenerateKeyModal;
