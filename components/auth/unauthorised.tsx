import { TriangleAlert } from "lucide-react";
import { CardWrapper } from "./card-wrapper";

const Unauthorized = () => {
  return (
    <CardWrapper
      headerLabel="Ooops! you dont have the permission!"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="w-full flex items-center justify-center">
        <TriangleAlert className="text-destructive" />
      </div>
    </CardWrapper>
  );
};

export default Unauthorized;
