"use client";

import { useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";
import AnalyticsCard from "@/components/analytics-card";
import { ResponseType as ProjectAnalyticsResponseType } from "@/features/projects/api/use-getProjectAnalyticsById";

interface AnalyticsProps extends ProjectAnalyticsResponseType {
  
};

function Analytics({ data }: AnalyticsProps) {

  const translate = useTranslations("analytics");

  console.log(`data -- `, data);

  if (!data) return null;

  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title={translate("total_tasks")}
            value={data.taskCount}
            variant={data.taskDifference > 0 ? "up" : "down"}
            increaseValue={data.taskDifference}
          />
        </div>
      </div>
    </ScrollArea>
  );
}

export default Analytics