import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { AnswerCard } from "../components/AnswerCard";
import {
  ArrowLeft,
  Clock,
  User,
  MessageSquare,
  Send,
  Upload,
  Loader2,
  Trash2,
  Edit,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

export const QuestionDetailPage = ({ onEditQuestion }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [loadingAnswers, setLoadingAnswers] = useState(true);

  // New Answer State
  const [answerBody, setAnswerBody] = useState("");
  const [answerFile, setAnswerFile] = useState(null);
  const [answerFilePreview, setAnswerFilePreview] = useState("");
  const [postingAnswer, setPostingAnswer] = useState(false);

  const fetchQuestionDetails = async () => {
    setLoadingQuestion(true);
    try {
      const res = await api.get(`/questions/${id}`);
      setQuestion(res.data?.data || null);
    } catch (error) {
      toast.error("Failed to load question details");
    } finally {
      setLoadingQuestion(false);
    }
  };

  const fetchAnswers = async () => {
    setLoadingAnswers(true);
    try {
      const res = await api.get(`/answers/question/${id}`);
      setAnswers(res.data?.data || []);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error("Failed to load answers");
      } else {
        setAnswers([]);
      }
    } finally {
      setLoadingAnswers(false);
    }
  };

  useEffect(() => {
    fetchQuestionDetails();
    fetchAnswers();
  }, [id]);

  const handlePostAnswer = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to answer this question");
      navigate("/login");
      return;
    }

    if (!answerBody.trim()) {
      toast.error("Answer content cannot be empty");
      return;
    }

    setPostingAnswer(true);
    try {
      const formData = new FormData();
      formData.append("body", answerBody);
      if (answerFile) {
        formData.append("image", answerFile);
      }

      const res = await api.post(`/answers/${id}`, formData);
      toast.success("Answer posted successfully!");
      setAnswerBody("");
      setAnswerFile(null);
      setAnswerFilePreview("");
      fetchAnswers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post answer");
    } finally {
      setPostingAnswer(false);
    }
  };

  const handleEditAnswer = async (answerId, formData) => {
    try {
      await api.patch(`/answers/${answerId}`, formData);
      toast.success("Answer updated successfully");
      fetchAnswers();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update answer");
      return false;
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm("Are you sure you want to delete this answer?")) return;
    try {
      await api.delete(`/answers/${answerId}`);
      toast.success("Answer deleted");
      setAnswers((prev) => prev.filter((a) => a.id !== answerId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete answer");
    }
  };

  const handleDeleteQuestion = async () => {
    if (!window.confirm("Delete this question completely?")) return;
    try {
      await api.delete(`/questions/${id}`);
      toast.success("Question deleted");
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete question");
    }
  };

  if (loadingQuestion) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <p className="text-slate-400 text-sm">Loading discussion...</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-200">Question not found</h2>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-purple-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Questions Feed</span>
        </Link>
      </div>
    );
  }

  const isOwner = user && (user.username === question.username || user.id === question.user_id);
  const formattedDate = new Date(question.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center space-x-2 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Questions</span>
      </button>

      {/* Question Header Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 leading-tight">
              {question.title}
            </h1>

            <div className="flex items-center space-x-3 text-xs text-slate-400 pt-1">
              <div className="flex items-center space-x-1.5 bg-slate-800 px-3 py-1 rounded-md text-slate-300">
                <User className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-medium">{question.username || "Anonymous"}</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="flex items-center space-x-1 text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>Asked on {formattedDate}</span>
              </div>
            </div>
          </div>

          {isOwner && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEditQuestion(question)}
                className="p-2 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-slate-800 transition-colors cursor-pointer"
                title="Edit Question"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={handleDeleteQuestion}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                title="Delete Question"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Question Body */}
        <div className="text-slate-300 text-base leading-relaxed whitespace-pre-line border-t border-b border-slate-800/80 py-6">
          {question.body}
        </div>

        {/* Question Image Attachment */}
        {question.image_url && (
          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 max-h-96">
            <img
              src={question.image_url}
              alt={question.title}
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>

      {/* Answers Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-slate-200 flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            <span>Answers ({answers.length})</span>
          </h2>
        </div>

        {/* Post Answer Input Box */}
        <form
          onSubmit={handlePostAnswer}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4"
        >
          <h3 className="text-sm font-semibold text-slate-300">Your Answer</h3>

          <textarea
            rows={4}
            placeholder={
              user
                ? "Write a clear, detailed answer to help solve this problem..."
                : "Please sign in to write an answer"
            }
            value={answerBody}
            onChange={(e) => setAnswerBody(e.target.value)}
            disabled={!user}
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 disabled:opacity-50 transition-all resize-y"
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <label
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 transition-colors ${
                  user ? "hover:bg-slate-750 cursor-pointer" : "opacity-50 cursor-not-allowed"
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-purple-400" />
                <span>Attach Image</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={!user}
                  onChange={(e) => {
                    const f = e.target.files[0];
                    if (f) {
                      setAnswerFile(f);
                      setAnswerFilePreview(URL.createObjectURL(f));
                    }
                  }}
                  className="hidden"
                />
              </label>

              {answerFile && (
                <div className="flex items-center space-x-2 bg-slate-800/80 px-2.5 py-1 rounded-md text-xs text-purple-300">
                  <span className="truncate max-w-xs">{answerFile.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAnswerFile(null);
                      setAnswerFilePreview("");
                    }}
                    className="text-slate-400 hover:text-rose-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!user || postingAnswer}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm shadow-md shadow-purple-600/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {postingAnswer ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Post Answer</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Answers List */}
        {loadingAnswers ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
          </div>
        ) : answers.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
            <p className="text-slate-500 text-sm">
              No answers posted yet. Be the first to answer!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {answers.map((answer) => (
              <AnswerCard
                key={answer.id}
                answer={answer}
                currentUser={user}
                onEditAnswer={handleEditAnswer}
                onDeleteAnswer={handleDeleteAnswer}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
