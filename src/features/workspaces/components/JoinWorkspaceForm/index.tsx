"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { DottedSeparator } from "@/components/dotter-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useJoinWorkspace } from "@/features/workspaces/api/use-JoinWorkspace";
import { useInviteCode } from "@/features/workspaces/hooks/use-inviteCode";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import { useRouter } from "next/navigation";

interface JoinWorkspaceFormProps {
  initialValues: {
    name: string;
  };
}

function JoinWorkspaceForm({ initialValues }: JoinWorkspaceFormProps) {
  const translations = useTranslations("JoinWorkspaceForm");
  const router = useRouter();
  const code = useInviteCode();
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useJoinWorkspace();

  const handleInvite = () => {
    mutate({
      param: { workspaceId },
      json: { code }
    }, {
      onSuccess: ({ data }) => {
        router.push(`/workspaces/${data.$id}`)
      }
    })
  }

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">
          {translations("join_workspace")}
        </CardTitle>
        <CardDescription>
          <span
            dangerouslySetInnerHTML={{
              __html: translations("youve_been_invited_to_join_workspace", {
                name: `<strong>${initialValues.name}</strong>`,
              }),
            }}
          />
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col gap-2 lg:flex-row items-center justify-between">
          <Button
            type="button"
            variant="secondary"
            asChild
            className="w-full lg:w-fit"
            size={"lg"}
            disabled={isPending}
          >
            <Link href={"/"}>{translations("cancel")}</Link>
          </Button>
          <Button
            type="button"
            variant="primary"
            className="w-full lg:w-fit"
            size={"lg"}
            onClick={handleInvite}
            disabled={isPending}
          >
            {translations("join_workspace")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default JoinWorkspaceForm;
