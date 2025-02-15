import { useTranslations } from "next-intl";
import { FolderIcon, ListChecks, UserIcon } from "lucide-react";
import { useGetMembers } from "@/features/members/api/use-getMembers";
import { useGetProjects } from "@/features/projects/api/use-getProjects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import { TASK_STATUS, TASK_STATUS_OBJECT } from "@/features/tasks/constants";
import { useTaskFilters } from "@/features/tasks/hooks/use-taskFilters";
import { capitalCase } from "@/lib/utils";

import DatePicker from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataFiltersProps {
  hideProjectFilter?: boolean;
}

function DataFilters({ hideProjectFilter }: DataFiltersProps) {
  const translations = useTranslations("DataFilters");
  const workspaceId = useWorkspaceId();

  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });

  const isLoading = isLoadingMembers || isLoadingProjects;

  const projectOptions = (projects?.documents || []).map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));

  const memberOptions = (members?.documents || []).map((member) => ({
    id: member.$id,
    name: member.name,
  }));

  const [{ status, assigneeId, projectId, search, dueDate }, setFilters] =
    useTaskFilters();

  const onStatusChange = (value: string) => {
    setFilters({ status: value === "all" ? null : (value as TASK_STATUS) });
  };

  const onAssigneeChange = (value: string) => {
    setFilters({ assigneeId: value === "all" ? null : (value as string) });
  };

  const onProjectChange = (value: string) => {
    setFilters({ projectId: value === "all" ? null : (value as string) });
  };

  const onDateChange = (value: Date) => {
    setFilters({ dueDate: value ? value.toISOString() : undefined });
  };

  if (isLoading) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select
        defaultValue={status || undefined}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListChecks className="size-4 mr-2" />
            <SelectValue placeholder={translations("all_statuses")} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{translations("all_statuses")}</SelectItem>
          <SelectSeparator />
          {Object.values(TASK_STATUS_OBJECT).map((taskStatus) => (
            <SelectItem key={taskStatus.key} value={taskStatus.key}>
              <div className="flex items-center gap-x-2">
                {taskStatus.message}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={assigneeId || undefined}
        onValueChange={(value) => onAssigneeChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder={translations("all_assignees")} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{translations("all_assignees")}</SelectItem>
          <SelectSeparator />
          {memberOptions.map((member) => (
            <SelectItem key={member.id} value={member.id}>
              <div className="flex items-center gap-x-2">
                {capitalCase(member.name)}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={projectId || undefined}
        onValueChange={(value) => onProjectChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <FolderIcon className="size-4 mr-2" />
            <SelectValue placeholder={translations("all_projects")} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{translations("all_projects")}</SelectItem>
          <SelectSeparator />
          {projectOptions.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              <div className="flex items-center gap-x-2">
                {capitalCase(project.name)}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DatePicker
        placeholder={translations("due_date")}
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) => {
          onDateChange(date);
        }}
      />
    </div>
  );
}

export default DataFilters;
