interface SubmissionItemProps {
  name: string;
  type: string;
  timestamp: string;
}

export function SubmissionItem({ name, type, timestamp }: SubmissionItemProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{type}</p>
      </div>
      <p className="text-xs text-muted-foreground">{timestamp}</p>
    </div>
  );
}



