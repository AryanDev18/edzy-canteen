interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-display text-xl font-bold text-edzy-primary mb-2">{title}</h3>
      {description && <p className="text-edzy-muted font-body text-sm mb-6 max-w-xs">{description}</p>}
      {action}
    </div>
  );
}
