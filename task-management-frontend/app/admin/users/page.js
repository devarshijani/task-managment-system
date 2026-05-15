"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";
import toast from "react-hot-toast";

export default function UsersPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/users");
            setUsers(res.data.data.users);
        } catch (err) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post("/users", {
                ...form,
                company: user.company?._id || user.company
            });
            toast.success("User created! Welcome email sent 📧");
            setShowModal(false);
            setForm({ name: "", email: "", password: "", role: "user" });
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create user");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this user?")) return;
        try {
            await api.delete(`/users/${id}`);
            toast.success("User deleted!");
            fetchUsers();
        } catch (err) {
            toast.error("Failed to delete user");
        }
    };

    const roleColor = (role) => {
        if (role === "admin") return "bg-purple-100 text-purple-700";
        return "bg-blue-100 text-blue-700";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.push("/admin/dashboard")} className="text-indigo-200 hover:text-white">← Back</button>
                    <span className="font-bold text-lg">Users</span>
                </div>
                <button onClick={logout} className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg text-sm transition">Logout</button>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
                    <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                        + Add User
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Name</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Email</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Role</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((u) => (
                                    <tr key={u._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                                    <span className="text-indigo-600 font-semibold text-sm">
                                                        {u.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="font-medium text-gray-900">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${roleColor(u.role)}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs px-2 py-1 rounded-full ${u.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => handleDelete(u._id)} className="text-red-500 hover:text-red-700 text-sm transition">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Add New User</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input type="text" placeholder="Full Name" value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })} required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            <input type="email" placeholder="Email Address" value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })} required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            <input type="password" placeholder="Password" value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })} required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancel</button>
                                <button type="submit" className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}