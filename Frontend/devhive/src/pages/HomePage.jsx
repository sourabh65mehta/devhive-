import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { QuestionCard } from "../components/QuestionCard";
import { useAuth } from "../context/AuthContext";
import { Search, Loader2, HelpCircle, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

export const HomePage = ({ onOpenAskModal, onEditQuestion }) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchQuestions = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/questions?page=${pageNum}&limit=10`);
      const data = response.data?.data || [];
      setQuestions(data);
      setHasMore(data.length === 10);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error("Failed to load questions");
      } else {
        setQuestions([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(page);
  }, [page]);

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await api.delete(`/questions/${id}`);
      toast.success("Question deleted successfully");
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete question");
    }
  };

  const filteredQuestions = questions.filter(
    (q) =>
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Hero / Banner Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-purple-950/30 border border-slate-800 p-8 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Developer Q&A Community</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Where Developers Share Knowledge & Solve Code Together
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed">
            Search developer solutions, ask questions with attachments, and help fellow engineers build better software.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions by keyword or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm transition-all shadow-inner"
              />
            </div>

            {user && (
              <button
                onClick={onOpenAskModal}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/25 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                Ask a Question
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feed List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-200 flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-purple-400" />
            <span>Recent Questions</span>
          </h2>
          <span className="text-xs text-slate-400">
            Showing {filteredQuestions.length} discussions
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <p className="text-sm text-slate-400">Fetching latest discussions...</p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-16 border border-slate-800/80 rounded-2xl bg-slate-900/30 space-y-3">
            <HelpCircle className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-semibold text-slate-300">No questions found</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              {searchTerm
                ? "Try searching with a different keyword."
                : "Be the first developer to ask a question!"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                currentUser={user}
                onEdit={onEditQuestion}
                onDelete={handleDeleteQuestion}
              />
            ))}
          </div>
        )}

        {/* Pagination controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-slate-400 font-mono">Page {page}</span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasMore}
            className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
