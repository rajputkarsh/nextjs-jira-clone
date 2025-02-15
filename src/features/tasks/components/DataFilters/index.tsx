import { useTranslations } from "next-intl";
import { ListChecks } from "lucide-react";
import { useGetMembers } from "@/features/members/api/use-getMembers";
import { useGetProjects } from "@/features/projects/api/use-getProjects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import { TASK_STATUS, TASK_STATUS_OBJECT } from "@/features/tasks/constants";
import { useTaskFilters } from "@/features/tasks/hooks/use-taskFilters";

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
    setFilters({ status: value === "all" ? null: value as TASK_STATUS });
  }

  if (isLoading) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select defaultValue={status || undefined} onValueChange={(value) => onStatusChange(value)}>
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
    </div>
  );
}

export default DataFilters;
