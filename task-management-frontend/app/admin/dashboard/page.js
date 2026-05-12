"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({ projects: 0, users: 0, tasks: 0 });
    const [tasks, setTasks] = useState([]); // Added tasks to dashboard state
    const [taskStatusData, setTaskStatusData] = useState([]);
    const [taskPriorityData, setTaskPriorityData] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            const [projectsRes, usersRes, tasksRes, notifRes] = await Promise.all([
                api.get("/projects"),
                api.get("/users"),
                api.get("/tasks"),
                api.get("/notifications"),
            ]);

            const fetchedTasks = tasksRes.data.data.tasks;
            setTasks(fetchedTasks); // Store tasks in state

            setStats({
                projects: projectsRes.data.data.pagination.total,
                users: usersRes.data.data.pagination.total,
                tasks: tasksRes.data.data.pagination.total,
            });

            // Task status chart data
            const statusCounts = {};
            fetchedTasks.forEach((t) => {
                statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
            });
            setTaskStatusData(
                Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
            );

            // Task priority chart data
            const priorityCounts = {};
            fetchedTasks.forEach((t) => {
                priorityCounts[t.priority] = (priorityCounts[t.priority] || 0) + 1;
            });
            setTaskPriorityData(
                Object.entries(priorityCounts).map(([name, value]) => ({ name, value }))
            );

            // Notifications
            const notifs = notifRes.data.data.notifications;
            setNotifications(notifs);
            setUnreadCount(notifs.filter((n) => !n.isRead).length);
        } catch (err) {
            console.error(err);
        }
    };

    const markAllRead = async () => {
        try {
            await api.put("/notifications/read-all");
            setUnreadCount(0);
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        } catch (err) {
            console.error(err);
        }
    };

    const STATUS_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#f97316"];
    const PRIORITY_COLORS = { high: "#ef4444", medium: "#f59e0b", low: "#22c55e" };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-indigo-600 font-bold text-sm">TM</span>
                    </div>
                    <span className="font-bold text-lg">Task Management</span>
                </div>
                <div className="flex items-center gap-4">
                    {/* Notification Bell */}
                    <div className="relative">
                        <button
                            onClick={() => { setShowNotifications(!showNotifications); if (unreadCount > 0) markAllRead(); }}
                            className="relative p-2 hover:bg-indigo-700 rounded-lg transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Profile Button */}
                        <button
                            onClick={() => router.push("/profile")}
                            className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center hover:bg-indigo-400 transition"
                        >
                            <span className="text-white font-bold text-sm">
                                {user?.name?.charAt(0).toUpperCase()}
                            </span>
                        </button>

                        {/* Notification Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl z-50 border overflow-hidden">
                                <div className="px-4 py-3 border-b flex justify-between items-center">
                                    <h3 className="font-bold text-gray-900">Notifications</h3>
                                    <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="text-center py-8 text-gray-400">
                                            No notifications yet
                                        </div>
                                    ) : (
                                        notifications.map((n) => (
                                            <div key={n._id} className={`px-4 py-3 border-b hover:bg-gray-50 transition ${!n.isRead ? "bg-indigo-50" : ""}`}>
                                                <p className="font-semibold text-gray-900 text-sm">{n.title}</p>
                                                <p className="text-gray-500 text-xs mt-1">{n.body}</p>
                                                <p className="text-gray-400 text-xs mt-1">
                                                    {new Date(n.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <span className="text-indigo-200 text-sm">👋 {user?.name}</span>
                    <button onClick={logout} className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg text-sm transition">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Welcome */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h1>
                    <p className="text-gray-500 mt-1">Here's what's happening today.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-indigo-500">
                        <p className="text-gray-500 text-sm">Total Projects</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{stats.projects}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-green-500">
                        <p className="text-gray-500 text-sm">Total Users</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{stats.users}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-purple-500">
                        <p className="text-gray-500 text-sm">Total Tasks</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{stats.tasks}</p>
                    </div>
                </div>

                {/* Overdue Alert Section - Added after stats cards */}
                {tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done").length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-4">
                        <span className="text-2xl">⚠️</span>
                        <div>
                            <p className="font-bold text-red-700">Overdue Tasks!</p>
                            <p className="text-red-500 text-sm">
                                You have {tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done").length} overdue tasks that need attention.
                            </p>
                        </div>
                        <button
                            onClick={() => router.push("/admin/tasks")}
                            className="ml-auto bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition"
                        >
                            View Tasks
                        </button>
                    </div>
                )}

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Task Status Pie Chart */}
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h2 className="font-bold text-gray-900 mb-4">Tasks by Status</h2>
                        {taskStatusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie data={taskStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                                        {taskStatusData.map((_, index) => (
                                            <Cell key={index} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center py-12 text-gray-400">No tasks yet</div>
                        )}
                    </div>

                    {/* Task Priority Bar Chart */}
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h2 className="font-bold text-gray-900 mb-4">Tasks by Priority</h2>
                        {taskPriorityData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={taskPriorityData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                        {taskPriorityData.map((entry, index) => (
                                            <Cell key={index} fill={PRIORITY_COLORS[entry.name] || "#6366f1"} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center py-12 text-gray-400">No tasks yet</div>
                        )}
                    </div>
                </div>

                {/* Quick Navigation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button onClick={() => router.push("/admin/projects")} className="bg-white rounded-2xl shadow p-6 text-left hover:shadow-md transition border hover:border-indigo-300">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                            <span className="text-2xl">📁</span>
                        </div>
                        <h3 className="font-bold text-gray-900">Projects</h3>
                        <p className="text-gray-500 text-sm mt-1">Manage your projects</p>
                    </button>

                    <button onClick={() => router.push("/admin/users")} className="bg-white rounded-2xl shadow p-6 text-left hover:shadow-md transition border hover:border-green-300">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                            <span className="text-2xl">👥</span>
                        </div>
                        <h3 className="font-bold text-gray-900">Users</h3>
                        <p className="text-gray-500 text-sm mt-1">Manage your team</p>
                    </button>

                    <button onClick={() => router.push("/admin/tasks")} className="bg-white rounded-2xl shadow p-6 text-left hover:shadow-md transition border hover:border-purple-300">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                            <span className="text-2xl">✅</span>
                        </div>
                        <h3 className="font-bold text-gray-900">Tasks</h3>
                        <p className="text-gray-500 text-sm mt-1">Manage all tasks</p>
                    </button>
                </div>
            </div>
        </div>
    );
}