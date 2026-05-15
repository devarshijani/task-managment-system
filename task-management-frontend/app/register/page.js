"use client";
import { useState, useEffect } from "react";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import Link from "next/link";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [plans, setPlans] = useState([]);
    const [checkoutUrl, setCheckoutUrl] = useState(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        companyName: "",
        companyEmail: "",
        companyPhone: "",
        companyAddress: "",
        planId: "",
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await api.get("/plans");
            setPlans(res.data.data.plans);
        } catch (err) {
            toast.error("Failed to fetch plans");
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/auth/register", form);
            setCheckoutUrl(res.data.data.checkoutUrl);
            toast.success("Registration successful!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    if (checkoutUrl) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">Done</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Almost There!</h2>
                    <p className="text-gray-500 mb-6">
                        Your account has been created. Complete the payment to activate your company.
                    </p>

                    <a href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition mb-4 text-center"
          >
                    Complete Payment
                </a>
                <p className="text-gray-400 text-sm">
                    After payment, you can login with your credentials.
                </p>
                <Link href="/login" className="text-indigo-600 text-sm font-semibold hover:underline mt-4 block">
                    Back to Login
                </Link>
            </div>
      </div >
    );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl font-bold">TM</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
                    <p className="text-gray-500 mt-1">Register your company and get started</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
                            Admin Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 md:col-span-2"
                            />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
                            Company Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="companyName"
                                placeholder="Company Name"
                                value={form.companyName}
                                onChange={handleChange}
                                required
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                                type="email"
                                name="companyEmail"
                                placeholder="Company Email"
                                value={form.companyEmail}
                                onChange={handleChange}
                                required
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                                type="text"
                                name="companyPhone"
                                placeholder="Phone Number"
                                value={form.companyPhone}
                                onChange={handleChange}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                                type="text"
                                name="companyAddress"
                                placeholder="Address"
                                value={form.companyAddress}
                                onChange={handleChange}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
                            Select Plan
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {plans.map((plan) => (
                                <label
                                    key={plan._id}
                                    className={`border-2 rounded-xl p-4 cursor-pointer transition ${form.planId === plan._id
                                            ? "border-indigo-500 bg-indigo-50"
                                            : "border-gray-200 hover:border-indigo-300"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="planId"
                                        value={plan._id}
                                        checked={form.planId === plan._id}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-gray-900">{plan.name}</span>
                                        <span className="text-indigo-600 font-bold">Rs.{plan.price}</span>
                                    </div>
                                    <div className="text-sm text-gray-500 space-y-1">
                                        <p>{plan.maxProjects} Projects</p>
                                        <p>{plan.maxUsers} Users</p>
                                        <p>{plan.durationInDays} Days</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !form.planId}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating Account..." : "Register and Proceed to Payment"}
                    </button>
                </form>

                <p className="text-center text-gray-500 mt-6 text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
}