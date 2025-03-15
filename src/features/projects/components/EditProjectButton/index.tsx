"use client";

import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface EditProjectButtonProps {
  workspaceId: string;
  projectId: string;
}

function EditProjectButton({ workspaceId, projectId }: EditProjectButtonProps) {
  const translations = useTranslations("projects");
  return (
    <Button variant="secondary" size="sm" asChild>
      <Link
        href={`/workspaces/${workspaceId}/projects/${projectId}/settings`}
      >
        <PencilIcon />
        {translations("edit")}
      </Link>
    </Button>
  );
}

export default EditProjectButton