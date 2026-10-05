"use client";

import React from "react";

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

import { BackButton } from "./BackButton";
import { Header } from "./Heading";
import { Social } from "./Social";

interface CardComponentProp {
  children: React.ReactNode;
  headerLabel: string;
  headerTitle?: string;
  backButtonLabel?: string;
  backButtonLink?: string;
  backButtonHref?: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
  backButtonLink,
}: CardComponentProp) => {
  return (
    <Card
      className="
        mx-auto
        w-full
        max-w-md
        overflow-hidden
        rounded-2xl
        border-brand-border
        bg-brand-warm-white
        shadow-lg
        shadow-brand-espresso/5
      "
    >
      {/* Header */}
      <CardHeader className="px-5 pt-5 sm:px-7 sm:pt-7">
        <Header label={headerLabel} />
      </CardHeader>

      {/* Form Content */}
      <CardContent className="px-5 pb-5 sm:px-7 sm:pb-7">
        {children}
      </CardContent>

      {/* Social Login */}
      {showSocial && (
        <CardFooter className="px-5 sm:px-7">
          <Social />
        </CardFooter>
      )}

      {/* Back Button */}
      <CardFooter className="border-t border-brand-border px-5 py-4 sm:px-7">
        <BackButton
          label={backButtonLabel || ""}
          href={backButtonHref || ""}
          link={backButtonLink || ""}
        />
      </CardFooter>
    </Card>
  );
};
