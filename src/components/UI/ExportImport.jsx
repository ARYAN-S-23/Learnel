import { useState } from "react";
import { Download, Upload, FileJson, Check } from "lucide-react";
import useStore from "../../store/useStore";
import { useToast } from "./Toast";

export default function ExportImport() {
  const toast = useToast();
  const [showImport, setShowImport] = useState(false);

  const handleExport = () => {
    const data = {
      version: "v2",
      exportedAt: new Date().toISOString(),
      data: {
        subjects: useStore.getState().subjects,
        topics: useStore.getState().topics,
        tasks: useStore.getState().tasks,
        studySessions: useStore.getState().studySessions,
        studyPlans: useStore.getState().studyPlans,
        goals: useStore.getState().goals,
        quizzes: useStore.getState().quizzes,
        achievements: useStore.getState().achievements,
        streak: useStore.getState().streak,
        lastStudyDate: useStore.getState().lastStudyDate,
        userName: useStore.getState().userName,
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `learnel-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully");
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        const d = imported.data || imported;

        const state = useStore.getState();
        if (d.subjects?.length) state.subjects = d.subjects;
        if (d.topics?.length) state.topics = d.topics;
        if (d.tasks?.length) state.tasks = d.tasks;
        if (d.studySessions?.length) state.studySessions = d.studySessions;
        if (d.studyPlans?.length) state.studyPlans = d.studyPlans;
        if (d.goals?.length) state.goals = d.goals;
        if (d.quizzes?.length) state.quizzes = d.quizzes;
        if (d.achievements?.length) state.achievements = d.achievements;
        if (d.streak !== undefined) state.streak = d.streak;
        if (d.lastStudyDate) state.lastStudyDate = d.lastStudyDate;
        if (d.userName) state.userName = d.userName;

        useStore.setState({
          subjects: d.subjects || [],
          topics: d.topics || [],
          tasks: d.tasks || [],
          studySessions: d.studySessions || [],
          studyPlans: d.studyPlans || [],
          goals: d.goals || [],
          quizzes: d.quizzes || [],
          achievements: d.achievements || state.achievements,
          streak: d.streak ?? 0,
          lastStudyDate: d.lastStudyDate || null,
          userName: d.userName || "Student",
        });

        toast.success("Data imported successfully! Refreshing...");
        setShowImport(false);
        setTimeout(() => window.location.reload(), 1000);
      } catch {
        toast.error("Invalid backup file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-white dark:bg-bg-card border border-border hover:bg-gray-50 text-gray-400 transition-all"
      >
        <Download size={16} />
        Export Data
      </button>
      <button
        onClick={() => setShowImport(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-white dark:bg-bg-card border border-border hover:bg-gray-50 text-gray-400 transition-all"
      >
        <Upload size={16} />
        Import Data
      </button>

      {showImport && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowImport(false)}
          />
          <div className="relative bg-white dark:bg-bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md p-4 sm:p-6 animate-scale-in">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Import Backup
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Select a Learnel backup file (.json) to import your data.
            </p>
            <label className="flex flex-col items-center justify-center w-full h-24 sm:h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-gray-50 transition-all">
              <FileJson size={32} className="text-gray-300 mb-2" />
              <span className="text-sm text-gray-400">
                Click to select file
              </span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <button
              onClick={() => setShowImport(false)}
              className="w-full mt-4 px-4 py-2.5 rounded-xl font-medium text-sm bg-white dark:bg-bg-card border border-border hover:bg-gray-50 text-gray-400 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
