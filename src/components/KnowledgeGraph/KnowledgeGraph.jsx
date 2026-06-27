import { useCallback } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import useStore from "../../store/useStore";
import { Network } from "lucide-react";

const statusColors = {
  mastered: "#10b981",
  practicing: "#f59e0b",
  learning: "#3b82f6",
  not_started: "#94a3b8",
};

export default function KnowledgeGraph() {
  const subjects = useStore((s) => s.subjects);
  const topics = useStore((s) => s.topics);

  const nodes = [];
  const edges = [];

  (subjects || []).forEach((subject, si) => {
    const subjectNodeId = subject.id;
    nodes.push({
      id: subjectNodeId,
      position: { x: si * 350, y: 0 },
      data: { label: subject.name },
      style: {
        background: subject.color || "#5b5fc7",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: "16px",
        fontWeight: 700,
        fontSize: "14px",
        border: `2px solid ${subject.color || "#5b5fc7"}`,
        boxShadow: "0 2px 12px rgba(91,95,199,0.15)",
      },
    });

    const subjectTopics = (topics || [])
      .filter((t) => t.subjectId === subject.id)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    subjectTopics.forEach((topic, ti) => {
      nodes.push({
        id: topic.id,
        position: {
          x: si * 350 + (ti % 2 === 0 ? -80 : 80),
          y: (ti + 1) * 100,
        },
        data: { label: topic.title },
        style: {
          background: "#ffffff",
          color: "#1e293b",
          padding: "10px 16px",
          borderRadius: "12px",
          fontSize: "12px",
          border: `2px solid ${statusColors[topic.status] || "#eef1f6"}`,
          boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        },
      });

      edges.push({
        id: `${subjectNodeId}-${topic.id}`,
        source: subjectNodeId,
        target: topic.id,
        animated: topic.status === "learning",
        style: {
          stroke: statusColors[topic.status] || "#eef1f6",
          strokeWidth: 2,
        },
      });
    });

    for (let i = 0; i < subjectTopics.length - 1; i++) {
      edges.push({
        id: `seq-${subjectTopics[i].id}-${subjectTopics[i + 1].id}`,
        source: subjectTopics[i].id,
        target: subjectTopics[i + 1].id,
        type: "smoothstep",
        style: { stroke: "#eef1f6", strokeWidth: 1, strokeDasharray: "5,5" },
      });
    }
  });

  const isEmpty = nodes.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Network size={20} className="text-[#5b5fc7]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Knowledge Graph
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Visual map of your learning
              </p>
            </div>
          </div>
        </div>

        {isEmpty ? (
          <div className="bg-white rounded-2xl p-12 border border-[#eef1f6] text-center">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#5b5fc7]"
              >
                <circle cx="12" cy="5" r="3" />
                <circle cx="5" cy="19" r="3" />
                <circle cx="19" cy="19" r="3" />
                <line x1="12" y1="8" x2="5" y2="16" />
                <line x1="12" y1="8" x2="19" y2="16" />
              </svg>
            </div>
            <p className="text-slate-600 font-medium">No data to display</p>
            <p className="text-slate-400 text-sm mt-1">
              Add subjects and topics to build your knowledge graph
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#eef1f6] overflow-hidden">
            <div style={{ height: "calc(100vh - 280px)", minHeight: "500px" }}>
              <ReactFlow nodes={nodes} edges={edges} fitView>
                <Background color="#eef1f6" gap={20} />
                <Controls />
                <MiniMap
                  nodeColor={(node) => {
                    const subject = (subjects || []).find(
                      (s) => s.id === node.id,
                    );
                    if (subject) return subject.color || "#5b5fc7";
                    return "#eef1f6";
                  }}
                  style={{
                    background: "#f8f9fd",
                    border: "1px solid #eef1f6",
                    borderRadius: "12px",
                  }}
                  maskColor="rgba(248,249,253,0.7)"
                />
              </ReactFlow>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center gap-5 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>{" "}
            Mastered
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>{" "}
            Practicing
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>{" "}
            Learning
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-300 inline-block"></span>{" "}
            Not Started
          </div>
        </div>
      </div>
    </div>
  );
}
