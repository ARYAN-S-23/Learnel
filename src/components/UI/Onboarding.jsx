import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Target,
  Calendar,
  Brain,
  ChevronRight,
  Check,
  Sparkles,
} from "lucide-react";
import useStore from "../../store/useStore";

const steps = [
  {
    icon: Sparkles,
    title: "Welcome to Learnel",
    description:
      "Your personal learning assistant. Let's set up your first subject to get started.",
    color: "bg-indigo-50 text-indigo-500",
  },
  {
    icon: BookOpen,
    title: "Create Your First Subject",
    description:
      "Add the subjects you're studying. Each subject can have topics, notes, and quizzes.",
    color: "bg-blue-50 text-blue-500",
  },
  {
    icon: Target,
    title: "Track Your Topics",
    description:
      'Break subjects into topics and track your progress from "Not Started" to "Mastered".',
    color: "bg-emerald-50 text-emerald-500",
  },
  {
    icon: Calendar,
    title: "Plan Your Study Time",
    description:
      "Schedule study sessions on the calendar and stay consistent with your streak.",
    color: "bg-amber-50 text-amber-500",
  },
  {
    icon: Brain,
    title: "Test Your Knowledge",
    description:
      "Create quizzes, track your scores, and let the system identify your weak areas.",
    color: "bg-rose-50 text-rose-500",
  },
];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [subjectColor, setSubjectColor] = useState("#6366f1");
  const addSubject = useStore((s) => s.addSubject);

  const colors = [
    "#6366f1",
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#ec4899",
    "#8b5cf6",
    "#06b6d4",
  ];

  const handleAddSubject = () => {
    if (!subjectName.trim()) return;
    addSubject({ name: subjectName.trim(), color: subjectColor, icon: "book" });
    setSubjectName("");
    setShowSubjectForm(false);
    setStep(step + 1);
  };

  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[90] bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-bg-card rounded-2xl border border-border shadow-xl p-4 sm:p-6 lg:p-8"
          >
            {!showSubjectForm ? (
              <>
                <div
                  className={`w-14 h-14 rounded-2xl ${steps[step].color} flex items-center justify-center mb-6`}
                >
                  {(() => {
                    const Icon = steps[step].icon;
                    return <Icon size={26} />;
                  })()}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {steps[step].title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  {steps[step].description}
                </p>

                {step === 1 && !showSubjectForm && (
                  <button
                    onClick={() => setShowSubjectForm(true)}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-2xl font-medium text-sm bg-indigo-500 hover:bg-indigo-600 text-white transition-all mb-4 shadow-lg hover:shadow-xl active:scale-[0.98] whitespace-nowrap"
                  >
                    + Add First Subject
                  </button>
                )}

                {step === 1 && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      {useStore.getState().subjects.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                          <Check size={14} />
                          {useStore.getState().subjects.length} subject(s) added
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  New Subject
                </h3>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="e.g. Mathematics, Physics..."
                  className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 mb-4"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleAddSubject()}
                />
                <div className="flex gap-2 mb-6 flex-wrap">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSubjectColor(c)}
                      className={`w-8 h-8 rounded-full transition-all ${subjectColor === c ? "ring-2 ring-offset-2 ring-indigo-500" : "hover:scale-110"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={() => setShowSubjectForm(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl font-medium text-sm bg-white dark:bg-bg-card border border-border hover:bg-gray-50 text-gray-400 transition-all"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleAddSubject}
                    className="flex-1 px-4 py-2.5 rounded-xl font-medium text-sm bg-indigo-500 hover:bg-indigo-600 text-white transition-all"
                  >
                    Add Subject
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-6 bg-indigo-500" : i < step ? "w-1.5 bg-indigo-500/40" : "w-1.5 bg-[#d1d5db]"}`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => step > 0 && setStep(step - 1)}
            disabled={step === 0}
            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:bg-white disabled:opacity-30 transition-all"
          >
            Back
          </button>
          <button
            onClick={() => {
              if (isLast) {
                onComplete();
              } else {
                setStep(step + 1);
              }
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white transition-all"
          >
            {isLast ? "Get Started" : "Next"}
            {!isLast && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
