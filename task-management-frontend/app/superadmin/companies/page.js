"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";
import toast from "react-hot-toast";

export default function CompaniesPage() {
    const router = useRouter();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchCompanies(); }, []);

    const fetchCompanies = async () => {
        try {
            const res = await api.get("/companies");
            setCompanies(res.data.data.companies);
        } catch (err) {
            toast.error("Failed to fetch companies");
        } finally {
            setLoading(false);
        }
    };

    const statusColor = (s) => {
        if (s === "active") return "bg-green-100 text-green-700";
        if (s === "pending") return "bg-yellow-100 text-yellow-700";
        if (s === "payment_failed") return "bg-red-100 text-red-700";
        return "bg-gray-100 text-gray-700";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.push("/superadmin/dashboard")} className="text-indigo-200 hover:text-white">← Back</button>
                    <span className="font-bold text-lg">Companies</span>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">All Companies</h1>
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {companies.length} total
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
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Company</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Email</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Plan Expires</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {companies.map((company) => (
                                    <tr key={company._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                                    <span className="text-indigo-600 font-bold">
                                                        {company.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{company.name}</p>
                                                    <p className="text-gray-400 text-xs">{company.phone || "No phone"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{company.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor(company.status)}`}>
                                                {company.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {company.planExpiresAt
                                                ? new Date(company.planExpiresAt).toLocaleDateString()
                                                : "No plan"}
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