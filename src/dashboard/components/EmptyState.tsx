export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-black/10 bg-white px-6 py-14 text-center">
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}
