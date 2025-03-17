import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { Project } from "@/features/projects/types";
import { DottedSeparator } from "@/components/dotter-separator";
import { useCreateProjectModal } from "@/features/projects/hooks/use-createProjectModal";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow, differenceInMilliseconds } from "date-fns";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar";

interface ProjectListProps {
  data: Array<Project>;
  total: number;
}

function ProjectList({ data, total }: ProjectListProps) {
  const translate = useTranslations("Project");
  const workspaceId = useWorkspaceId();

  const { open: createProject } = useCreateProjectModal();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">
            {translate("projects_total", { total })}
          </p>
          <Button
            variant={"secondary"}
            size={"icon"}
            onClick={() => createProject()}
          >
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data
            .sort((project1, project2) =>
              differenceInMilliseconds(project2.$createdAt, project1.$createdAt)
            )
            .slice(0, 3)
            .map((project) => (
              <li key={project.$id}>
                <Link
                  href={`/workspaces/${workspaceId}/projects/${project.$id}`}
                >
                  <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                    <CardContent className="p-4 flex items-center gap-x-2.5">
                      <ProjectAvatar
                        className="size-12"
                        fallbackClassName="text-lg"
                        image={project?.imageUrl}
                        name={project?.name}
                      />
                      <p className="text-lg font-medium truncate">
                        {project?.name}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            {translate("no_projects_found")}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ProjectList;
