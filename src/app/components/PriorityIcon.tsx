"use client";

import { Priority } from "../types/ticket";

export default function PriorityIconLabel({
  priority,
}: {
  priority: Priority;
}) {
  let iconSource = priorityImageName(priority);
  // The label is the raw string value, with the first character capitalized.
  let label = priority.substring(0, 1).toUpperCase() + priority.substring(1);
  return (
    <div className="flex gap-3">
      <img className="w-5" src={iconSource} alt={`${priority} priority`} />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function priorityImageName(priority: Priority) {
  switch (priority) {
    case "low":
      return "/low-priority-icon.svg";
    case "lowest":
      return "/lowest-priority-icon.svg";
    case "medium":
      return "/medium-priority-icon.svg";
    case "high":
      return "/high-priority-icon.svg";
    case "highest":
      return "/highest-priority-icon.svg";
  }
}
