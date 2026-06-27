import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, CheckSquare, BookOpen, FolderOpen, X, ArrowRight, Clock } from 'lucide-react';
import useStore from '../../store/useStore';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { topics, tasks, subjects, searchHistory, addSearchHistory } = useStore();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const results = q.length > 0 ? {
    topics: topics.filter((t) =>
      t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
    ).slice(0, 5),
    tasks: tasks.filter((t) =>
      t.title?.toLowerCase().includes(q)
    ).slice(0, 5),
    subjects: subjects.filter((s) =>
      s.name?.toLowerCase().includes(q)
    ).slice(0, 3),
  } : { topics: [], tasks: [], subjects: [] };

  const hasResults = results.topics.length + results.tasks.length + results.subjects.length > 0;

  const handleNavigate = (path) => {
    if (q) addSearchHistory(q);
    navigate(path);
    onClose();
  };

  const getSubjectName = (id) => subjects.find((s) => s.id === id)?.name || '';

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl border border-[#eef1f6] shadow-2xl w-full max-w-xl animate-scale-in overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#eef1f6]">
          <Search size={18} className="text-[#b2bec3] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, subjects, tasks..."
            className="flex-1 text-sm text-[#2d3436] placeholder-[#b2bec3] outline-none bg-transparent"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-[#b2bec3] bg-[#f0f2f8] rounded-md border border-[#eef1f6]">
            ESC
          </kbd>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-[#f0f2f8] text-[#b2bec3] transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {q.length === 0 ? (
            <div className="p-4">
              {searchHistory.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-[#b2bec3] uppercase tracking-wider mb-2 px-1">Recent Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => setQuery(term)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f0f2f8] text-sm text-[#636e72] hover:bg-[#e4e6ed] transition-colors"
                      >
                        <Clock size={12} />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {searchHistory.length === 0 && (
                <div className="text-center py-8">
                  <Search size={32} className="text-[#eef1f6] mx-auto mb-2" />
                  <p className="text-sm text-[#b2bec3]">Start typing to search</p>
                </div>
              )}
            </div>
          ) : !hasResults ? (
            <div className="text-center py-8">
              <Search size={32} className="text-[#eef1f6] mx-auto mb-2" />
              <p className="text-sm text-[#b2bec3]">No results for "{query}"</p>
            </div>
          ) : (
            <div className="p-2">
              {results.subjects.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-[#b2bec3] uppercase tracking-wider mb-1 px-3">Subjects</p>
                  {results.subjects.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleNavigate(`/subjects/${s.id}`)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#f8f9fd] transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.color + '20' }}>
                        <BookOpen size={14} style={{ color: s.color }} />
                      </div>
                      <span className="text-sm font-medium text-[#2d3436]">{s.name}</span>
                      <ArrowRight size={14} className="ml-auto text-[#b2bec3]" />
                    </button>
                  ))}
                </div>
              )}
              {results.topics.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-[#b2bec3] uppercase tracking-wider mb-1 px-3">Topics</p>
                  {results.topics.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleNavigate(`/topics/${t.id}`)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#f8f9fd] transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <FileText size={14} className="text-indigo-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#2d3436] truncate">{t.title}</p>
                        <p className="text-xs text-[#b2bec3]">{getSubjectName(t.subjectId)}</p>
                      </div>
                      <ArrowRight size={14} className="text-[#b2bec3] shrink-0" />
                    </button>
                  ))}
                </div>
              )}
              {results.tasks.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-[#b2bec3] uppercase tracking-wider mb-1 px-3">Tasks</p>
                  {results.tasks.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleNavigate(`/subjects/${t.subjectId}`)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#f8f9fd] transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                        <CheckSquare size={14} className="text-amber-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#2d3436] truncate">{t.title}</p>
                        <p className="text-xs text-[#b2bec3]">{getSubjectName(t.subjectId)}</p>
                      </div>
                      <ArrowRight size={14} className="text-[#b2bec3] shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
