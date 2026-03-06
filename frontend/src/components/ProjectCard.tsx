import React from 'react';
import { motion } from 'framer-motion';
import { Folder, MoreVertical, Calendar, Trash2, Edit2, Play, CheckCircle2, ClipboardList, ArrowUpRight } from 'lucide-react';
import { Project } from '@/hooks/useProjects';

interface ProjectCardProps {
    project: Project;
    onEdit: (project: Project) => void;
    onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
    const getStatusIcon = () => {
        switch (project.status) {
            case 'Planning':
                return <ClipboardList className="w-5 h-5" />;
            case 'Active':
                return <Play className="w-5 h-5" />;
            case 'Completed':
                return <CheckCircle2 className="w-5 h-5" />;
        }
    };

    const statusColors: Record<Project['status'], string> = {
        Planning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        Active: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        Completed: 'bg-green-500/10 text-green-400 border-green-500/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group relative glass-card p-8 rounded-[32px] overflow-hidden border-white/5 hover:border-blue-500/30 transition-all duration-500"
        >
            {/* Hover decorative element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center shadow-inner group-hover:shadow-blue-500/20 transition-all duration-500 group-hover:scale-110">
                    <Folder className="w-8 h-8 text-blue-500 group-hover:text-blue-400" />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onEdit(project)}
                        className="p-2.5 rounded-xl bg-white/0 hover:bg-white/5 text-gray-500 hover:text-white transition-all border border-transparent hover:border-white/10"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(project._id)}
                        className="p-2.5 rounded-xl bg-white/0 hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="relative z-10">
                <h3 className="text-xl font-black text-white mb-3 group-hover:text-blue-400 transition-colors tracking-tight uppercase">
                    {project.name}
                </h3>
                <p className="text-gray-400 text-sm mb-8 line-clamp-2 h-10 leading-relaxed font-medium">
                    {project.description || 'Enterprise project under strategic management and observation.'}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 text-[10px] font-black uppercase tracking-widest ${statusColors[project.status]}`}>
                        {getStatusIcon()}
                        {project.status}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 group-hover:text-gray-400 transition-colors uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* Bottom Accent */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
        </motion.div>
    );
};

export default ProjectCard;
