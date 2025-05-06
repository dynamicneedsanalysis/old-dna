"use client";

// Takes: A card description, the value of the card, and an optional icon.
export function StatCard({
  description,
  value,
  icon,
}: {
  description: string;
  value: string | number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-muted flex h-full items-center justify-between rounded-2xl p-2">
      <div className="p-4">
        <div className="mb-4 text-sm">{description}</div>
        <div className="text-3xl font-bold">{value}</div>
      </div>
      {icon && <div>{icon}</div>}
    </div>
  );
}
