import { Loader2Icon } from "lucide-react";

export async function Loading() {
  return (
    <div className="animate-out flex h-[calc(100dvh-72px)] items-center justify-center">
      <div className="flex items-center justify-center gap-2">
        <Loader2Icon className="h-10 w-10 animate-spin" />
        <span className="text-3xl font-bold">Loading...</span>
      </div>
    </div>
  );
}
