import React from "react";

interface LogoSmallProps {
  className?: string;
  variant?: "default" | "light" | "dark";
  size?: "sm" | "md" | "lg" | "xl";
  showIcon?: boolean;
}

const LogoSmall: React.FC<LogoSmallProps> = ({
  className = "",
  variant = "default",
  size = "md",
  showIcon = true,
}) => {
  // Enhanced size variants with better scaling
  const sizeClasses = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-4xl",
  };

  // Enhanced variant styles with better contrast
  const variantClasses = {
    default: "text-slate-900 dark:text-slate-50",
    light: "text-slate-600 dark:text-slate-300",
    dark: "text-slate-50",
  };

  // Icon size based on text size
  const iconSizes = {
    sm: { dot: "w-1.5 h-1.5", ring: "w-3 h-3" },
    md: { dot: "w-2 h-2", ring: "w-4 h-4" },
    lg: { dot: "w-2.5 h-2.5", ring: "w-5 h-5" },
    xl: { dot: "w-3 h-3", ring: "w-6 h-6" },
  };

  return (
    <div className={`flex items-center gap-3 group ${className}`}>
      <span
        className={`
          font-black
          tracking-wide
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          transition-all
          duration-500
          ease-out
          group-hover:scale-105
          group-hover:tracking-wider
          select-none
          leading-none
          font-[var(--font-geist-sans),_system-ui,_sans-serif]
          cursor-pointer
          relative
        `}
        style={{
          letterSpacing: "0.05em",
          textShadow: variant === "dark" ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
        }}
      >
        barid
        <span className="ml-1 font-light italic text-blue-600 dark:text-blue-400">
          ai
        </span>
      </span>

      {showIcon && (
        <div className="relative flex items-center justify-center">
          {/* Enhanced animated dot with multiple layers */}
          <span className={`relative flex ${iconSizes[size].ring}`}>
            {/* Outer pulse ring */}
            <span
              className={`
                animate-ping-slow
                absolute
                inline-flex
                h-full
                w-full
                rounded-full
                bg-blue-500
                dark:bg-blue-400
                opacity-20
              `}
            />
            {/* Middle pulse ring */}
            <span
              className={`
                animate-pulse-medium
                absolute
                inline-flex
                h-3/4
                w-3/4
                top-1/2
                left-1/2
                transform
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-blue-600
                dark:bg-blue-300
                opacity-40
              `}
            />
            {/* Core dot */}
            <span
              className={`
                relative
                inline-flex
                ${iconSizes[size].dot}
                top-1/2
                left-1/2
                transform
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-gradient-to-br
                from-blue-500
                to-blue-700
                dark:from-blue-400
                dark:to-blue-600
                shadow-lg
                transition-all
                duration-300
                group-hover:shadow-blue-500/50
                group-hover:scale-110
              `}
            />
          </span>
        </div>
      )}
    </div>
  );
};

export default LogoSmall;

/* Add this to your global CSS (e.g., globals.css) if not already present:
@keyframes ping-slow {
  0% { transform: scale(1); opacity: 0.6; }
  70% { transform: scale(2.2); opacity: 0; }
  100% { transform: scale(2.2); opacity: 0; }
}

@keyframes pulse-medium {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

.animate-ping-slow {
  animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-pulse-medium {
  animation: pulse-medium 1.5s ease-in-out infinite;
}
*/
