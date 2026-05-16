"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";
import toast from "react-hot-toast";

export default function UserDashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchTasks(); }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get("/tasks");
            setTasks(res.data.data.tasks);
        } catch (err) {
            toast.error("Failed to fetch tasks");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (taskId, status) => {
        try {
            await api.put(`/tasks/${taskId}`, { status });
            toast.success("Status updated!");
            fetchTasks();
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const statusOptions = ["to-do", "in-progress", "done", "testing", "qa-verified", "re-open", "deployment"];

    const priorityColor = (p) => {
        if (p === "high") return "bg-red-100 text-red-700";
        if (p === "medium") return "bg-yellow-100 text-yellow-700";
        return "bg-green-100 text-green-700";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-indigo-600 font-bold text-sm">TM</span>
                    </div>
                    <span className="font-bold text-lg">My Tasks</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-indigo-200 text-sm">👋 {user?.name}</span>
                    <button onClick={logout} className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg text-sm transition">Logout</button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">My Assigned Tasks</h1>
                    <p className="text-gray-500 mt-1">Update task status as you progress.</p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow">
                        <span className="text-5xl">🎉</span>
                        <p className="text-gray-500 mt-4">No tasks assigned yet!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks.map((task) => (
                            <div key={task._id} className="bg-white rounded-2xl shadow p-6 border hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded">
                                        {task.taskId}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColor(task.priority)}`}>
                                        {task.priority}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">{task.title}</h3>
                                <p className="text-gray-500 text-sm mb-4">{task.description || "No description"}</p>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Update Status:</label>
                                    <select
                                        value={task.status}
                                        onChange={(e) => updateStatus(task._id, e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        {statusOptions.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}