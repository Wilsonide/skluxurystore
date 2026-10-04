import { Spinner } from "./spinner";

interface CenteredSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  fullScreen?: boolean;
}

export function CenteredSpinner({
  size = "lg",
  fullScreen = false,
}: CenteredSpinnerProps) {
  return (
    <div
      className={
        fullScreen
          ? "fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm"
          : "flex items-center justify-center py-10"
      }
    >
      <Spinner size={size} />
    </div>
  );
}
