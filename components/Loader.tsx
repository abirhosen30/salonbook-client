export default function Loader({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div
        className={`${sizeClasses[size]} border-[#9E5739]/20 border-t-[#9E5739] rounded-full animate-spin`}
      />
    </div>
  );
}
