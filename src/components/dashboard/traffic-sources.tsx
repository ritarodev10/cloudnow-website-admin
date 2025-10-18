import { TrafficSource } from "@/types/dashboard";

interface TrafficSourcesProps {
  sources?: TrafficSource[];
}

export function TrafficSources({ sources }: TrafficSourcesProps) {
  return (
    <div className="space-y-4">
      {sources?.map((source, index) => (
        <div key={index} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="font-medium">{source.name}</div>
            <div className="flex items-center gap-2">
              <span>{source.percentage}%</span>
              <span
                className={
                  source.change.startsWith("+")
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {source.change}
              </span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${source.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
