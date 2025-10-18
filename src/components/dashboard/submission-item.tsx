import { SubmissionItem as SubmissionItemType } from "@/types/dashboard";

interface SubmissionItemProps {
  submission: SubmissionItemType;
}

export function SubmissionItem({ submission }: SubmissionItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">{submission.name}</p>
        <p className="text-sm text-muted-foreground">{submission.type}</p>
      </div>
      <div className="text-sm text-muted-foreground">{submission.time}</div>
    </div>
  );
}
