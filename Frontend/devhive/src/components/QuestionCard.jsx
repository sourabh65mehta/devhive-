import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Clock, User, Image as ImageIcon, Trash2, Edit } from "lucide-react";

export const QuestionCard = ({ question, currentUser, onEdit, onDelete }) => {
  const formattedDate = new Date(question.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const isOwner = currentUser && (currentUser.username === question.username || currentUser.id === question.user_id);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 transition-all hover:border-slate-700/80 hover:shadow-xl hover:shadow-purple-950/10 group">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 text-xs text-slate-400 mb-3">
          <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/50">
            <User className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-medium text-slate-300">{question.username || "Anonymous"}</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {isOwner && (
          <div className="flex items-center space-x-2 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(question)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Edit Question"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(question.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Delete Question"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <Link to={`/questions/${question.id}`}>
        <h2 className="text-xl font-semibold text-slate-100 group-hover:text-purple-300 transition-colors line-clamp-2 mb-2">
          {question.title}
        </h2>

        <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed mb-4">
          {question.body}
        </p>

        {question.image_url && (
          <div className="mb-4 overflow-hidden rounded-xl border border-slate-800 max-h-56 bg-slate-950">
            <img
              src={question.image_url}
              alt={question.title}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            />
          </div>
        )}
      </Link>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs text-slate-400">
        <Link
          to={`/questions/${question.id}`}
          className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>View Answers & Details →</span>
        </Link>

        {question.image_url && (
          <span className="flex items-center space-x-1 text-slate-500">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Image Attached</span>
          </span>
        )}
      </div>
    </div>
  );
};
