import React from "react";

type Props = {
  // Title of the stat, e.g. "Total Requests"
  title: string;
  // Numerical value or formatted string, e.g. 12 or "$1,250"
  value: number | string;
  // Lucide icon component
  icon: React.ComponentType<{ className?: string }>;
  // Tailwind color classes for the icon, e.g. "text-[#9E5739]"
  iconColor?: string;
  // Tailwind background classes for the icon badge, e.g. "bg-[#FAF6F0]"
  iconBg?: string;
  // Optional brief description or subtitle
  description?: string;
};

// Reusable stat card for Customer & Admin dashboards
export default function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-[#9E5739]",
  iconBg = "bg-[#FAF6F0]",
  description,
}: Props) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-[#EFECE6] shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
      {/* Top row: Stat title and colored icon badge */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#2D241E]/70">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Middle row: Large stat counter value */}
      <div className="mt-4">
        <span className="font-serif text-3xl font-bold text-[#2D241E]">
          {value}
        </span>
        {description && (
          <p className="mt-1 text-xs text-[#2D241E]/60">{description}</p>
        )}
      </div>
    </div>
  );
}
