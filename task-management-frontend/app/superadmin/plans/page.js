"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";
import toast from "react-hot-toast";

export default function PlansPage() {
    const router = useRouter();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        name: "", maxProjects: "", maxUsers: "", durationInDays: "", price: "",
    });

    useEffect(() => { fetchPlans(); }, []);

    const fetchPlans = async () => {
        try {
            const res = await api.get("/plans");
            setPlans(res.data.data.plans);
        } catch (err) {
            toast.error("Failed to fetch plans");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post("/plans", {
                ...form,
                maxProjects: Number(form.maxProjects),
                maxUsers: Number(form.maxUsers),
                durationInDays: Number(form.durationInDays),
                price: Number(form.price),
            });
            toast.success("Plan created!");
            setShowModal(false);
            setForm({ name: "", maxProjects: "", maxUsers: "", durationInDays: "", price: "" });
            fetchPlans();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create plan");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this plan?")) return;
        try {
            await api.delete(`/plans/${id}`);
            toast.success("Plan deleted!");
            fetchPlans();
        } catch (err) {
            toast.error("Failed to delete plan");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.push("/superadmin/dashboard")} className="text-indigo-200 hover:text-white">← Back</button>
                    <span className="font-bold text-lg">Subscription Plans</span>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Plans</h1>
                    <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                        + New Plan
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plans.map((plan) => (
                            <div key={plan._id} className="bg-white rounded-2xl shadow p-6 border hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                    <span className="text-2xl font-bold text-indigo-600">₹{plan.price}</span>
                                </div>
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <span>📁</span>
                                        <span className="text-sm">{plan.maxProjects} Projects</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <span>👥</span>
                                        <span className="text-sm">{plan.maxUsers} Users</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <span>📅</span>
                                        <span className="text-sm">{plan.durationInDays} Days</span>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(plan._id)}
                                    className="w-full text-red-500 border border-red-200 hover:bg-red-50 py-2 rounded-lg text-sm transition">
                                    Delete Plan
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Plan</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input type="text" placeholder="Plan Name (e.g. Basic)" value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })} required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            <input type="number" placeholder="Max Projects" value={form.maxProjects}
                                onChange={(e) => setForm({ ...form, maxProjects: e.target.value })} required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            <input type="number" placeholder="Max Users" value={form.maxUsers}
                                onChange={(e) => setForm({ ...form, maxUsers: e.target.value })} required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            <input type="number" placeholder="Duration (days)" value={form.durationInDays}
                                onChange={(e) => setForm({ ...form, durationInDays: e.target.value })} required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            <input type="number" placeholder="Price (₹)" value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })} required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
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