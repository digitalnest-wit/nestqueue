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
  const color = colorForStatus(status);

  return (
    <span className={`${color} text-white text-xs rounded-lg p-1`}>
      {label}
    </span>
  );
}

export function StatusDot({ status }: { status: Status }) {
  const color = colorForStatus(status);
  return <div className={`${color} w-1 h-1 rounded-lg p-1`}></div>;
}

function colorForStatus(status: Status) {
  switch (status) {
    case "open":
      return "bg-green-500";
    case "inProgress":
      return "bg-yellow-500";
    case "resolved":
      return "bg-gray-400";
    case "rejected":
      return "bg-red-500";
  }
}
