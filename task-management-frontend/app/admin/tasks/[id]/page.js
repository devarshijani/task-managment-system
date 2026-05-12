"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "../../../../lib/axios";
import { useAuth } from "../../../../context/AuthContext";
import toast from "react-hot-toast";

export default function TaskDetailPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([]);
    const [history, setHistory] = useState([]);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("comments");

    useEffect(() => {
        if (id) fetchAll();
    }, [id]);

    const fetchAll = async () => {
        try {
            const [taskRes, commentsRes, historyRes] = await Promise.all([
                api.get(`/tasks/${id}`),
                api.get(`/comments/task/${id}`),
                api.get(`/history/task/${id}`),
            ]);
            setTask(taskRes.data.data);
            setComments(commentsRes.data.data.comments);
            setHistory(historyRes.data.data.history);
        } catch (err) {
            toast.error("Failed to fetch task");
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        try {
            await api.post("/comments", { content: comment, task: id });
            toast.success("Comment added!");
            setComment("");
            fetchAll();
        } catch (err) {
            toast.error("Failed to add comment");
        }
    };

    const priorityColor = (p) => {
        if (p === "high") return "bg-red-100 text-red-700";
        if (p === "medium") return "bg-yellow-100 text-yellow-700";
        return "bg-green-100 text-green-700";
    };

    const isOverdue = task?.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (!task) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500">Task not found</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.push("/admin/tasks")} className="text-indigo-200 hover:text-white">← Back</button>
                    <span className="font-bold text-lg">Task Detail</span>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Task Header */}
                <div className="bg-white rounded-2xl shadow p-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-indigo-100 text-indigo-700 text-sm font-bold px-3 py-1 rounded-full">
                                    {task.taskId}
                                </span>
                                <span className={`text-sm px-3 py-1 rounded-full font-medium ${priorityColor(task.priority)}`}>
                                    {task.priority}
                                </span>
                                {isOverdue && (
                                    <span className="bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full font-medium animate-pulse">
                                        OVERDUE!
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
                        </div>
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                            {task.status}
                        </span>
                    </div>

                    <p className="text-gray-500 mb-6">{task.description || "No description"}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Project</p>
                            <p className="font-semibold text-gray-900 text-sm">{task.project?.name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Assigned To</p>
                            <p className="font-semibold text-gray-900 text-sm">{task.assignedTo?.name || "Unassigned"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Report To</p>
                            <p className="font-semibold text-gray-900 text-sm">{task.reportTo?.name || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Due Date</p>
                            <p className={`font-semibold text-sm ${isOverdue ? "text-red-600" : "text-gray-900"}`}>
                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow overflow-hidden">
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab("comments")}
                            className={`px-6 py-4 font-semibold text-sm transition ${activeTab === "comments" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            💬 Comments ({comments.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={`px-6 py-4 font-semibold text-sm transition ${activeTab === "history" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            📋 History ({history.length})
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === "comments" && (
                            <div>
                                {/* Add Comment */}
                                <form onSubmit={handleAddComment} className="mb-6">
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Add a comment..."
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
                                    />
                                    <button type="submit"
                                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition text-sm">
                                        Add Comment
                                    </button>
                                </form>

                                {/* Comments List */}
                                {comments.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400">No comments yet</div>
                                ) : (
                                    <div className="space-y-4">
                                        {comments.map((c) => (
                                            <div key={c._id} className="flex gap-3">
                                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-indigo-600 font-bold text-sm">
                                                        {c.author?.name?.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex-1 bg-gray-50 rounded-xl p-4">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-semibold text-gray-900 text-sm">{c.author?.name}</span>
                                                        <span className="text-gray-400 text-xs">
                                                            {new Date(c.createdAt).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-600 text-sm">{c.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "history" && (
                            <div>
                                {history.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400">No history yet</div>
                                ) : (
                                    <div className="space-y-4">
                                        {history.map((h) => (
                                            <div key={h._id} className="flex gap-3">
                                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-purple-600 font-bold text-sm">
                                                        {h.changedBy?.name?.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex-1 bg-gray-50 rounded-xl p-4">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-semibold text-gray-900 text-sm">{h.changedBy?.name}</span>
                                                        <span className="text-gray-400 text-xs">
                                                            {new Date(h.createdAt).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded">{h.previousStatus}</span>
                                                        <span className="text-gray-400">→</span>
                                                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">{h.newStatus}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}