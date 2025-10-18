import { BarChart, LineChart } from "lucide-react";

interface VisitorAnalyticsProps {
  title: string;
  data: {
    label: string;
    value: number;
    change: number;
  }[];
}

export function VisitorAnalytics({ title, data }: VisitorAnalyticsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        <div className="flex gap-1">
          <button className="p-1 rounded-sm hover:bg-muted">
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </button>
          <button className="p-1 rounded-sm hover:bg-muted">
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="text-sm">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{item.value}</span>
              <span
                className={`text-xs ${
                  item.change > 0
                    ? "text-green-500"
                    : item.change < 0
                    ? "text-red-500"
                    : "text-muted-foreground"
                }`}
              >
                {item.change > 0 ? "+" : ""}
                {item.change}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



