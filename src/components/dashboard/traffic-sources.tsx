interface TrafficSourcesProps {
  data: {
    source: string;
    percentage: number;
    change: number;
  }[];
}

export function TrafficSources({ data }: TrafficSourcesProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Traffic Sources</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>{item.source}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.percentage}%</span>
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
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



