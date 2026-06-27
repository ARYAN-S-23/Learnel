import React, { useState, useEffect } from "react";
import useStore from "../../store/useStore";
import {
  Brain,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Trophy,
  RotateCcw,
  Plus,
  Trash2,
  ArrowLeft,
  Eye,
} from "lucide-react";

const QuizEngine = () => {
  const quizzes = useStore((s) => s.quizzes);
  const subjects = useStore((s) => s.subjects);
  const addQuiz = useStore((s) => s.addQuiz);
  const deleteQuiz = useStore((s) => s.deleteQuiz);
  const saveQuizResult = useStore((s) => s.saveQuizResult);

  const [view, setView] = useState("list");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showCreate, setShowCreate] = useState(false);

  const [newQuiz, setNewQuiz] = useState({
    subjectId: "",
    title: "",
    questions: [],
  });
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    explanation: "",
  });

  useEffect(() => {
    let interval;
    if (view === "taking" && !submitted) {
      interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [view, submitted]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQ(0);
    setAnswers({});
    setSubmitted(false);
    setElapsed(0);
    setView("taking");
  };

  const selectAnswer = (qIdx, oIdx) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
  };

  const submitQuiz = () => {
    const score = activeQuiz.questions.reduce((acc, q, i) => {
      return acc + (answers[i] === q.correctIndex ? 1 : 0);
    }, 0);
    saveQuizResult(activeQuiz.id, score, activeQuiz.questions.length);
    setSubmitted(true);
    setView("results");
  };

  const accuracy = activeQuiz
    ? Math.round(
        (activeQuiz.questions.reduce(
          (acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0),
          0,
        ) /
          activeQuiz.questions.length) *
          100,
      )
    : 0;

  const score = activeQuiz
    ? activeQuiz.questions.reduce(
        (acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0),
        0,
      )
    : 0;

  const addQuestionToQuiz = () => {
    if (!newQuestion.question || newQuestion.options.some((o) => !o)) return;
    setNewQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, { ...newQuestion, id: `q-${Date.now()}` }],
    }));
    setNewQuestion({
      question: "",
      options: ["", "", "", ""],
      correctIndex: 0,
      explanation: "",
    });
  };

  const removeQuestion = (idx) => {
    setNewQuiz((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx),
    }));
  };

  const saveNewQuiz = () => {
    if (!newQuiz.title || !newQuiz.subjectId || newQuiz.questions.length === 0)
      return;
    addQuiz(newQuiz);
    setNewQuiz({ subjectId: "", title: "", questions: [] });
    setShowCreate(false);
    setView("list");
  };

  const handleDeleteQuiz = (id) => {
    deleteQuiz(id);
  };

  const getSubjectName = (id) =>
    subjects.find((s) => s.id === id)?.name || "Unknown";

  if (view === "taking" && activeQuiz) {
    const q = activeQuiz.questions[currentQ];
    const progress = ((currentQ + 1) / activeQuiz.questions.length) * 100;

    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setView("list")}
              className="flex items-center gap-1 text-gray-400 hover:text-indigo-500 transition-colors"
            >
              <ArrowLeft size={18} /> Back to Quizzes
            </button>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock size={16} />
              <span className="font-mono text-sm">{formatTime(elapsed)}</span>
            </div>
          </div>

          <div className="w-full bg-border rounded-full h-2 mb-2">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-gray-400 text-sm mb-6">
            Question {currentQ + 1} of {activeQuiz.questions.length}
          </p>

          <div className="bg-white dark:bg-bg-card rounded-2xl p-4 sm:p-6 border border-border mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {q.question}
            </h2>
            <div className="space-y-3">
              {q.options.map((opt, oIdx) => {
                const isSelected = answers[currentQ] === oIdx;
                const isCorrect = q.correctIndex === oIdx;
                let borderClass = "border-border";
                let bgClass = "bg-white";
                if (submitted) {
                  if (isCorrect) {
                    borderClass = "border-emerald-300";
                    bgClass = "bg-emerald-50";
                  } else if (isSelected && !isCorrect) {
                    borderClass = "border-red-300";
                    bgClass = "bg-red-50";
                  }
                } else if (isSelected) {
                  borderClass = "border-indigo-500";
                  bgClass = "bg-indigo-500";
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => selectAnswer(currentQ, oIdx)}
                    disabled={submitted}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${borderClass} ${bgClass} ${!submitted ? "hover:bg-gray-50 cursor-pointer" : "cursor-default"}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 ${isSelected && !submitted ? "bg-white text-indigo-500" : isSelected && submitted ? "bg-white/20 text-white" : "bg-gray-50 text-gray-400"}`}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span
                        className={
                          isSelected && !submitted
                            ? "text-white"
                            : "text-gray-900"
                        }
                      >
                        {opt}
                      </span>
                      {submitted && isCorrect && (
                        <CheckCircle2
                          size={18}
                          className="text-emerald-500 ml-auto"
                        />
                      )}
                      {submitted && isSelected && !isCorrect && (
                        <XCircle size={18} className="text-red-500 ml-auto" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            {submitted && q.explanation && (
              <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-border">
                <p className="text-gray-400 text-sm">{q.explanation}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentQ((c) => c - 1)}
              disabled={currentQ === 0}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white dark:bg-bg-card border border-border text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            {currentQ === activeQuiz.questions.length - 1 && !submitted ? (
              <button
                onClick={submitQuiz}
                className="flex items-center gap-1 px-6 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-colors text-sm font-medium"
              >
                <Trophy size={16} /> Submit
              </button>
            ) : (
              <button
                onClick={() => setCurrentQ((c) => c + 1)}
                disabled={currentQ === activeQuiz.questions.length - 1}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white dark:bg-bg-card border border-border text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
              >
                Next <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === "results" && activeQuiz) {
    const getGrade = (pct) => {
      if (pct >= 90)
        return { label: "A+", color: "bg-emerald-100 text-emerald-700" };
      if (pct >= 80)
        return { label: "A", color: "bg-emerald-100 text-emerald-700" };
      if (pct >= 70)
        return { label: "B", color: "bg-indigo-50 text-indigo-500" };
      if (pct >= 60)
        return { label: "C", color: "bg-amber-100 text-amber-700" };
      return { label: "D", color: "bg-red-100 text-red-700" };
    };
    const grade = getGrade(accuracy);

    return (
      <div className="space-y-6">
        <div>
          <div className="bg-white dark:bg-bg-card rounded-2xl p-8 border border-border text-center mb-6">
            <Trophy size={48} className="text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Quiz Complete!
            </h2>
            <div className="text-5xl font-bold text-indigo-500 mb-2">
              {score}/{activeQuiz.questions.length}
            </div>
            <p className="text-gray-400 text-lg">{accuracy}% Accuracy</p>
            <div className="mt-3">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${grade.color}`}
              >
                Grade: {grade.label}
              </span>
            </div>
            <p className="text-gray-300 text-sm mt-2">
              Time: {formatTime(elapsed)}
            </p>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Review Answers
          </h3>
          <div className="space-y-4 mb-6">
            {activeQuiz.questions.map((q, i) => {
              const isCorrect = answers[i] === q.correctIndex;
              return (
                <div
                  key={q.id}
                  className={`bg-white dark:bg-bg-card rounded-2xl p-5 border ${isCorrect ? "border-emerald-200" : "border-red-200"}`}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle2
                        size={20}
                        className="text-emerald-500 mt-0.5 shrink-0"
                      />
                    ) : (
                      <XCircle
                        size={20}
                        className="text-red-500 mt-0.5 shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-2">
                        {q.question}
                      </p>
                      {!isCorrect && (
                        <div className="text-sm space-y-1">
                          <p className="text-red-500">
                            Your answer:{" "}
                            {q.options[answers[i]] || "Not answered"}
                          </p>
                          <p className="text-emerald-500">
                            Correct: {q.options[q.correctIndex]}
                          </p>
                        </div>
                      )}
                      {q.explanation && (
                        <p className="text-gray-400 text-sm mt-2">
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => startQuiz(activeQuiz)}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-colors text-sm font-medium"
            >
              <RotateCcw size={16} /> Retake
            </button>
            <button
              onClick={() => {
                setView("list");
                setActiveQuiz(null);
              }}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white dark:bg-bg-card border border-border text-gray-900 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showCreate) {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Create Quiz
            </h1>
            <button
              onClick={() => {
                setShowCreate(false);
                setView("list");
              }}
              className="flex items-center gap-1 text-gray-400 hover:text-indigo-500 transition-colors text-sm"
            >
              <ArrowLeft size={16} /> Cancel
            </button>
          </div>

          <div className="bg-white dark:bg-bg-card rounded-2xl p-4 sm:p-6 border border-border mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Quiz Title
                </label>
                <input
                  type="text"
                  value={newQuiz.title}
                  onChange={(e) =>
                    setNewQuiz((p) => ({ ...p, title: e.target.value }))
                  }
                  className="w-full bg-gray-50 border border-border rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Enter quiz title"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Subject
                </label>
                <select
                  value={newQuiz.subjectId}
                  onChange={(e) =>
                    setNewQuiz((p) => ({ ...p, subjectId: e.target.value }))
                  }
                  className="w-full bg-gray-50 border border-border rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                >
                  <option value="">Select subject</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-bg-card rounded-2xl p-4 sm:p-6 border border-border mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add Question
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Question
                </label>
                <input
                  type="text"
                  value={newQuestion.question}
                  onChange={(e) =>
                    setNewQuestion((p) => ({ ...p, question: e.target.value }))
                  }
                  className="w-full bg-gray-50 border border-border rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Enter question"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {newQuestion.options.map((opt, i) => (
                  <div key={i}>
                    <label className="block text-sm text-gray-400 mb-1">
                      Option {String.fromCharCode(65 + i)}
                    </label>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const opts = [...newQuestion.options];
                        opts[i] = e.target.value;
                        setNewQuestion((p) => ({ ...p, options: opts }));
                      }}
                      className="w-full bg-gray-50 border border-border rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Correct Answer
                  </label>
                  <select
                    value={newQuestion.correctIndex}
                    onChange={(e) =>
                      setNewQuestion((p) => ({
                        ...p,
                        correctIndex: parseInt(e.target.value),
                      }))
                    }
                    className="w-full bg-gray-50 border border-border rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  >
                    {newQuestion.options.map((_, i) => (
                      <option key={i} value={i}>
                        {String.fromCharCode(65 + i)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Explanation (optional)
                  </label>
                  <input
                    type="text"
                    value={newQuestion.explanation}
                    onChange={(e) =>
                      setNewQuestion((p) => ({
                        ...p,
                        explanation: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-50 border border-border rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Optional explanation"
                  />
                </div>
              </div>
              <button
                onClick={addQuestionToQuiz}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-all text-sm font-medium"
              >
                <Plus size={16} /> Add Question
              </button>
            </div>
          </div>

          {newQuiz.questions.length > 0 && (
            <div className="bg-white dark:bg-bg-card rounded-2xl p-4 sm:p-6 border border-border mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Questions ({newQuiz.questions.length})
              </h3>
              <div className="space-y-3">
                {newQuiz.questions.map((q, i) => (
                  <div
                    key={q.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-border"
                  >
                    <span className="text-gray-400 text-sm w-6">{i + 1}.</span>
                    <span className="text-gray-900 text-sm flex-1">
                      {q.question}
                    </span>
                    <button
                      onClick={() => removeQuestion(i)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={saveNewQuiz}
            disabled={
              !newQuiz.title ||
              !newQuiz.subjectId ||
              newQuiz.questions.length === 0
            }
            className="w-full py-3 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col sm:flex-row items-start justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
              <Brain size={22} className="text-indigo-500" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Quiz Engine
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Test your knowledge across subjects
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-2xl font-medium text-sm transition-all hover:shadow-lg active:scale-[0.98]"
          >
            <Plus size={16} /> Create Quiz
          </button>
        </div>

        {quizzes.length === 0 ? (
          <div className="bg-white dark:bg-bg-card rounded-2xl p-12 border border-border text-center">
            <Brain size={48} className="text-indigo-300 mx-auto mb-4" />
            <p className="text-gray-400">
              No quizzes yet. Create your first one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => {
              const lastResult = quiz.results[quiz.results.length - 1];
              return (
                <div
                  key={quiz.id}
                  className="bg-white dark:bg-bg-card rounded-2xl p-6 border border-border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {quiz.title}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-500 font-medium">
                        {getSubjectName(quiz.subjectId)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    {quiz.questions.length} question
                    {quiz.questions.length !== 1 ? "s" : ""}
                  </p>
                  {lastResult && (
                    <div className="flex items-center gap-2 mb-3">
                      <Eye size={14} className="text-gray-300" />
                      <p className="text-gray-400 text-sm">
                        Last score:{" "}
                        <span className="text-gray-900 font-medium">
                          {lastResult.score}/{lastResult.total}
                        </span>
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => startQuiz(quiz)}
                    className="w-full py-2 rounded-xl bg-gray-50 text-indigo-500 hover:bg-indigo-50 transition-colors text-sm font-medium"
                  >
                    Take Quiz
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizEngine;
