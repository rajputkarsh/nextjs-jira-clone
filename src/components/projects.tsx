"use client";

import { usePathname } from "next/navigation";
import { useGetProjects } from "@/features/projects/api/use-getProjects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import { useProjectId } from "@/features/workspaces/hooks/use-projectId";
import { useTranslations } from "next-intl";
import { RiAddCircleFill } from "react-icons/ri";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCreateProjectModal } from "@/features/projects/hooks/use-createProjectModal";

function Projects() {
  const translations = useTranslations("projects");
  const { open } = useCreateProjectModal();
  const pathName = usePathname();
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();
  const { data } = useGetProjects({ workspaceId });

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase text-neutral-500 ">
          {translations("projects")}
        </p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      {(data?.documents || []).map((project) => {
        const fullHref = `/workspaces/${workspaceId}/projects/${projectId}`;
        const isActive = pathName === fullHref;

        return (
          <Link
            key={project.$id}
            href={`/workspaces/${workspaceId}/projects/${project.$id}`}
          >
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
                isActive
                  ? "bg-white shadow-sm hover:opacity-100 text-primary"
                  : ""
              )}
            >
              <span className="truncate">{project?.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default Projects;
