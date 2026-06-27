import React, { useState, useMemo } from "react";
import useStore from "../../store/useStore";
import {
  FolderOpen,
  FileText,
  Video,
  Link2,
  Book,
  ExternalLink,
  Search,
  Filter,
} from "lucide-react";

const typeIcons = {
  pdf: FileText,
  video: Video,
  link: Link2,
  book: Book,
};

const typeColors = {
  pdf: "text-red-500 bg-red-100",
  video: "text-purple-500 bg-purple-100",
  link: "text-blue-500 bg-blue-100",
  book: "text-emerald-500 bg-emerald-100",
};

const ResourceLibrary = () => {
  const { topics, subjects } = useStore();
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const allResources = useMemo(() => {
    const resources = [];
    (topics || []).forEach((topic) => {
      (topic?.resources || []).forEach((res) => {
        resources.push({
          ...res,
          topicId: topic.id,
          topicTitle: topic.title,
          subjectId: topic.subjectId,
        });
      });
    });
    return resources;
  }, [topics]);

  const filteredResources = useMemo(() => {
    return allResources.filter((res) => {
      const matchesSearch =
        !search ||
        (res?.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (res?.topicTitle || "").toLowerCase().includes(search.toLowerCase());
      const matchesSubject = !filterSubject || res.subjectId === filterSubject;
      const matchesType = !filterType || res.type === filterType;
      return matchesSearch && matchesSubject && matchesType;
    });
  }, [allResources, search, filterSubject, filterType]);

  const getSubjectName = (id) =>
    (subjects || []).find((s) => s.id === id)?.name || "Unknown";

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <FolderOpen size={20} className="text-indigo-500" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Resource Library
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                All your learning resources in one place
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-bg-card rounded-2xl border border-border p-4 mb-5">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-border rounded-xl pl-10 pr-4 py-2.5 text-gray-900 placeholder-slate-400 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="Search resources..."
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${showFilters ? "bg-indigo-100 border-indigo-200 text-indigo-500" : "bg-gray-50 border-border text-gray-500 hover:text-gray-900"}`}
            >
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white dark:bg-bg-card rounded-2xl p-4 border border-border mb-5 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                Subject
              </label>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="w-full bg-gray-50 border border-border rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                <option value="">All Subjects</option>
                {(subjects || []).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-gray-50 border border-border rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                <option value="">All Types</option>
                <option value="pdf">PDF</option>
                <option value="video">Video</option>
                <option value="link">Link</option>
                <option value="book">Book</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterSubject("");
                  setFilterType("");
                }}
                className="px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-400 text-sm">
            {filteredResources.length} resource
            {filteredResources.length !== 1 ? "s" : ""}
          </span>
        </div>

        {filteredResources.length === 0 ? (
          <div className="bg-white dark:bg-bg-card rounded-2xl p-12 border border-border text-center">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
              <FolderOpen size={32} className="text-indigo-500" />
            </div>
            <p className="text-gray-600 font-medium">
              {allResources.length === 0
                ? "No resources added yet"
                : "No resources match your filters"}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {allResources.length === 0
                ? "Add resources to your topics to get started"
                : "Try adjusting your search or filters"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((res) => {
              const Icon = typeIcons[res.type] || Link2;
              const colorClass =
                typeColors[res.type] || "text-gray-500 bg-gray-100";
              return (
                <div
                  key={res.id}
                  className="bg-white dark:bg-bg-card rounded-2xl p-4 sm:p-5 border border-border hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-900 font-medium truncate group-hover:text-indigo-500 transition-colors">
                        {res.title}
                      </h3>
                      <p className="text-gray-400 text-xs truncate">
                        {res.topicTitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-50 text-gray-500">
                      {getSubjectName(res.subjectId)}
                    </span>
                    {res.url && (
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-gray-400 hover:text-indigo-500 text-sm font-medium transition-colors"
                      >
                        Open <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceLibrary;
