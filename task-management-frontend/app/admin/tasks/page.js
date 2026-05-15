"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";
import toast from "react-hot-toast";

const STATUSES = ["to-do", "in-progress", "testing", "qa-verified", "re-open", "deployment", "done"];

const STATUS_COLORS = {
    "to-do": "bg-gray-100 border-gray-300",
    "in-progress": "bg-blue-50 border-blue-300",
    "testing": "bg-yellow-50 border-yellow-300",
    "qa-verified": "bg-green-50 border-green-300",
    "re-open": "bg-red-50 border-red-300",
    "deployment": "bg-purple-50 border-purple-300",
    "done": "bg-emerald-50 border-emerald-300",
};

const STATUS_HEADER_COLORS = {
    "to-do": "bg-gray-500",
    "in-progress": "bg-blue-500",
    "testing": "bg-yellow-500",
    "qa-verified": "bg-green-500",
    "re-open": "bg-red-500",
    "deployment": "bg-purple-500",
    "done": "bg-emerald-500",
};

const PRIORITY_COLORS = {
    high: "bg-red-100 text-red-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-green-100 text-green-700",
};

export default function TasksPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [view, setView] = useState("kanban");
    const [filterPriority, setFilterPriority] = useState("");
    const [filterProject, setFilterProject] = useState("");
    const [form, setForm] = useState({
        title: "",
        description: "",
        project: "",
        assignedTo: "",
        reportTo: "",
        priority: "medium",
        status: "to-do",
        dueDate: "",
    });

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        try {
            const [tasksRes, projectsRes, usersRes] = await Promise.all([
                api.get("/tasks"),
                api.get("/projects"),
                api.get("/users"),
            ]);
            setTasks(tasksRes.data.data.tasks);
            setProjects(projectsRes.data.data.projects);
            setUsers(usersRes.data.data.users);
        } catch (err) {
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post("/tasks", form);
            toast.success("Task created!");
            setShowModal(false);
            setForm({
                title: "",
                description: "",
                project: "",
                assignedTo: "",
                reportTo: "",
                priority: "medium",
                status: "to-do",
                dueDate: "",
            });
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create task");
        }
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            await api.put(`/tasks/${taskId}`, { status: newStatus });
            toast.success("Status updated!");
            fetchAll();
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const filteredTasks = tasks.filter((t) => {
        if (filterPriority && t.priority !== filterPriority) return false;
        if (filterProject && t.project?._id !== filterProject) return false;
        return true;
    });

    const getTasksByStatus = (status) =>
        filteredTasks.filter((t) => t.status === status);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.push("/admin/dashboard")} className="text-indigo-200 hover:text-white">← Back</button>
                    <span className="font-bold text-lg">Tasks</span>
                </div>
                <button onClick={logout} className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg text-sm transition">Logout</button>
            </nav>

            <div className="max-w-full px-6 py-8">
                {/* Header */}
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
                    <div className="flex items-center gap-3">
                        {/* Filters */}
                        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="">All Priorities</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                        <select value={filterProject} onChange={(e) => setFilterProject(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="">All Projects</option>
                            {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                        {/* View Toggle */}
                        <div className="flex bg-gray-200 rounded-lg p-1">
                            <button onClick={() => setView("kanban")}
                                className={`px-3 py-1 rounded-md text-sm transition ${view === "kanban" ? "bg-white shadow font-semibold" : "text-gray-600"}`}>
                                Kanban
                            </button>
                            <button onClick={() => setView("list")}
                                className={`px-3 py-1 rounded-md text-sm transition ${view === "list" ? "bg-white shadow font-semibold" : "text-gray-600"}`}>
                                List
                            </button>
                        </div>
                        <button onClick={() => setShowModal(true)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm">
                            + New Task
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    </div>
                ) : view === "kanban" ? (
                    /* Kanban Board */
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {STATUSES.map((status) => (
                            <div key={status} className="flex-shrink-0 w-72">
                                {/* Column Header */}
                                <div className={`${STATUS_HEADER_COLORS[status]} text-white px-4 py-2 rounded-t-xl flex justify-between items-center`}>
                                    <span className="font-semibold text-sm capitalize">{status}</span>
                                    <span className="bg-white bg-opacity-30 text-white text-xs px-2 py-0.5 rounded-full">
                                        {getTasksByStatus(status).length}
                                    </span>
                                </div>
                                {/* Column Body */}
                                <div className={`${STATUS_COLORS[status]} border-2 border-t-0 rounded-b-xl min-h-64 p-3 space-y-3`}>
                                    {getTasksByStatus(status).length === 0 ? (
                                        <div className="text-center py-8 text-gray-400 text-sm">No tasks</div>
                                    ) : (
                                        getTasksByStatus(status).map((task) => (
                                            <div key={task._id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs font-bold text-indigo-600">{task.taskId}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[task.priority]}`}>
                                                        {task.priority}
                                                    </span>
                                                </div>
                                                <p
                                                    onClick={() => router.push(`/admin/tasks/${task._id}`)}
                                                    className="font-semibold text-gray-900 text-sm mb-2 cursor-pointer hover:text-indigo-600 transition"
                                                >
                                                    {task.title}
                                                </p>
                                                <p className="text-gray-400 text-xs mb-3 line-clamp-2">{task.description}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-400 text-xs">
                                                        {task.assignedTo?.name || "Unassigned"}
                                                    </span>
                                                    <select
                                                        value={task.status}
                                                        onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                                                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                                    >
                                                        {STATUSES.map((s) => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* List View */
                    <div className="bg-white rounded-2xl shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Task</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Project</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Assigned To</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Priority</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredTasks.map((task) => (
                                    <tr key={task._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900">{task.title}</p>
                                            <p className="text-indigo-600 text-xs">{task.taskId}</p>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{task.project?.name}</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{task.assignedTo?.name || "Unassigned"}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${PRIORITY_COLORS[task.priority]}`}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select value={task.status} onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                                                className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none">
                                                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-screen overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Task</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input type="text" placeholder="Task Title" value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })} required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            <textarea placeholder="Description" value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            <select value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="">Select Project</option>
                                {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                            </select>
                            <select value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="">Assign To</option>
                                {users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
                            </select>
                            <select value={form.reportTo} onChange={(e) => setForm({ ...form, reportTo: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="">Report To</option>
                                {users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
                            </select>
                            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>

                            {/* Due Date field added here */}
                            <div>
                                <label className="text-sm text-gray-600">Due Date (optional)</label>
                                <input
                                    type="date"
                                    value={form.dueDate || ""}
                                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancel</button>
                                <button type="submit"
                                    className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}