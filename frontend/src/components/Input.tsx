import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
    return (
        <div className="w-full mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            <input
                {...props}
                className={`w-full px-4 py-2 bg-white/5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-white placeholder-gray-500 backdrop-blur-sm ${error ? 'border-red-500 focus:ring-red-500' : 'border-white/10'
                    }`}
            />
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>
    );
};

export default Input;
