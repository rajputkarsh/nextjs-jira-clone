"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link";

function Error() {

  const translations = useTranslations("error");

  return (
    <div className="h-screen flex gap-y4 items-center justify-center">
      <AlertTriangle className="size-10" />
      <p className="text-sm">
        {translations("something_went_wrong")}
      </p>
      <Button variant={"secondary"} size="sm" asChild>
        <Link href="/">
          {translations("back_to_home")}
        </Link>
      </Button>
    </div>
  );
}

export default Error