"use client";

import { Status } from "../types/ticket";

export default function StatusChip({ status }: { status: Status }) {
  // Capitalize the first character and add spaces between camelCase words
  let label = status.substring(0, 1).toUpperCase();
  for (const char of status.substring(1)) {
    if (char == char.toUpperCase()) {
      label += ` ${char}`;
      continue;
    }
    label += char;
  }

  // Set the background color of the chip depending on the status
  let color: string;
  switch (status) {
    case "open":
      color = "bg-green-500";
      break;
    case "inProgress":
      color = "bg-yellow-500";
      break;
    case "resolved":
      color = "bg-gray-400";
      break;
    case "rejected":
      color = "bg-red-500";
      break;
  }

  const classes = `${color} text-white text-xs rounded-lg p-1`;
  return <span className={classes}>{label}</span>;
}
