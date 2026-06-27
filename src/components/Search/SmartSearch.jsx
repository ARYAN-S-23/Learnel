import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import useStore from "../../store/useStore";
import {
  Search,
  FileText,
  CheckSquare,
  BookOpen,
  FolderOpen,
  ArrowRight,
  X,
  Clock,
} from "lucide-react";

const SmartSearch = () => {
  const {
    topics,
    tasks,
    subjects,
    searchHistory,
    addSearchHistory,
    clearSearchHistory,
  } = useStore();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query || !query.trim())
      return { topics: [], tasks: [], resources: [], notes: [] };
    const q = query.toLowerCase();

    const matchedTopics = (topics || [])
      .filter(
        (t) =>
          (t?.title || "").toLowerCase().includes(q) ||
          (t?.description || "").toLowerCase().includes(q) ||
          (t?.notes || "").toLowerCase().includes(q),
      )
      .map((t) => ({
        id: t.id,
        title: t.title || "Untitled Topic",
        snippet:
          t.description ||
          (t.notes || "").replace(/<[^>]*>/g, "").slice(0, 100) ||
          "",
        subjectId: t.subjectId,
        type: "topic",
      }));

    const matchedTasks = (tasks || [])
      .filter((t) => (t?.title || "").toLowerCase().includes(q))
      .map((t) => ({
        id: t.id,
        title: t.title || "Untitled Task",
        snippet: `Due: ${t.dueDate || "No date"} | ${t.completed ? "Completed" : "Pending"}`,
        subjectId: t.subjectId,
        type: "task",
      }));

    const matchedNotes = (topics || []).flatMap((topic) =>
      (topic?.notes || "").toLowerCase().includes(q) && topic.notes
        ? [
            {
              id: `note-${topic.id}`,
              title: `${topic.title || "Untitled"} - Notes`,
              snippet: topic.notes.replace(/<[^>]*>/g, "").slice(0, 100),
              subjectId: topic.subjectId,
              type: "note",
            },
          ]
        : [],
    );

    const matchedResources = [];
    (topics || []).forEach((topic) => {
      (topic?.resources || []).forEach((res) => {
        if ((res?.title || "").toLowerCase().includes(q)) {
          matchedResources.push({
            id: res.id,
            title: res.title || "Untitled Resource",
            snippet: `${(res.type || "link").toUpperCase()} | ${topic.title || "Unknown Topic"}`,
            subjectId: topic.subjectId,
            type: "resource",
            url: res.url,
          });
        }
      });
    });

    return {
      topics: matchedTopics,
      tasks: matchedTasks,
      notes: matchedNotes,
      resources: matchedResources,
    };
  }, [query, topics, tasks]);

  const totalResults =
    results.topics.length +
    results.tasks.length +
    results.resources.length +
    results.notes.length;
  const getSubjectName = (id) =>
    (subjects || []).find((s) => s.id === id)?.name || "Unknown";

  const iconMap = {
    topic: BookOpen,
    task: CheckSquare,
    note: FileText,
    resource: FolderOpen,
  };

  const colorMap = {
    topic: "bg-indigo-100 text-indigo-500",
    task: "bg-purple-100 text-purple-600",
    note: "bg-sky-100 text-sky-600",
    resource: "bg-emerald-100 text-emerald-600",
  };

  const groupLabel = {
    topic: "Topics",
    task: "Tasks",
    note: "Notes",
    resource: "Resources",
  };

  const renderGroup = (type, items) => {
    if (items.length === 0) return null;
    const Icon = iconMap[type];
    const color = colorMap[type];

    return (
      <div key={type} className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
          {groupLabel[type]} ({items.length})
        </h3>
        <div className="space-y-2">
          {items.map((item) => {
            let linkTo = null;
            if (item.type === "topic") linkTo = `/topics/${item.id}`;
            else if (item.type === "task")
              linkTo = `/subjects/${item.subjectId}`;
            else if (item.type === "note") linkTo = `/topics/${item.id}`;

            const content = (
              <div className="bg-white dark:bg-bg-card rounded-2xl p-3 sm:p-4 border border-border hover:shadow-md transition-all flex items-center gap-4 group">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}
                >
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-gray-900 font-medium truncate group-hover:text-indigo-500 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-gray-400 text-sm truncate">
                    {item.snippet}
                  </p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 shrink-0">
                  {getSubjectName(item.subjectId)}
                </span>
                <ArrowRight
                  size={16}
                  className="text-gray-300 shrink-0 group-hover:text-indigo-500 transition-colors"
                />
              </div>
            );

            if (item.type === "resource" && item.url) {
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {content}
                </a>
              );
            }

            if (linkTo) {
              return (
                <Link key={item.id} to={linkTo} className="block">
                  {content}
                </Link>
              );
            }

            return <div key={item.id}>{content}</div>;
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Search size={20} className="text-indigo-500" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Smart Search
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Search across all your topics, tasks, notes, and resources
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-bg-card rounded-2xl border border-border p-4 mb-5">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim()) {
                  addSearchHistory(query.trim());
                }
              }}
              className="w-full bg-gray-50 border border-border rounded-xl pl-12 pr-10 py-3 text-sm sm:text-base text-gray-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="Search topics, tasks, resources..."
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {!query.trim() && searchHistory && searchHistory.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={12} /> Recent Searches
              </h3>
              <button
                onClick={clearSearchHistory}
                className="text-xs text-gray-300 hover:text-red-500 transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((term, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(term)}
                  className="px-4 py-1.5 rounded-full bg-gray-50 text-gray-500 text-sm hover:bg-indigo-100 hover:text-indigo-500 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {query.trim() && (
          <p className="text-gray-400 text-sm mb-4">
            {totalResults} result{totalResults !== 1 ? "s" : ""} found
          </p>
        )}

        {!query.trim() ? (
          <div className="bg-white dark:bg-bg-card rounded-2xl p-12 border border-border text-center">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-indigo-500" />
            </div>
            <p className="text-gray-600 font-medium">
              Search across all your learning data
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Find topics, tasks, notes, and resources instantly
            </p>
          </div>
        ) : totalResults === 0 ? (
          <div className="bg-white dark:bg-bg-card rounded-2xl p-12 border border-border text-center">
            <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-600 font-medium">No results found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try a different search term
            </p>
          </div>
        ) : (
          <>
            {renderGroup("topic", results.topics)}
            {renderGroup("note", results.notes)}
            {renderGroup("task", results.tasks)}
            {renderGroup("resource", results.resources)}
          </>
        )}
      </div>
    </div>
  );
};

export default SmartSearch;
