import React, { useState } from "react";
import { User, Clock, Trash2, Edit, Check, X, Upload } from "lucide-react";
import toast from "react-hot-toast";

export const AnswerCard = ({ answer, currentUser, onEditAnswer, onDeleteAnswer }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(answer.body);
  const [editFile, setEditFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const formattedDate = new Date(answer.created_at || Date.now()).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const isOwner = currentUser && (currentUser.id === answer.user_id || currentUser.id === answer.userId);

  const handleSaveEdit = async () => {
    if (!editBody.trim()) {
      toast.error("Answer body cannot be empty");
      return;
    }
    setSaving(true);
    const formData = new FormData();
    formData.append("body", editBody);
    if (editFile) {
      formData.append("image", editFile);
    }
    const success = await onEditAnswer(answer.id, formData);
    setSaving(false);
    if (success) {
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <div className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold text-xs">
            A
          </div>
          <span className="font-medium text-slate-300">User #{answer.user_id || answer.userId}</span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center space-x-1 text-slate-500">
            <Clock className="w-3 h-3" />
            <span>{formattedDate}</span>
          </span>
        </div>

        {isOwner && !isEditing && (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 rounded text-slate-400 hover:text-purple-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Edit Answer"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeleteAnswer(answer.id)}
              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Delete Answer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3 pt-2">
          <textarea
            rows={4}
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-purple-500"
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-1 text-xs text-purple-400 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>{editFile ? editFile.name : "Replace Image"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditFile(e.target.files[0])}
                className="hidden"
              />
            </label>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 rounded-md text-slate-400 hover:bg-slate-800 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="px-3 py-1 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
            {answer.body}
          </p>

          {answer.image_url && (
            <div className="mt-2 rounded-lg overflow-hidden border border-slate-800 max-h-48 max-w-md bg-slate-950">
              <img
                src={answer.image_url}
                alt="Answer attachment"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
