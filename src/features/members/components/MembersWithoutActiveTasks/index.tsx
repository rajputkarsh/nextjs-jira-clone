import { useTranslations } from "next-intl";
import { Member } from "@/features/members/types";
import { Task } from "@/features/tasks/schema";
import { TASK_STATUS } from "@/features/tasks/constants";
import { DottedSeparator } from "@/components/dotter-separator";
import { Card, CardContent } from "@/components/ui/card";
import { differenceInMilliseconds } from "date-fns";
import MemberAvatar from "@/features/members/components/MemberAvatar";
import { useMemo } from "react";

interface MembersWithoutActiveTasksProps {
  members: Array<Member>;
  tasks: Array<Task>;
}

function MembersWithoutActiveTasks({ members, tasks }: MembersWithoutActiveTasksProps) {
  const translate = useTranslations("Member");

  // Filter members who:
  // 1. Don't have any assigned tasks, OR
  // 2. Don't have any tasks in BACKLOG, TODO, or IN_PROGRESS statuses
  const membersWithoutActiveTasks = useMemo(() => {
    return members.filter((member) => {
      // Get all tasks assigned to this member
      const memberTasks = tasks.filter(
        (task) => task.assignee?.userId === member.userId
      );

      // If member has no tasks at all, include them
      if (memberTasks.length === 0) {
        return true;
      }

      // Check if member has any tasks in BACKLOG, TODO, or IN_PROGRESS
      const hasActiveTasks = memberTasks.some((task) =>
        [TASK_STATUS.BACKLOG, TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS].includes(
          task.status as TASK_STATUS
        )
      );

      // Include if they don't have active tasks
      return !hasActiveTasks;
    });
  }, [members, tasks]);

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">
            {translate("members_without_active_tasks_total", {
              total: membersWithoutActiveTasks.length,
            })}
          </p>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {membersWithoutActiveTasks
            .sort((member1, member2) =>
              differenceInMilliseconds(member2.$createdAt, member1.$createdAt)
            )
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
          {membersWithoutActiveTasks.length === 0 && (
            <li className="text-sm text-muted-foreground text-center col-span-full">
              {translate("all_members_have_active_tasks")}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default MembersWithoutActiveTasks;

