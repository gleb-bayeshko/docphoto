import { LoaderCircle } from "lucide-react";
import { cn } from "~/lib/utils";

export const Spinner = ({ className }: { className?: string }) => {
  return <LoaderCircle className={cn("animate-spin w-6 h-6", className)} />;
};
