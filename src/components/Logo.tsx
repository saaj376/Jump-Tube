import { Youtube } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "icon" | "text" | "full";
  className?: string;
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8", 
  lg: "h-12 w-12",
  xl: "h-16 w-16"
};

const textSizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl", 
  xl: "text-3xl"
};

export const Logo = ({ size = "md", variant = "icon", className = "" }: LogoProps) => {
  if (variant === "text") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className={`${sizeClasses[size]} bg-gradient-primary rounded-xl glow-primary flex items-center justify-center`}>
          <Youtube className="h-1/2 w-1/2 text-white" />
        </div>
        <span className={`${textSizeClasses[size]} font-bold gradient-text`}>
          JumpTube
        </span>
      </div>
    );
  }

  if (variant === "full") {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className={`${sizeClasses[size]} bg-gradient-primary rounded-2xl glow-primary flex items-center justify-center`}>
          <Youtube className="h-1/2 w-1/2 text-white" />
        </div>
        <div>
          <h1 className={`${textSizeClasses[size]} font-bold gradient-text`}>
            JumpTube
          </h1>
          <p className="text-sm text-muted-foreground">
            AI-Powered YouTube Search
          </p>
        </div>
      </div>
    );
  }

  // Default icon variant
  return (
    <div className={`${sizeClasses[size]} bg-gradient-primary rounded-xl glow-primary flex items-center justify-center ${className}`}>
      <Youtube className="h-1/2 w-1/2 text-white" />
    </div>
  );
};
