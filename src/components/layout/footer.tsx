interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  return (
    <footer
      className={`bg-card/80 backdrop-blur-md h-10 border-t border-border/50 px-4 sm:px-6 ${className}`}
    >
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        CloudNow Admin Dashboard © {new Date().getFullYear()}
      </div>
    </footer>
  );
}
