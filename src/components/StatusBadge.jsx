import React from "react";
import { Circle, Play, CheckCircle } from "lucide-react";

export default function StatusBadge({ status }) {
  let className = "inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold uppercase tracking-wider ";
  let icon = null;

  switch (status?.toLowerCase()) {
    case "upcoming":
      className += "bg-blue-100 text-status-upcoming";
      icon = <Circle size={10} fill="currentColor" />;
      break;
    case "ongoing":
      className += "bg-amber-100 text-status-ongoing animate-pulse-border";
      icon = <Play size={10} fill="currentColor" />;
      break;
    case "completed":
      className += "bg-emerald-100 text-status-completed";
      icon = <CheckCircle size={10} fill="currentColor" />;
      break;
    default:
      className += "bg-blue-100 text-status-upcoming";
      icon = <Circle size={10} fill="currentColor" />;
  }

  return (
    <span className={className}>
      {icon}
      {status}
    </span>
  );
}
