import { cn } from "@/lib/utils";

type RideStatus = "pending" | "scheduled" | "en_route" | "completed" | "cancelled";

interface StatusBadgeProps {
  status: RideStatus | string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "status-pending",
  },
  scheduled: {
    label: "Scheduled",
    className: "status-scheduled",
  },
  en_route: {
    label: "En Route",
    className: "status-en-route",
  },
  completed: {
    label: "Completed",
    className: "status-completed",
  },
  cancelled: {
    label: "Cancelled",
    className: "status-cancelled",
  },
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status] || {
    label: status.replace("_", " "),
    className: "bg-muted text-muted-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
