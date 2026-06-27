import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useStore from '../../store/useStore';
import { useToast } from '../UI/Toast';
import { useConfirm } from '../UI/ConfirmDialog';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  ExternalLink,
  FileText,
  Video,
  Link2,
  Book,
  Plus,
  ChevronDown,
} from 'lucide-react';

const STATUS_OPTIONS = [
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

const RESOURCE_ICONS = {
  link: Link2,
  video: Video,
  article: FileText,
  book: Book,
};

const TopicDetail = () => {
  const { topicId } = useParams();
  const toast = useToast();
  const confirm = useConfirm();
  const topic = useStore((s) => s.topics.find((t) => t.id === topicId));
  const subject = useStore((s) => s.subjects.find((sub) => sub.id === topic?.subjectId));
  const updateTopic = useStore((s) => s.updateTopic);
  const addResource = useStore((s) => s.addResource);
  const deleteResource = useStore((s) => s.deleteResource);

  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourceType, setResourceType] = useState('link');
  const [showResourceForm, setShowResourceForm] = useState(false);

  if (!topic) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center py-20">
          <p className="text-[#64748b] text-lg">Topic not found.</p>
          <Link to="/subjects" className="text-indigo-500 hover:text-indigo-600 mt-4 inline-block font-medium">
            Back to Subjects
          </Link>
        </div>
      </div>
    );
  }

  const handleStatusChange = (e) => {
    updateTopic(topicId, { status: e.target.value });
  };

  const handleAddResource = (e) => {
    e.preventDefault();
    if (!resourceTitle.trim() || !resourceUrl.trim()) return;
    addResource(topicId, {
      title: resourceTitle.trim(),
      url: resourceUrl.trim(),
      type: resourceType,
    });
    setResourceTitle('');
    setResourceUrl('');
    setResourceType('link');
    setShowResourceForm(false);
    toast.success('Resource added');
  };

  const handleDeleteResource = async (resourceId) => {
    const ok = await confirm({ title: 'Delete Resource', message: 'Delete this resource?' });
    if (ok) {
      deleteResource(topicId, resourceId);
      toast.success('Resource deleted');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={subject ? `/subjects/${subject.id}` : '/subjects'}
          className="text-[#64748b] hover:text-[#1e293b] text-sm mb-6 inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to {subject?.name || 'Subjects'}
        </Link>

        <div className="bg-white rounded-2xl border border-[#eef1f6] p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#1e293b]">{topic.title}</h1>
              {topic.description && (
                <p className="text-[#64748b] mt-1">{topic.description}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={topic.status}
                  onChange={handleStatusChange}
                  className={`appearance-none rounded-xl px-4 py-2 pr-10 text-sm font-medium cursor-pointer border border-[#eef1f6] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors ${STATUS_STYLES[topic.status]}`}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
              </div>
              <Link
                to={`/notes/${topicId}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#64748b] hover:text-[#1e293b] border border-[#eef1f6] rounded-xl px-4 py-2 hover:bg-[#f8f9fd] transition-colors"
              >
                <Edit2 size={14} />
                Edit Notes
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-[#eef1f6] p-6">
              <h2 className="text-lg font-semibold text-[#1e293b] mb-4">Notes</h2>
              {topic.notes ? (
                <div
                  className="prose prose-sm max-w-none text-[#1e293b] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: topic.notes }}
                />
              ) : (
                <div className="text-center py-10">
                  <p className="text-[#94a3b8] mb-3">No notes yet</p>
                  <Link
                    to={`/notes/${topicId}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-500 hover:text-indigo-600"
                  >
                    <Plus size={16} />
                    Write your first note
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-[#eef1f6] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#1e293b]">Resources</h2>
                <button
                  onClick={() => setShowResourceForm(!showResourceForm)}
                  className="text-sm font-medium text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  {showResourceForm ? 'Cancel' : '+ Add Resource'}
                </button>
              </div>

              {showResourceForm && (
                <form onSubmit={handleAddResource} className="bg-[#f8f9fd] rounded-xl p-4 mb-4 border border-[#eef1f6]">
                  <input
                    type="text"
                    value={resourceTitle}
                    onChange={(e) => setResourceTitle(e.target.value)}
                    placeholder="Resource title"
                    className="w-full bg-white border border-[#eef1f6] rounded-xl px-4 py-2.5 text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 mb-3 text-sm"
                    autoFocus
                  />
                  <input
                    type="url"
                    value={resourceUrl}
                    onChange={(e) => setResourceUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-white border border-[#eef1f6] rounded-xl px-4 py-2.5 text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 mb-3 text-sm"
                  />
                  <select
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value)}
                    className="w-full bg-white border border-[#eef1f6] rounded-xl px-4 py-2.5 text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 mb-3 text-sm"
                  >
                    <option value="link">Link</option>
                    <option value="video">Video</option>
                    <option value="article">Article</option>
                    <option value="book">Book</option>
                  </select>
                  <button
                    type="submit"
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  >
                    Add Resource
                  </button>
                </form>
              )}

              {(!topic.resources || topic.resources.length === 0) && !showResourceForm ? (
                <p className="text-[#94a3b8] text-sm">No resources added yet.</p>
              ) : (
                <div className="space-y-2">
                  {(topic.resources || []).map((res) => {
                    const Icon = RESOURCE_ICONS[res.type] || Link2;
                    return (
                      <div
                        key={res.id}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f8f9fd] transition-colors group border border-transparent hover:border-[#eef1f6]"
                      >
                        <Icon size={16} className="text-[#94a3b8] group-hover:text-indigo-500 shrink-0" />
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1e293b] text-sm group-hover:text-indigo-500 transition-colors truncate flex-1"
                        >
                          {res.title}
                        </a>
                        <ExternalLink size={12} className="text-[#94a3b8] group-hover:text-[#64748b] shrink-0" />
                        <button
                          onClick={() => handleDeleteResource(res.id)}
                          className="p-1 text-[#94a3b8] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#eef1f6] p-6">
              <h2 className="text-lg font-semibold text-[#1e293b] mb-4">Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Subject</span>
                  <span className="text-[#1e293b] font-medium">{subject?.name || '—'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748b]">Status</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[topic.status]}`}>
                    {STATUS_OPTIONS.find((o) => o.value === topic.status)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Resources</span>
                  <span className="text-[#1e293b] font-medium">{topic.resources?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Created</span>
                  <span className="text-[#1e293b] font-medium">
                    {topic.createdAt ? new Date(topic.createdAt).toLocaleDateString() : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;
