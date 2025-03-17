import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Member } from "@/features/members/types";
import { DottedSeparator } from "@/components/dotter-separator";
import { Card, CardContent } from "@/components/ui/card";
import { differenceInMilliseconds } from "date-fns";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import MemberAvatar from "@/features/members/components/MemberAvatar";

interface MemberListProps {
  data: Array<Member>;
  total: number;
}

function MemberList({ data, total }: MemberListProps) {
  const translate = useTranslations("Member");
  const workspaceId = useWorkspaceId();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">
            {translate("members_total", { total })}
          </p>
          <Button variant={"secondary"} size={"icon"} asChild>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <Settings className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data
            .sort((member1, member2) =>
              differenceInMilliseconds(member2.$createdAt, member1.$createdAt)
            )
            .slice(0, 3)
            .map((member) => (
              <li key={member.$id}>
                <Card className="shadow-none rounded-lg overflow-hidden">
                  <CardContent className="p-3 flex flex-col items-center gap-x-2">
                    <MemberAvatar className="size-12" name={member?.name} />
                    <div className="flex flex-col items-center overflow-hidden">
                      <p className="text-sm font-medium line-clamp-1">
                        {member?.name}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {member?.email}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            {translate("no_members_found")}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MemberList;
