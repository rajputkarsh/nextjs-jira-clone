"use client";

import { DottedSeparator } from "@/components/dotter-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCreateTaskModal } from "../../hooks/use-createTaskModal";

function TaskViewSwitcher() {
  const translations = useTranslations("TaskViewSwitcher");
    const { open } = useCreateTaskModal();

  return (
    <Tabs className="flex-1 w-full border rounded-lg">
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              {translations("table")}
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              {translations("kanban")}
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              {translations("calendar")}
            </TabsTrigger>
          </TabsList>
          <Button size={"sm"} onClick={open} className="w-full lg:w-auto">
            <PlusIcon className="size-4 mr-2" />
            {translations("new")}
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        Data Filters
        <DottedSeparator className="my-4" />
        <>
          <TabsContent value="table" className="mt-0">
            Data Table
          </TabsContent>
          <TabsContent value="kanban" className="mt-0">
            Data Kanban
          </TabsContent>
          <TabsContent value="calendar" className="mt-0">
            Data Calendar
          </TabsContent>
        </>
      </div>
    </Tabs>
  );
}

export default TaskViewSwitcher;
