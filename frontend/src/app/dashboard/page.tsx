'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Folder, Play, CheckCircle2, ClipboardList, Plus, ArrowRight, Zap, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { useProjects } from '@/hooks/useProjects';

export default function DashboardPage() {
    const { projects, loading } = useProjects();

    const stats = [
        {
            label: 'Active Projects',
            value: projects.filter((p) => p.status === 'Active').length,
            icon: Play,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            trend: '+12%',
        },
        {
            label: 'Planning',
            value: projects.filter((p) => p.status === 'Planning').length,
            icon: ClipboardList,
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10',
            trend: '+5%',
        },
        {
            label: 'Completed',
            value: projects.filter((p) => p.status === 'Completed').length,
            icon: CheckCircle2,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            trend: '+18%',
        },
        {
            label: 'Total Projects',
            value: projects.length,
            icon: Folder,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            trend: '+8%',
        },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden mesh-gradient">
            <Navbar />

            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] -z-10" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 relative z-10">
                {/* Hero section with colorful reveal */}
                <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-2xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6 uppercase tracking-wider">
                            <Zap className="w-3 h-3" /> System Operational
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
                            Manage with <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">ZENITH</span>
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed mb-8 max-w-lg">
                            An enterprise-grade platform built for mission-critical project tracking and team orchestration.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="/projects" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all glow-primary hover:scale-105 active:scale-95 flex items-center gap-2">
                                Launch Projects <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative hidden lg:block"
                    >
                        <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full animate-float" />
                        <div className="relative glass-card p-4 rounded-[40px] overflow-hidden rotate-3 shadow-2xl border-white/20">
                            <Image
                                src="/hero-bg.png"
                                alt="Dashboard Preview"
                                width={500}
                                height={300}
                                className="rounded-[30px] shadow-2xl"
                            />
                        </div>
                        {/* Floating elements */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-10 -right-10 glass-card p-6 rounded-2xl glow-primary"
                        >
                            <TrendingUp className="w-8 h-8 text-green-400" />
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-10 -left-10 glass-card p-6 rounded-2xl border-purple-500/30"
                        >
                            <Users className="w-8 h-8 text-purple-400" />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Stats Section with Glass Cards */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className="glass-card p-8 rounded-3xl relative group overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                <div className="flex flex-col gap-6 relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center border border-white/5`}>
                                        <Icon className={`w-7 h-7 ${stat.color}`} />
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-gray-400 font-medium text-sm">{stat.label}</p>
                                            <span className="text-green-500 text-xs font-bold">{stat.trend}</span>
                                        </div>
                                        <p className="text-4xl font-black">{loading ? '...' : stat.value}</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black flex items-center gap-3">
                                Recent Activity <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            </h2>
                            <Link href="/projects" className="group flex items-center gap-2 text-blue-400 hover:text-white transition-all font-bold">
                                Explorer <div className="p-2 rounded-full bg-blue-500/10 group-hover:bg-blue-600 group-hover:text-white transition-all"><ArrowRight className="w-4 h-4" /></div>
                            </Link>
                        </div>

                        <div className="grid gap-6">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="h-28 rounded-3xl bg-white/5 animate-pulse" />
                                ))
                            ) : projects.length === 0 ? (
                                <div className="p-12 glass-card rounded-3xl text-center border-dashed border-white/10">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Folder className="w-10 h-10 text-gray-600" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">No projects yet</h3>
                                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Get started by creating your first enterprise project and track its progress.</p>
                                    <Link href="/projects" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all">
                                        <Plus className="w-5 h-5" /> Start First Project
                                    </Link>
                                </div>
                            ) : (
                                projects.slice(0, 3).map((project) => (
                                    <motion.div
                                        key={project._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="glass-card p-6 rounded-3xl hover:border-blue-500/40 transition-all hover:bg-white/5 group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                                                    <Folder className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold group-hover:text-blue-400 transition-colors uppercase tracking-tight">{project.name}</h3>
                                                    <p className="text-sm text-gray-500 font-medium">Last updated {new Date(project.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-2 ${project.status === 'Active' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                project.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                }`}>
                                                {project.status}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-8">
                        <div>
                            <h2 className="text-3xl font-black mb-8">System Health</h2>
                            <div className="glass-card p-8 rounded-3xl flex flex-col items-center justify-center text-center gap-6">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full border-4 border-white/5 flex items-center justify-center">
                                        <div className="w-24 h-24 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-blue-400">
                                        98%
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-400 font-bold mb-2">Memory Usage</p>
                                    <p className="text-sm text-gray-500 italic">Optimizing resources for your enterprise load.</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-700 border-none relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <h3 className="text-xl font-black mb-2 relative z-10">Premium Support</h3>
                            <p className="text-sm text-blue-100/70 mb-6 relative z-10">Need help with large scale deployments? Our architects are online.</p>
                            <button className="w-full py-4 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-colors relative z-10">
                                Contact Expert
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
