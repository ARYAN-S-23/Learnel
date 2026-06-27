import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { common, createLowlight } from "lowlight";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  FileCode,
  Quote,
  Link2,
  ImageIcon,
  ListChecks,
  Undo,
  Redo,
  Save,
  ArrowLeft,
} from "lucide-react";
import useStore from "../../store/useStore";

const lowlight = createLowlight(common);

const MenuBar = ({ editor }) => {
  const [saveStatus, setSaveStatus] = useState("saved");

  if (!editor) return null;

  const Button = ({ onClick, isActive, children, title }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-lg transition-colors ${
        isActive
          ? "bg-indigo-50 text-indigo-600"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
      }`}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-6 bg-[#eef1f6] mx-1" />;

  return (
    <div className="flex items-center flex-wrap gap-0.5 px-4 py-3 bg-[#f8f9fd] border-b border-[#eef1f6] rounded-t-2xl">
      <div className="flex items-center gap-0.5">
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold size={16} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic size={16} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough size={16} />
        </Button>
      </div>

      <Divider />

      <div className="flex items-center gap-0.5">
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </Button>
      </div>

      <Divider />

      <div className="flex items-center gap-0.5">
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List size={16} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered size={16} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive("taskList")}
          title="Task List"
        >
          <ListChecks size={16} />
        </Button>
      </div>

      <Divider />

      <div className="flex items-center gap-0.5">
        <Button
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="Inline Code"
        >
          <Code size={16} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <FileCode size={16} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote size={16} />
        </Button>
        <Button
          onClick={() => {
            const url = window.prompt("Enter URL");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          isActive={editor.isActive("link")}
          title="Link"
        >
          <Link2 size={16} />
        </Button>
        <Button
          onClick={() => {
            const url = window.prompt("Enter image URL");
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          title="Image"
        >
          <ImageIcon size={16} />
        </Button>
      </div>

      <Divider />

      <div className="flex items-center gap-0.5">
        <Button
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo size={16} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo size={16} />
        </Button>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {saveStatus === "unsaved" && (
          <span className="text-xs text-amber-500 font-medium">
            Unsaved changes
          </span>
        )}
        <button
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-medium text-sm transition-all ${
            saveStatus === "saved"
              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
              : saveStatus === "saving"
                ? "bg-slate-400 text-white cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-600 text-white"
          }`}
          disabled={saveStatus === "saving"}
        >
          <Save size={14} />
          {saveStatus === "saved"
            ? "Saved"
            : saveStatus === "saving"
              ? "Saving..."
              : "Save"}
        </button>
      </div>
    </div>
  );
};

export default function NotesEditor() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { topics, updateTopic } = useStore();
  const topic = topics.find((t) => t.id === topicId);

  const [title, setTitle] = useState(topic?.name || "");
  const [saveStatus, setSaveStatus] = useState("saved");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: "Start writing your notes...",
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: topic?.notes || "",
    onUpdate: ({ editor }) => {
      setSaveStatus("unsaved");
    },
  });

  const handleSave = useCallback(() => {
    if (!editor || !topic) return;
    setSaveStatus("saving");
    updateTopic(topic.id, {
      notes: editor.getHTML(),
      name: title || topic.name,
    });
    setTimeout(() => setSaveStatus("saved"), 500);
  }, [editor, topic, title, updateTopic]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  if (!topic) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 text-lg">Topic not found</p>
          <button
            onClick={() => navigate("/topics")}
            className="mt-4 text-indigo-500 hover:text-indigo-600 font-medium"
          >
            Back to topics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate(`/topics/${topicId}`)}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm font-medium mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to topic
        </button>

        <div className="bg-white rounded-2xl border border-[#eef1f6] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#eef1f6]">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold text-[#1e293b] w-full bg-transparent outline-none placeholder:text-slate-300"
              placeholder="Untitled Notes"
            />
            <p className="text-sm text-[#64748b] mt-1">{topic.name}</p>
          </div>

          <MenuBar editor={editor} />

          <div className="p-6">
            <EditorContent
              editor={editor}
              className="prose prose-slate max-w-none min-h-[400px] focus:outline-none [&_.ProseEditor]:min-h-[400px] [&_.ProseEditor]:outline-none [&_.ProseEditor_p.is-editor-empty:first-child::before]:text-slate-400 [&_.ProseEditor_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseEditor_p.is-editor-empty:first-child::before]:float-left [&_.ProseEditor_p.is-editor-empty:first-child::before]:pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
