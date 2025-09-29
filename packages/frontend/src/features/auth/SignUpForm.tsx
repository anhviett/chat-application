
import React, { useState } from "react";
import { authApi } from "../../../api/auth";

function SignUpForm() {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            await authApi.register({
                username: form.username,
                email: form.email,
                password: form.password,
            });
            setSuccess("Đăng ký thành công!");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Đăng ký thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='grid grid-cols-2 gap-4'>
                <div>
                    <h2 className="bg-red-500">Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username">Username:</label>
                            <input type="text" id="username" name="username" value={form.username} onChange={handleChange} required />
                        </div>
                        <div>
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password" name="password" value={form.password} onChange={handleChange} required />
                        </div>
                        <button type="submit" disabled={loading}>{loading ? "Đang đăng ký..." : "Sign Up"}</button>
                        {error && <div style={{ color: "red" }}>{error}</div>}
                        {success && <div style={{ color: "green" }}>{success}</div>}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUpForm;