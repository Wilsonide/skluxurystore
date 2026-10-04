interface BackButtonProps {
  href: string;
  label: string;
  link: string;
}

import NavLink from "next/link";
import { Button } from "../ui/button";

export const BackButton = ({ href, label, link }: BackButtonProps) => {
  return (
    <>
      <span>{label}</span>
      <Button
        variant="link"
        className="font-medium text-sm text-blue-600 hover:underline"
        size="sm"
        asChild
      >
        <NavLink className="" href={href}>
          {link}
        </NavLink>
      </Button>
    </>
  );
};
