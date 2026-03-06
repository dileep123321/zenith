'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, LogOut, User as UserIcon, Menu, X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = React.useState(false);

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Projects', href: '/projects', icon: FolderKanban },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#050505]/40 backdrop-blur-2xl border-b border-white/5 shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-12">
                        <Link href="/dashboard" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                                Z
                            </div>
                            <span className="text-2xl font-black bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent tracking-tighter">
                                ZENITH
                            </span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative ${isActive
                                            ? 'text-white'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-active"
                                                className="absolute inset-0 bg-white/10 border border-white/10 rounded-xl -z-10"
                                            />
                                        )}
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : ''}`} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <button className="relative p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#050505]" />
                        </button>

                        <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-black text-white">{user?.firstName} {user?.lastName}</span>
                                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none">Enterprise {user?.role}</span>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 group cursor-pointer hover:border-blue-500/40 transition-all">
                                <UserIcon className="w-5 h-5 text-blue-400 group-hover:scale-110" />
                            </div>
                            <button
                                onClick={logout}
                                className="p-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all border border-white/10"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="lg:hidden border-t border-white/5 bg-[#050505]/95 backdrop-blur-3xl"
                    >
                        <div className="px-4 py-8 space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-lg font-bold ${isActive
                                            ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <Icon className="w-6 h-6" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                            <div className="h-px bg-white/5 my-4" />
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    logout();
                                }}
                                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-lg font-bold text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
                            >
                                <LogOut className="w-6 h-6" />
                                Logout
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
