"use client";
import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        try {
            const savedUser = Cookies.get("user");
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch {
            Cookies.remove("user");
            Cookies.remove("token");
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (userData, token) => {
        Cookies.set("token", token, { expires: 7 });
        Cookies.set("user", JSON.stringify(userData), { expires: 7 });
        setUser(userData);
        if (userData.role === "superadmin") {
            router.push("/superadmin/dashboard");
        } else if (userData.role === "admin") {
            router.push("/admin/dashboard");
        } else {
            router.push("/user/dashboard");
        }
    };

    const logout = () => {
        Cookies.remove("token");
        Cookies.remove("user");
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};