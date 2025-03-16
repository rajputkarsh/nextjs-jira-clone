"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ResponseType as ProjectAnalyticsResponseType } from "@/features/projects/api/use-getProjectAnalyticsById";

interface AnalyticsProps {
  data?: ProjectAnalyticsResponseType;
}

function Analytics({ data }: AnalyticsProps) {

  if (!data) return null;

  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1">
          
        </div>
      </div>
    </ScrollArea>
  )
}

export default Analytics