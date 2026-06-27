import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { Search, Filter, ChevronRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'not_started', label: 'Not Started' },
  { value: 'learning', label: 'Learning' },
  { value: 'practicing', label: 'Practicing' },
  { value: 'mastered', label: 'Mastered' },
];

const STATUS_STYLES = {
  not_started: 'bg-slate-100 text-slate-600',
  learning: 'bg-blue-50 text-blue-600',
  practicing: 'bg-amber-50 text-amber-600',
  mastered: 'bg-emerald-50 text-emerald-600',
};

const STATUS_DOT = {
  not_started: 'bg-slate-400',
  learning: 'bg-blue-500',
  practicing: 'bg-amber-500',
  mastered: 'bg-emerald-500',
};

const STATUS_ORDER = { not_started: 0, learning: 1, practicing: 2, mastered: 3 };

const TopicList = () => {
  const topics = useStore((s) => s.topics);
  const subjects = useStore((s) => s.subjects);
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const subjectMap = useMemo(() => {
    const map = {};
    subjects.forEach((s) => { map[s.id] = s; });
    return map;
  }, [subjects]);

  const filteredTopics = useMemo(() => {
    let result = [...topics];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
      );
    }

    if (subjectFilter !== 'all') {
      result = result.filter((t) => t.subjectId === subjectFilter);
    }

    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter);
    }

    result.sort((a, b) => (STATUS_ORDER[a.status] ?? 0) - (STATUS_ORDER[b.status] ?? 0));

    return result;
  }, [topics, search, subjectFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1e293b]">All Topics</h1>
          <p className="text-[#64748b] mt-1 text-sm">
            {filteredTopics.length} {filteredTopics.length === 1 ? 'topic' : 'topics'} found
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#eef1f6] p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search topics..."
                className="w-full bg-[#f8f9fd] border border-[#eef1f6] rounded-xl pl-10 pr-4 py-2.5 text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
              />
            </div>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="bg-[#f8f9fd] border border-[#eef1f6] rounded-xl px-3 py-2.5 text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#f8f9fd] border border-[#eef1f6] rounded-xl px-3 py-2.5 text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredTopics.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#eef1f6] text-center py-16">
            <BookOpen size={40} className="mx-auto text-[#94a3b8] mb-4" />
            <p className="text-[#64748b] mb-1">No topics match your filters</p>
            <p className="text-[#94a3b8] text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTopics.map((topic) => {
              const subj = subjectMap[topic.subjectId];
              return (
                <Link
                  key={topic.id}
                  to={`/topics/${topic.id}`}
                  className="block bg-white rounded-2xl border border-[#eef1f6] px-5 py-4 hover:shadow-md hover:border-indigo-200 transition-all group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${STATUS_DOT[topic.status]}`} />
                      <div className="min-w-0">
                        <h3 className="font-medium text-[#1e293b] group-hover:text-indigo-500 transition-colors truncate">
                          {topic.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {subj && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ backgroundColor: `${subj.color}15`, color: subj.color }}
                            >
                              {subj.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[topic.status]}`}>
                        {STATUS_OPTIONS.find((o) => o.value === topic.status)?.label}
                      </span>
                      <ChevronRight size={16} className="text-[#94a3b8] group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicList;
