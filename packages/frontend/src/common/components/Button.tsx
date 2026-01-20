import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'glass' | 'social';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'medium', fullWidth = false, loading = false, icon, disabled, className = '', ...props }) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg";

    const variantClasses = {
        primary: "bg-purple-1 text-white hover:bg-purple-1-hover focus:ring-blue-500 disabled:bg-blue-300",
        secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-300',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 disabled:border-blue-300 disabled:text-blue-300',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
        glass: 'bg-[#0a1929] hover:bg-[#0d2137] text-white font-semibold shadow-[0_4px_14px_0_rgba(0,0,0,0.4)] focus:ring-[#00d4ff]/50 focus:ring-offset-transparent',
        social: 'bg-white hover:bg-gray-50 shadow-[0_4px_12px_0_rgba(0,0,0,0.15)] focus:ring-gray-300 focus:ring-offset-0',
    };

    const sizeClasses = {
        small: 'px-3 py-1.5 text-sm',
        medium: 'px-4 py-2 text-base',
        large: 'px-6 py-3 text-lg',
    };

    const classes = [
        baseClasses,
        variant ? variantClasses[variant] : '',
        size ? sizeClasses[size] : '',
        fullWidth && "w-full",
        (disabled || loading) && "cursor-not-allowed opacity-60",
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            className={classes}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            )}
            {icon && !loading && icon}
            {children}
        </button>
    );
};

export default Button;
