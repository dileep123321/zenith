'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/Input';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setError(null);
        try {
            await login(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden mesh-gradient">
            {/* Animated background elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[150px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md p-10 rounded-[40px] glass-card z-10 border-white/10 shadow-3xl"
            >
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 0 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-xl shadow-blue-500/20"
                    >
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase">Identity</h1>
                    <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.2em]">Authentication Gateway v4.2</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-sm font-bold text-red-400">{error}</p>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="relative group">
                        <div className="absolute left-4 top-[38px] z-20 group-focus-within:text-blue-500 transition-colors">
                            <Mail className="w-5 h-5 text-gray-600" />
                        </div>
                        <Input
                            label="Neural Link (Email)"
                            type="email"
                            placeholder="name@company.com"
                            autoComplete="email"
                            error={errors.email?.message}
                            {...register('email')}
                            className="pl-12 px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/40 transition-all duration-300 text-white placeholder-gray-700 font-bold w-full"
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute left-4 top-[38px] z-20 group-focus-within:text-blue-500 transition-colors">
                            <Lock className="w-5 h-5 text-gray-600" />
                        </div>
                        <Input
                            label="Access Protocol (Password)"
                            type="password"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            error={errors.password?.message}
                            {...register('password')}
                            className="pl-12 px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/40 transition-all duration-300 text-white placeholder-gray-700 font-bold w-full"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all duration-300 shadow-2xl shadow-blue-600/30 uppercase tracking-[0.2em] text-sm active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3 mt-4"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Establish Link</span>
                                <LogIn className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-white/5 text-center">
                    <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">
                        New Entity?{' '}
                        <Link href="/register" className="text-blue-500 hover:text-white transition-colors ml-2 font-black">
                            Register Index
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
