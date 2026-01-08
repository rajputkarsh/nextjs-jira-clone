"use client";

import { useTranslations } from "next-intl";
import { useGetWorklogs } from "@/features/worklogs/api/use-getWorklogs";
import { formatEfforts } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotter-separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useWorklogDialog } from "@/features/worklogs/hooks/use-worklogDialog";
import MemberAvatar from "@/features/members/components/MemberAvatar";
import { format } from "date-fns";
import { Loader } from "lucide-react";

interface TaskWorklogsProps {
  taskId: string;
}

function TaskWorklogs({ taskId }: TaskWorklogsProps) {
  const translations = useTranslations("Worklogs");
  const { data: worklogs, isLoading } = useGetWorklogs({ taskId });
  const { open } = useWorklogDialog();

  const totalEfforts = worklogs?.documents?.reduce(
    (sum, worklog) => sum + (worklog.efforts || 0),
    0
  ) || 0;

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-8">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex p-7">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-xl font-bold">
            {translations("worklogs")}
          </CardTitle>
          <Button
            onClick={() => open(taskId)}
            size="sm"
            variant="secondary"
            className="gap-2"
          >
            <Plus className="size-4" />
            {translations("add_worklog")}
          </Button>
        </div>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col gap-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <span className="font-semibold">{translations("total_efforts")}:</span>
            <span className="font-medium">{formatEfforts(totalEfforts)}</span>
          </div>
          
          {worklogs?.documents && worklogs.documents.length > 0 ? (
            <div className="flex flex-col gap-y-3">
              {worklogs.documents.map((worklog) => (
                <div
                  key={worklog.$id}
                  className="flex items-start gap-x-4 p-4 border rounded-lg"
                >
                  <MemberAvatar
                    name={(worklog as any).member?.name || "Unknown"}
                    className="size-8"
                  />
                  <div className="flex-1 flex flex-col gap-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">
                        {(worklog as any).member?.name || "Unknown"}
                      </p>
                      <div className="flex items-center gap-x-4 text-sm text-muted-foreground">
                        <span>{formatEfforts(worklog.efforts)}</span>
                        <span>
                          {format(new Date(worklog.date), "MMM dd, yyyy")}
                        </span>
                      </div>
                    </div>
                    {worklog.description && (
                      <p className="text-sm text-muted-foreground">
                        {worklog.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>{translations("no_worklogs")}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default TaskWorklogs;
