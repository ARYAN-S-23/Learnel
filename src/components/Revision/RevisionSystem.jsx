import React, { useState, useMemo } from "react";
import useStore from "../../store/useStore";
import {
  RefreshCw,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

const REVISION_INTERVALS = [1, 3, 7, 14, 30];

const RevisionSystem = () => {
  const { topics, subjects, updateTopic } = useStore();
  const [activeTab, setActiveTab] = useState("due");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const revisionData = useMemo(() => {
    return (topics || [])
      .filter(
        (t) =>
          t.status === "learning" ||
          t.status === "practicing" ||
          t.status === "mastered",
      )
      .map((topic) => {
        const created = new Date(topic.createdAt);
        created.setHours(0, 0, 0, 0);
        const daysSinceCreation = Math.floor(
          (today - created) / (1000 * 60 * 60 * 24),
        );

        const lastRevised = topic.lastRevised
          ? new Date(topic.lastRevised)
          : created;
        lastRevised.setHours(0, 0, 0, 0);
        const daysSinceRevision = Math.floor(
          (today - lastRevised) / (1000 * 60 * 60 * 24),
        );

        const nextRevisionDays = REVISION_INTERVALS.find((interval) => {
          const daysUntil = interval - daysSinceRevision;
          return daysUntil > 0;
        });

        const isDue =
          nextRevisionDays !== undefined &&
          daysSinceRevision >= (topic.revisionIndex || 0) * 3;
        const nextDate = new Date(lastRevised);
        if (nextRevisionDays)
          nextDate.setDate(nextDate.getDate() + nextRevisionDays);

        const overdue = nextDate < today;
        const urgency = overdue
          ? "overdue"
          : nextRevisionDays <= 3
            ? "soon"
            : "scheduled";

        return {
          ...topic,
          daysSinceRevision,
          nextRevisionDays: nextRevisionDays || 30,
          nextDate: nextDate.toISOString().split("T")[0],
          isDue: overdue || daysSinceRevision >= (topic.revisionIndex || 0) * 2,
          urgency,
          revisionCount: topic.revisionIndex || 0,
        };
      })
      .sort((a, b) => {
        if (a.urgency === "overdue" && b.urgency !== "overdue") return -1;
        if (b.urgency === "overdue" && a.urgency !== "overdue") return 1;
        if (a.urgency === "soon" && b.urgency !== "soon") return -1;
        if (b.urgency === "soon" && a.urgency !== "soon") return 1;
        return a.daysSinceRevision - b.daysSinceRevision;
      });
  }, [topics]);

  const dueTopics = revisionData.filter((t) => t.isDue);
  const upcomingTopics = revisionData.filter((t) => !t.isDue);
  const overdueTopics = revisionData.filter((t) => t.urgency === "overdue");

  const getSubjectName = (id) =>
    (subjects || []).find((s) => s.id === id)?.name || "Unknown";

  const markRevised = (topicId) => {
    const topic = (topics || []).find((t) => t.id === topicId);
    if (topic) {
      updateTopic(topicId, {
        lastRevised: new Date().toISOString(),
        revisionIndex: (topic.revisionIndex || 0) + 1,
      });
    }
  };

  const statusColors = {
    not_started: "bg-gray-100 text-gray-600",
    learning: "bg-blue-100 text-blue-600",
    practicing: "bg-amber-100 text-amber-600",
    mastered: "bg-emerald-100 text-emerald-600",
  };

  const urgencyBadge = (urgency) => {
    const map = {
      overdue: { bg: "bg-red-100 text-red-600", label: "Overdue" },
      soon: { bg: "bg-amber-100 text-amber-600", label: "Due Soon" },
      scheduled: { bg: "bg-indigo-100 text-indigo-500", label: "Scheduled" },
    };
    const s = map[urgency] || map.scheduled;
    return (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.bg}`}>
        {s.label}
      </span>
    );
  };

  const tabs = [
    { key: "due", label: "Due Now", count: dueTopics.length },
    { key: "upcoming", label: "Upcoming", count: upcomingTopics.length },
    { key: "all", label: "All Topics", count: revisionData.length },
  ];

  const renderTopicCard = (topic, showMarkRevised = true) => (
    <div
      key={topic.id}
      className="bg-white dark:bg-bg-card rounded-2xl p-4 sm:p-4 border border-border hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 font-medium truncate">{topic.title}</h3>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-500">
              {getSubjectName(topic.subjectId)}
            </span>
            {urgencyBadge(topic.urgency)}
            {topic.status && (
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[topic.status] || "bg-gray-100 text-gray-600"}`}
              >
                {topic.status.replace("_", " ")}
              </span>
            )}
          </div>
        </div>
        {showMarkRevised && (
          <button
            onClick={() => markRevised(topic.id)}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-colors text-sm font-medium shrink-0 ml-0 mt-2 sm:mt-0 sm:ml-3"
          >
            <CheckCircle2 size={14} /> Mark Revised
          </button>
        )}
        {!showMarkRevised && (
          <div className="flex items-center gap-1 text-gray-400 shrink-0 ml-3 text-sm">
            <Clock size={14} />
            <span className="text-xs">{topic.nextDate}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <RefreshCw size={20} className="text-indigo-500" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Revision Schedule
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Spaced repetition system for effective learning
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? "bg-indigo-500 text-white shadow-sm" : "bg-white text-gray-500 border border-border hover:border-slate-300 hover:text-gray-900"}`}
            >
              {tab.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-white/20 text-white" : "bg-gray-50 text-gray-400"}`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {activeTab === "due" && (
          <div>
            {overdueTopics.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-red-500 mb-3 flex items-center gap-2 uppercase tracking-wider">
                  <AlertCircle size={16} /> Overdue ({overdueTopics.length})
                </h2>
                <div className="space-y-3">
                  {overdueTopics.map((topic) => renderTopicCard(topic))}
                </div>
              </div>
            )}
            {dueTopics.filter((t) => t.urgency !== "overdue").length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-amber-500 mb-3 flex items-center gap-2 uppercase tracking-wider">
                  <Clock size={16} /> Due for Revision (
                  {dueTopics.filter((t) => t.urgency !== "overdue").length})
                </h2>
                <div className="space-y-3">
                  {dueTopics
                    .filter((t) => t.urgency !== "overdue")
                    .map((topic) => renderTopicCard(topic))}
                </div>
              </div>
            )}
            {dueTopics.length === 0 && (
              <div className="bg-white dark:bg-bg-card rounded-2xl p-12 border border-border text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                </div>
                <p className="text-gray-600 font-medium">All caught up!</p>
                <p className="text-gray-400 text-sm mt-1">
                  No topics need revision right now
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "upcoming" && (
          <div>
            {upcomingTopics.length > 0 ? (
              <div className="space-y-3">
                {upcomingTopics.map((topic) => renderTopicCard(topic, false))}
              </div>
            ) : (
              <div className="bg-white dark:bg-bg-card rounded-2xl p-12 border border-border text-center">
                <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Calendar size={32} className="text-gray-300" />
                </div>
                <p className="text-gray-600 font-medium">
                  No upcoming revisions
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  All topics are either due or completed
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "all" && (
          <div>
            {revisionData.length > 0 ? (
              <div className="space-y-3">
                {revisionData.map((topic) => renderTopicCard(topic, false))}
              </div>
            ) : (
              <div className="bg-white dark:bg-bg-card rounded-2xl p-12 border border-border text-center">
                <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <RefreshCw size={32} className="text-gray-300" />
                </div>
                <p className="text-gray-600 font-medium">
                  No topics for revision
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Start learning topics to build your revision schedule
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RevisionSystem;
