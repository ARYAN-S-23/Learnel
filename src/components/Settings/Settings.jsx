import { useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Download,
  Upload,
  Trash2,
  Save,
} from "lucide-react";
import useStore from "../../store/useStore";
import { useToast } from "../UI/Toast";
import { useConfirm } from "../UI/ConfirmDialog";
import ExportImport from "../UI/ExportImport";

export default function Settings() {
  const { userName, setUserName, resetAllData } = useStore();
  const [name, setName] = useState(userName || "");
  const toast = useToast();
  const confirm = useConfirm();

  const handleSaveName = () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setUserName(name.trim());
    toast.success("Name updated");
  };

  const handleReset = async () => {
    const ok = await confirm({
      title: "Reset All Data?",
      message:
        "This will permanently delete all your subjects, topics, tasks, quizzes, and progress. This cannot be undone.",
      confirmText: "Reset Everything",
    });
    if (ok) {
      resetAllData();
      toast.success("All data has been reset");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2d3436]">Settings</h1>
        <p className="text-sm text-[#636e72] mt-1">
          Manage your account and app preferences
        </p>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-2xl border border-[#eef1f6] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <User size={18} className="text-indigo-500" />
          </div>
          <div>
            <h2 className="font-semibold text-[#2d3436]">Profile</h2>
            <p className="text-xs text-[#636e72]">Update your display name</p>
          </div>
        </div>
        <div className="flex items-end gap-3 max-w-md">
          <div className="flex-1">
            <label className="block text-sm font-medium text-[#2d3436] mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#eef1f6] bg-[#f8f9fd] text-sm text-[#2d3436] outline-none focus:ring-2 focus:ring-[#5b5fc7]/20 focus:border-[#5b5fc7] transition-all"
              placeholder="Your name"
            />
          </div>
          <button
            onClick={handleSaveName}
            className="inline-flex items-center justify-center gap-2.5 bg-[#5b5fc7] hover:bg-[#4a4eb5] text-white px-7 py-3 rounded-2xl font-medium text-sm transition-all shadow-lg hover:shadow-xl active:scale-[0.98] whitespace-nowrap"
          >
            <Save size={16} />
            Save
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-2xl border border-[#eef1f6] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Download size={18} className="text-emerald-500" />
          </div>
          <div>
            <h2 className="font-semibold text-[#2d3436]">Data Management</h2>
            <p className="text-xs text-[#636e72]">
              Export or import your learning data
            </p>
          </div>
        </div>
        <ExportImport />
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-red-200 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <Trash2 size={18} className="text-red-500" />
          </div>
          <div>
            <h2 className="font-semibold text-[#2d3436]">Danger Zone</h2>
            <p className="text-xs text-[#636e72]">Irreversible actions</p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all"
        >
          <Trash2 size={16} />
          Reset All Data
        </button>
      </div>
    </div>
  );
}
