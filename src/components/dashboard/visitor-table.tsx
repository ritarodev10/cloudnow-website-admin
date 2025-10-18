import { Visitor } from "@/types/dashboard";

interface VisitorTableProps {
  visitors?: Visitor[];
}

export function VisitorTable({ visitors }: VisitorTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="pb-2 text-left font-medium">Visitor</th>
            <th className="pb-2 text-left font-medium">Page</th>
            <th className="pb-2 text-right font-medium">Device</th>
            <th className="pb-2 text-right font-medium">Duration</th>
          </tr>
        </thead>
        <tbody>
          {visitors?.map((visitor, index) => (
            <tr key={index} className="border-b last:border-0">
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-muted p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-3"
                    >
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">{visitor.ip}</div>
                    <div className="text-xs text-muted-foreground">
                      {visitor.location}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-3">{visitor.page}</td>
              <td className="py-3 text-right">{visitor.device}</td>
              <td className="py-3 text-right">{visitor.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
