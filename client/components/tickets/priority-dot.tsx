import { Priority } from "@/lib/types/ticket";

interface PriorityDotProps {
  priority: Priority;
}

export default function PriorityDot({ priority }: PriorityDotProps) {
  let color: string;

  switch (priority) {
    case 1:
      color = "bg-rose-500 text-white";
      break;
    case 2:
      color = "bg-orange-500 text-white";
      break;
    case 3:
      color = "bg-amber-500 text-white";
      break;
    case 4:
      color = "bg-teal-500 text-white";
      break;
    case 5:
      color = "bg-sky-500 text-white";
      break;
  }

  return (
    <div className={`size-5 rounded-full pl-1.5 ${color} shadow-sm`}>
      {priority}
    </div>
  );
}
