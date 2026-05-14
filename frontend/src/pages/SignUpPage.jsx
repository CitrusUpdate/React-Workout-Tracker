import { useState } from "react";
import { Link } from 'react-router';
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const QUOTES = [
    { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
    { text: "Your body can stand almost anything. It's your mind you have to convince.", author: "Unknown" },
    { text: "Push yourself because no one else is going to do it for you.", author: "Unknown" },
    { text: "Success starts with self-discipline.", author: "Unknown" },
    { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Unknown" },
    { text: "Don't limit your challenges. Challenge your limits.", author: "Unknown" },
    { text: "It never gets easier. You just get stronger.", author: "Unknown" },
    { text: "Sweat is just fat crying.", author: "Unknown" },
    { text: "Train insane or remain the same.", author: "Unknown" },
    { text: "Strive for progress, not perfection.", author: "Unknown" },
];

export default function SignUpPage() {
    const { signup, isSigningUp } = useAuthStore();

    const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        re_password: ''
    });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => { 
        e.preventDefault();
        if(formData.password !== formData.re_password) {
            toast.error("Passwords do not match");
            return;
        }
        const { re_password, ...dataToSend } = formData;
        signup(dataToSend);
    };

    return (
        <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center px-4">
            <div className="fixed inset-0 bg-[linear-gradient(rgba(255, 255, 255, 0.02)_1px, transparent_1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02)_1px,transparent_1px)]  bg-size-[48px_48px] pointer-events-none" />

            {/* App name */}
            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Workout <span className="text-blue-500">Tracker</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1 tracking-widest uppercase">Train. Track. Progress</p>
                </div>

            { /* Quote */ }
            <blockquote className="mb-6 border-l-2 border-blue-500 pl-4">
                <p className="text-slate-300 italic text-sm leading-relaxed"><q>{quote.text}</q></p>
            </blockquote>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <h2 className="text-white text-xl font-semibold mb-6">Create account</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-400 text-sm mb-1.5">Full name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue transition"
                            />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm mb-1.5">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="johndoe@example.com"
                            required
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue transition"
                            />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm mb-1.5">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="************"
                            required
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue transition"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm mb-1.5">Repeat password</label>
                        <input
                            type="password"
                            name="re_password"
                            value={formData.re_password}
                            onChange={handleChange}
                            placeholder="************"
                            required
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue transition"
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={isSigningUp}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm transition mt-2 cursor-pointer"
                    >
                        { isSigningUp ? 'Creating account' : 'Signup' }
                    </button>
                </form>

                <p className="text-slate-500 text-sm text-center mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-400 hover:text-blue-300 transition">
                        Login
                    </Link>
                </p>
            </div>
            </div>
        </div>
    );
}