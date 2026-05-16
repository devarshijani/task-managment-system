"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";
import toast from "react-hot-toast";

export default function SuperAdminUsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const roleColor = (role) => {
        if (role === "superadmin") return "bg-red-100 text-red-700";
        if (role === "admin") return "bg-purple-100 text-purple-700";
        return "bg-blue-100 text-blue-700";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.push("/superadmin/dashboard")} className="text-indigo-200 hover:text-white">← Back</button>
                    <span className="font-bold text-lg">All Users</span>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {users.length} total
                    </span>
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
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Company</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
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
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {u.company?.name || "No company"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs px-2 py-1 rounded-full ${u.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                {u.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}