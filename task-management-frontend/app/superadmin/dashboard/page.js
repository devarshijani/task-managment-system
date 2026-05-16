"use client";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../../lib/axios";

export default function SuperAdminDashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({
        companies: 0,
        plans: 0,
        users: 0,
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [companies, plans, users] = await Promise.all([
                api.get("/companies"),
                api.get("/plans"),
                api.get("/users"),
            ]);
            setStats({
                companies: companies.data.data.pagination.total,
                plans: plans.data.data.pagination.total,
                users: users.data.data.pagination.total,
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-indigo-600 font-bold text-sm">TM</span>
                    </div>
                    <span className="font-bold text-lg">Task Management — Super Admin</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-indigo-200 text-sm">👋 {user?.name}</span>
                    <button
                        onClick={logout}
                        className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg text-sm transition"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Super Admin Dashboard 🚀
                    </h1>
                    <p className="text-gray-500 mt-1">Manage the entire system from here.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-indigo-500">
                        <p className="text-gray-500 text-sm">Total Companies</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{stats.companies}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-green-500">
                        <p className="text-gray-500 text-sm">Total Plans</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{stats.plans}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-purple-500">
                        <p className="text-gray-500 text-sm">Total Users</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{stats.users}</p>
                    </div>
                </div>

                {/* Quick Navigation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button
                        onClick={() => router.push("/superadmin/companies")}
                        className="bg-white rounded-2xl shadow p-6 text-left hover:shadow-md transition border hover:border-indigo-300"
                    >
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                            <span className="text-2xl">🏢</span>
                        </div>
                        <h3 className="font-bold text-gray-900">Companies</h3>
                        <p className="text-gray-500 text-sm mt-1">Manage all companies</p>
                    </button>

                    <button
                        onClick={() => router.push("/superadmin/plans")}
                        className="bg-white rounded-2xl shadow p-6 text-left hover:shadow-md transition border hover:border-green-300"
                    >
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                            <span className="text-2xl">💳</span>
                        </div>
                        <h3 className="font-bold text-gray-900">Plans</h3>
                        <p className="text-gray-500 text-sm mt-1">Manage subscription plans</p>
                    </button>

                    <button
                        onClick={() => router.push("/superadmin/users")}
                        className="bg-white rounded-2xl shadow p-6 text-left hover:shadow-md transition border hover:border-purple-300"
                    >
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                            <span className="text-2xl">👥</span>
                        </div>
                        <h3 className="font-bold text-gray-900">Users</h3>
                        <p className="text-gray-500 text-sm mt-1">Manage all users</p>
                    </button>
                </div>
            </div>
        </div>
    );
}