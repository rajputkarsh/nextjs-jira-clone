"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import { useGetMembers } from "@/features/members/api/use-getMembers";
import { useUpdateMember } from "@/features/members/api/use-UpdateMember";
import { useDeleteMember } from "@/features/members/api/use-deleteMember";
import MemberAvatar from "@/features/members/components/MemberAvatar";
import { MemberRole } from "@/features/members/types";
import useConfirm from "@/hooks/use-confirm";
import { Separator } from "@/components/ui/separator";
import { DottedSeparator } from "@/components/dotter-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { capitalCase } from "@/lib/utils";

function MembersList() {
  const translations = useTranslations("MembersList");
  const workspaceId = useWorkspaceId();
  const { mutate: updateMember, isPending: isUpdateMemberPending } =
    useUpdateMember();
  const { mutate: deleteMember, isPending: isDeleteMemberPending } =
    useDeleteMember();

  const [DeleteDialog, confirmDelete] = useConfirm(
    translations("remove_member"),
    translations("this_member_will_be_removed_from_the_workspace"),
    "destructive"
  );

  const { data } = useGetMembers({ workspaceId });

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({ json: { role }, param: { memberId } });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <DeleteDialog />
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
          <Fragment key={`member_${index}`}>
            <div className="flex items-center gap-2" key={member.$id}>
              <MemberAvatar
                name={member.name}
                className="size-10"
                fallbackClassName="text-lg"
              />
              <div className="flex flex-col">
                <p className="text-sm cursor-pointer font-medium">
                  {capitalCase(member.name)}
                </p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="ml-auto"
                    variant={"secondary"}
                    size={"icon"}
                  >
                    <MoreVerticalIcon className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="cursor-pointer font-medium"
                    onClick={() =>
                      handleUpdateMember(member.$id, MemberRole.ADMIN)
                    }
                    disabled={isUpdateMemberPending || isDeleteMemberPending}
                  >
                    {translations("set_as_administrator")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer font-medium"
                    onClick={() =>
                      handleUpdateMember(member.$id, MemberRole.MEMBER)
                    }
                    disabled={isUpdateMemberPending || isDeleteMemberPending}
                  >
                    {translations("set_as_member")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer font-medium text-amber-700"
                    onClick={() => handleDeleteMember(member.$id)}
                    disabled={isUpdateMemberPending || isDeleteMemberPending}
                  >
                    {translations("remove", {
                      name: capitalCase(member.name),
                    })}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {index < (data?.documents?.length || 0) - 1 ? (
              <Separator className="my-2.5 bg-neutral-200" />
            ) : null}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
}

export default MembersList;
