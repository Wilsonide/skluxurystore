import { CircleCheck } from "lucide-react";
interface FormSuccessProps {
  message?: string;
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) {
    return null;
  }
  return (
    <div className="bg-emerald-500/15 flex items-center p-3 gap-x-2 text-sm text-emerald-500">
      <CircleCheck className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
