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
            <div className="w-10 h-10 rounded-xl bg-[#e8e9f8] flex items-center justify-center">
              <Clock size={22} className="text-[#5b5fc7]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1e293b]">Study Timer</h1>
              <p className="text-[#64748b] text-sm mt-1">
                Pomodoro-style focused study sessions
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-[#eef1f6] mb-6">
          <div className="flex items-center justify-between mb-6">
            <label className="text-sm text-[#64748b] font-medium">
              Subject
            </label>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-xl transition-all ${showSettings ? "bg-[#e8e9f8] text-[#5b5fc7]" : "text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#f0f2f8]"}`}
            >
              <Settings size={16} />
            </button>
          </div>

          {subjects.length === 0 ? (
            <div className="mb-6 p-4 rounded-xl bg-[#f8f9fd] border border-[#eef1f6] text-center">
              <BookOpen size={24} className="text-[#c5c7e8] mx-auto mb-2" />
              <p className="text-[#64748b] text-sm">
                Create a subject first to start tracking study sessions.
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <div className="relative">
                <BookOpen
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                />
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-[#f8f9fd] border border-[#eef1f6] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1e293b] focus:ring-2 focus:ring-[#5b5fc7]/20 focus:border-[#5b5fc7] outline-none transition-all"
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
            <div className="mb-6 p-4 rounded-xl bg-[#f8f9fd] border border-[#eef1f6] space-y-3">
              <div className="flex items-center gap-4">
                <label className="text-sm text-[#64748b] w-28 font-medium">
                  Work (min)
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={workMinutes}
                  onChange={(e) => handleWorkMinutesChange(e.target.value)}
                  className="flex-1 bg-white border border-[#eef1f6] rounded-xl px-3 py-1.5 text-sm text-[#1e293b] focus:ring-2 focus:ring-[#5b5fc7]/20 focus:border-[#5b5fc7] outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="text-sm text-[#64748b] w-28 font-medium">
                  Break (min)
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={breakMinutes}
                  onChange={(e) => handleBreakMinutesChange(e.target.value)}
                  className="flex-1 bg-white border border-[#eef1f6] rounded-xl px-3 py-1.5 text-sm text-[#1e293b] focus:ring-2 focus:ring-[#5b5fc7]/20 focus:border-[#5b5fc7] outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col items-center mb-6">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="#eef1f6"
                  strokeWidth="8"
                />
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke={mode === "work" ? "#5b5fc7" : "#10b981"}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-[#1e293b] font-mono">
                  {formatTime(timeLeft)}
                </span>
                <span
                  className={`text-sm mt-1 font-medium ${mode === "work" ? "text-[#5b5fc7]" : "text-emerald-500"}`}
                >
                  {mode === "work" ? "Study" : "Break"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={reset}
              className="w-12 h-12 rounded-xl bg-[#f0f2f8] border border-[#eef1f6] flex items-center justify-center text-[#1e293b] hover:bg-[#e8e9f8] transition-all"
            >
              <RotateCcw size={20} />
            </button>
            <button
              onClick={toggle}
              disabled={subjects.length === 0}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all ${
                isRunning
                  ? "bg-[#f0c674] hover:bg-[#e5b94e]"
                  : "bg-emerald-400 hover:bg-emerald-500"
              } disabled:opacity-40`}
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

        <div className="bg-white rounded-2xl p-6 border border-[#eef1f6]">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-xl bg-[#f8f9fd] border border-[#eef1f6]">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle2 size={18} className="text-[#5b5fc7]" />
                <p className="text-2xl font-bold text-[#5b5fc7]">
                  {sessionsCompleted}
                </p>
              </div>
              <p className="text-[#64748b] text-sm">Sessions Done</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-[#f8f9fd] border border-[#eef1f6]">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock size={18} className="text-emerald-500" />
                <p className="text-2xl font-bold text-emerald-500">
                  {formatTime(elapsed)}
                </p>
              </div>
              <p className="text-[#64748b] text-sm">Total Time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyTimer;
