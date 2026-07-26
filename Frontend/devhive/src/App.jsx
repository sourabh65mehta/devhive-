import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { QuestionDetailPage } from "./pages/QuestionDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AskQuestionModal } from "./components/AskQuestionModal";
import { Toaster } from "react-hot-toast";
import api from "./api/axios";
import toast from "react-hot-toast";

function MainLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const handleOpenAsk = () => {
    if (!user) {
      toast.error("Please login to ask a question");
      navigate("/login");
      return;
    }
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleQuestionSubmit = async (formData, questionId) => {
    try {
      if (questionId) {
        await api.patch(`/questions/${questionId}`, formData);
        toast.success("Question updated successfully!");
      } else {
        await api.post("/questions", formData);
        toast.success("Question posted successfully!");
      }
      // Force page refresh or navigation
      window.location.reload();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit question");
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar onOpenAskModal={handleOpenAsk} />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onOpenAskModal={handleOpenAsk}
                onEditQuestion={handleOpenEdit}
              />
            }
          />
          <Route
            path="/questions/:id"
            element={<QuestionDetailPage onEditQuestion={handleOpenEdit} />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>

      <AskQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleQuestionSubmit}
        initialData={editingQuestion}
      />

      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 DevHive Q&A Platform. All rights reserved.</span>
          <span className="font-mono text-slate-600">Built with React + Tailwind CSS</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#0f172a",
              color: "#f8fafc",
              border: "1px solid #1e293b",
            },
          }}
        />
        <MainLayout />
      </AuthProvider>
    </Router>
  );
}
