interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingSpinner = ({
  size = "md",
  className = "",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div
      className={`animate-spin rounded-full border-b-2 border-violet-600 ${sizeClasses[size]} ${className}`}
    ></div>
  );
};

interface LoadingPageProps {
  message?: string;
}

export const LoadingPage = ({ message = "Loading..." }: LoadingPageProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
