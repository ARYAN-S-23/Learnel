import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import useStore from "../../store/useStore";
import {
  AlertTriangle,
  TrendingDown,
  ArrowRight,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

const WEAKNESS_SCORES = {
  not_started: 100,
  learning: 60,
  practicing: 30,
  mastered: 0,
};

const STATUS_LABELS = {
  not_started: "Not Started",
  learning: "Learning",
  practicing: "Practicing",
  mastered: "Mastered",
};

const statusColors = {
  not_started: "bg-gray-100 text-gray-600",
  learning: "bg-blue-100 text-blue-600",
  practicing: "bg-amber-100 text-amber-600",
  mastered: "bg-emerald-100 text-emerald-600",
};

const WeakTopics = () => {
  const topics = useStore((s) => s.topics);
  const subjects = useStore((s) => s.subjects);

  const weakTopics = useMemo(() => {
    return (topics || [])
      .filter((t) => t.status === "not_started" || t.status === "learning")
      .map((topic) => {
        const subject = (subjects || []).find((s) => s.id === topic.subjectId);
        const weaknessScore = WEAKNESS_SCORES[topic.status] || 50;

        const recommendations = [];
        if (topic.status === "not_started") {
          recommendations.push("Begin by reading introductory materials");
          recommendations.push("Watch video tutorials on this topic");
        } else if (topic.status === "learning") {
          recommendations.push("Review your notes regularly");
          recommendations.push("Practice with exercises and quizzes");
        }
        recommendations.push("Schedule a study session for this topic");

        return {
          ...topic,
          subjectName: subject?.name || "Unknown",
          weaknessScore,
          recommendations,
        };
      })
      .sort((a, b) => b.weaknessScore - a.weaknessScore);
  }, [topics, subjects]);

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <AlertTriangle size={20} className="text-amber-500" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Weak Areas
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Topics that need more attention
              </p>
            </div>
          </div>
        </div>

        {weakTopics.length === 0 ? (
          <div className="bg-white dark:bg-bg-card rounded-2xl p-12 border border-border text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <p className="text-gray-600 font-medium">No weak topics!</p>
            <p className="text-gray-400 text-sm mt-1">
              Great job! Keep up the progress.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {weakTopics.map((topic) => (
              <div
                key={topic.id}
                className="bg-white dark:bg-bg-card rounded-2xl p-4 sm:p-5 border border-border hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <h3 className="text-gray-900 font-semibold text-base">
                        {topic.title}
                      </h3>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-50 text-gray-500">
                        {topic.subjectName}
                      </span>
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColors[topic.status] || "bg-gray-100 text-gray-600"}`}
                      >
                        {STATUS_LABELS[topic.status] || topic.status}
                      </span>
                    </div>
                    {topic.description && (
                      <p className="text-gray-400 text-sm">
                        {topic.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 shrink-0 ml-4">
                    <TrendingDown size={18} />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-500 text-xs font-medium">
                      Weakness Score
                    </span>
                    <span
                      className={`font-semibold text-xs ${topic.weaknessScore >= 70 ? "text-red-500" : topic.weaknessScore >= 40 ? "text-amber-500" : "text-emerald-500"}`}
                    >
                      {topic.weaknessScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-50 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${topic.weaknessScore >= 70 ? "bg-red-500" : topic.weaknessScore >= 40 ? "bg-amber-500" : "bg-emerald-500"}`}
                      style={{ width: `${topic.weaknessScore}%` }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wider">
                    Recommendations
                  </p>
                  <ul className="space-y-1">
                    {topic.recommendations.map((rec, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-500"
                      >
                        <span className="text-indigo-500 mt-0.5 shrink-0">
                          •
                        </span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={`/topics/${topic.id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-colors text-sm font-medium"
                >
                  <BookOpen size={14} /> Study Now <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeakTopics;
