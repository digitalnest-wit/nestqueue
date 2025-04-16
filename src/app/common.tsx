import { Status } from "./types/ticket";

export function formatStatusLabel(status: Status) {
  // Capitalize the first character and add spaces between camelCase words
  let label = status.substring(0, 1).toUpperCase();
  for (const char of status.substring(1)) {
    if (char == char.toUpperCase()) {
      label += ` ${char}`;
      continue;
    }
    label += char;
  }
  return label;
}

export function colorForStatus(status: Status) {
  switch (status) {
    case "open":
      return "green-500";
    case "inProgress":
      return "yellow-500";
    case "resolved":
      return "gray-400";
    case "rejected":
      return "red-500";
  }
}
