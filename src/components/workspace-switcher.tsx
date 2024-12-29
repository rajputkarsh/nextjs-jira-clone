"use client";

import { useGetWorkspace } from "@/features/workspaces/api/use-getWorkspaces";
import { useTranslations } from "next-intl";
import { RiAddCircleFill } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import WorkspaceAvatar from "@/features/workspaces/components/WorkspaceAvatar";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";

function WorkspaceSwitcher() {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const translations = useTranslations("WorkspaceSwitcher");
  const { data: workspaces } = useGetWorkspace();

  const handleSelect = (id: string) => {
    router.push(`/workspaces/${id}`);
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase text-neutral-500 ">
          {translations("workspaces")}
        </p>
        <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
      </div>
      <Select onValueChange={handleSelect} value={workspaceId}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
          <SelectValue placeholder={translations("no_workspace_selected")} />
        </SelectTrigger>
        <SelectContent>
          {workspaces?.documents?.map((workspace) => (
            <SelectItem key={workspace.$id} value={workspace.$id}>
              <div className="flex justify-center items-center gap-2 font-medium">
                <WorkspaceAvatar
                  name={workspace.name}
                  image={workspace?.imageUrl}
                />
                <span className="truncate">{workspace?.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default WorkspaceSwitcher;