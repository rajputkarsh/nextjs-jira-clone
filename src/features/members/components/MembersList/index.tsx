"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import { DottedSeparator } from "@/components/dotter-separator";
import { useGetMembers } from "@/features/members/api/use-getMembers";
import MemberAvatar from "../MemberAvatar";
import { Separator } from "@/components/ui/separator";

function MembersList() {
  const translations = useTranslations("MembersList");
  const workspaceId = useWorkspaceId();
  const { data } = useGetMembers({ workspaceId });

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button asChild variant={"secondary"} size={"sm"}>
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeftIcon className="size-4 mr-2" />
            {translations("back")}
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">
          {translations("members_list")}
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        {(data?.documents || []).map((member, index) => (
          <Fragment>
            <div className="flex items-center gap-2" key={member.$id}>
              <MemberAvatar
                name={member.name}
                className="size-10"
                fallbackClassName="text-lg"
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
              <Button className="ml-auto" variant={"secondary"} size={"icon"}>
                <MoreVerticalIcon className="size-4 text-muted-foreground" />
              </Button>
            </div>
            {
              index < (data?.documents?.length || 0) - 1 ? <Separator className="my-2.5 bg-neutral-200" /> : null
            }
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
}

export default MembersList;
