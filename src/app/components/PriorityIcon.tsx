"use client";

import { Priority } from "../types/ticket";

export default function PriorityIcon({ priority }: { priority: Priority }) {
  let iconSource: string;
  let label: string;
  switch (priority) {
    case "low":
      iconSource = "low-priority-icon.svg";
      label = "Low";
      break;
    case "lowest":
      iconSource = "lowest-priority-icon.svg";
      label = "Lowest";
      break;
    case "medium":
      iconSource = "medium-priority-icon.svg";
      label = "Medium";
      break;
    case "high":
      iconSource = "high-priority-icon.svg";
      label = "High";
      break;
    case "highest":
      iconSource = "highest-priority-icon.svg";
      label = "Highest";
      break;
  }
  return (
    <div className="flex gap-3">
      <img className="w-5" src={iconSource} alt={`${priority} priority`} />
      <span className="text-sm">{label}</span>
    </div>
  );
}
