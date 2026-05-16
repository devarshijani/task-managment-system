"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";
import toast from "react-hot-toast";

export default function ProjectsPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState({ name: "", description: "", shortCode: "" });

    useEffect(() => { fetchProjects(); }, []);

    const fetchProjects = async () => {
        try {
            const res = await api.get("/projects");
            setProjects(res.data.data.projects);
        } catch (err) {
            toast.error("Failed to fetch projects");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post("/projects", form);
            toast.success("Project created!");
            setShowModal(false);
            setForm({ name: "", description: "", shortCode: "" });
            fetchProjects();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create project");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this project?")) return;
        try {
            await api.delete(`/projects/${id}`);
            toast.success("Project deleted!");
            fetchProjects();
        } catch (err) {
            toast.error("Failed to delete project");
        }
    };

    // Filter projects based on search state
    const filteredProjects = projects.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.push("/admin/dashboard")} className="text-indigo-200 hover:text-white">← Back</button>
                    <span className="font-bold text-lg">Projects</span>
                </div>
                <button onClick={logout} className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg text-sm transition">Logout</button>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                    <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                        + New Project
                    </button>
                </div>

                {/* Search input added before the grid */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow">
                        <span className="text-5xl">📁</span>
                        <p className="text-gray-500 mt-4">No projects yet. Create your first one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <div key={project._id} className="bg-white rounded-2xl shadow p-6 border hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded">
                                        {project.shortCode}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${project.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                        {project.status}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg mb-1">{project.name}</h3>
                                <p className="text-gray-500 text-sm mb-4">{project.description || "No description"}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-xs">
                                        👥 {project.assignedUsers?.length || 0} members
                                    </span>
                                    <button onClick={() => handleDelete(project._id)} className="text-red-500 hover:text-red-700 text-sm transition">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Project</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Project Name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                                type="text"
                                placeholder="Short Code (e.g. TMS)"
                                value={form.shortCode}
                                onChange={(e) => setForm({ ...form, shortCode: e.target.value.toUpperCase() })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <textarea
                                placeholder="Description (optional)"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}