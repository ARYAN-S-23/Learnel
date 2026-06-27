import React, { useState, useEffect, useRef } from "react";
import useStore from "../../store/useStore";
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  BookOpen,
  Settings,
  CheckCircle2,
} from "lucide-react";

const StudyTimer = () => {
  const { subjects, addStudySession, checkAchievements } = useStore();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [mode, setMode] = useState("work");
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef(null);

  const workDuration = workMinutes * 60;
  const breakDuration = breakMinutes * 60;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => t - 1);
        setElapsed((e) => e + 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(intervalRef.current);
      if (mode === "work") {
        setSessionsCompleted((s) => s + 1);
        if (selectedSubject) {
          addStudySession({
            subjectId: selectedSubject,
            date: new Date().toISOString().split("T")[0],
            duration: workMinutes,
            type: "study",
          });
          checkAchievements();
        }
        setMode("break");
        setTimeLeft(breakDuration);
      } else {
        setMode("work");
        setTimeLeft(workDuration);
      }
      setIsRunning(false);
    }
    return () => clearInterval(intervalRef.current);
  }, [
    isRunning,
    timeLeft,
    mode,
    selectedSubject,
    addStudySession,
    checkAchievements,
    workMinutes,
    workDuration,
    breakDuration,
  ]);

  const toggle = () => setIsRunning((r) => !r);

  const reset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setMode("work");
    setTimeLeft(workDuration);
    setElapsed(0);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const totalTime = mode === "work" ? workDuration : breakDuration;
  const progress =
    totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleWorkMinutesChange = (val) => {
    const v = Math.max(1, Math.min(120, parseInt(val) || 25));
    setWorkMinutes(v);
    if (mode === "work" && !isRunning) setTimeLeft(v * 60);
  };

  const handleBreakMinutesChange = (val) => {
    const v = Math.max(1, Math.min(60, parseInt(val) || 5));
    setBreakMinutes(v);
    if (mode === "break" && !isRunning) setTimeLeft(v * 60);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
              <Clock size={22} className="text-indigo-500" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Study Timer
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Pomodoro-style focused study sessions
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-bg-card rounded-2xl p-4 sm:p-8 border border-border mb-6">
          <div className="flex items-center justify-between mb-6">
            <label className="text-sm text-gray-400 font-medium">Subject</label>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-xl transition-all ${showSettings ? "bg-indigo-50 text-indigo-500" : "text-gray-300 hover:text-gray-900 hover:bg-gray-50"}`}
            >
              <Settings size={16} />
            </button>
          </div>

          {subjects.length === 0 ? (
            <div className="mb-6 p-4 rounded-xl bg-gray-50 border border-border text-center">
              <BookOpen size={24} className="text-indigo-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">
                Create a subject first to start tracking study sessions.
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <div className="relative">
                <BookOpen
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                />
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-gray-50 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                >
                  <option value="">Choose a subject</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {showSettings && (
            <div className="mb-6 p-4 rounded-xl bg-gray-50 border border-border space-y-3">
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-400 w-28 font-medium">
                  Work (min)
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={workMinutes}
                  onChange={(e) => handleWorkMinutesChange(e.target.value)}
                  className="flex-1 bg-white dark:bg-bg-card border border-border rounded-xl px-3 py-1.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-400 w-28 font-medium">
                  Break (min)
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={breakMinutes}
                  onChange={(e) => handleBreakMinutesChange(e.target.value)}
                  className="flex-1 bg-white dark:bg-bg-card border border-border rounded-xl px-3 py-1.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col items-center mb-6">
            <div className="relative w-40 sm:w-48 h-40 sm:h-48">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="#eaedf2"
                  strokeWidth="8"
                />
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke={mode === "work" ? "#6366f1" : "#10b981"}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-4xl font-bold text-gray-900 font-mono">
                  {formatTime(timeLeft)}
                </span>
                <span
                  className={`text-sm mt-1 font-medium ${mode === "work" ? "text-indigo-500" : "text-emerald-500"}`}
                >
                  {mode === "work" ? "Study" : "Break"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={reset}
              className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/5 border border-border flex items-center justify-center text-gray-900 hover:bg-indigo-50 transition-all"
            >
              <RotateCcw size={20} />
            </button>
            <button
              onClick={toggle}
              disabled={subjects.length === 0}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all ${isRunning ? "bg-[#f0c674] hover:bg-[#e5b94e]" : "bg-emerald-400 hover:bg-emerald-500"} disabled:opacity-40`}
            >
              {isRunning ? (
                <Pause size={28} />
              ) : (
                <Play size={28} className="ml-1" />
              )}
            </button>
            <div className="w-12 h-12" />
          </div>
        </div>

        <div className="bg-white dark:bg-bg-card rounded-2xl p-4 sm:p-6 border border-border">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-xl bg-gray-50 border border-border">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle2 size={18} className="text-indigo-500" />
                <p className="text-2xl font-bold text-indigo-500">
                  {sessionsCompleted}
                </p>
              </div>
              <p className="text-gray-400 text-sm">Sessions Done</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-gray-50 border border-border">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock size={18} className="text-emerald-500" />
                <p className="text-2xl font-bold text-emerald-500">
                  {formatTime(elapsed)}
                </p>
              </div>
              <p className="text-gray-400 text-sm">Total Time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyTimer;
