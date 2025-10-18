import { GlobeIcon, SmartphoneIcon } from "lucide-react";

interface Visitor {
  id: string;
  ip: string;
  location: string;
  device: "mobile" | "desktop";
  browser: string;
  page: string;
  timestamp: string;
  duration: string;
}

interface VisitorTableProps {
  visitors: Visitor[];
}

export function VisitorTable({ visitors }: VisitorTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left font-medium py-2 pl-2">Visitor</th>
            <th className="text-left font-medium py-2">Page</th>
            <th className="text-left font-medium py-2">Device</th>
            <th className="text-right font-medium py-2 pr-2">Duration</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map((visitor) => (
            <tr key={visitor.id} className="border-b hover:bg-muted/50">
              <td className="py-3 pl-2">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    <GlobeIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">{visitor.ip}</div>
                    <div className="text-xs text-muted-foreground">
                      {visitor.location}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-3">
                <div className="max-w-[180px] truncate" title={visitor.page}>
                  {visitor.page}
                </div>
                <div className="text-xs text-muted-foreground">
                  {visitor.timestamp}
                </div>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-1.5">
                  {visitor.device === "mobile" ? (
                    <SmartphoneIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-muted-foreground"
                    >
                      <rect width="18" height="12" x="3" y="4" rx="2" ry="2" />
                      <line x1="2" x2="22" y1="20" y2="20" />
                    </svg>
                  )}
                  <span>{visitor.browser}</span>
                </div>
              </td>
              <td className="py-3 text-right pr-2">{visitor.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



