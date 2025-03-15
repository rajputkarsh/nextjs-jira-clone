import { useState } from "react";
import { PencilIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DottedSeparator } from "@/components/dotter-separator";

import { useUpdateTask } from "@/features/tasks/api/use-updateTask";
import { Task } from "@/features/tasks/schema";
import { useTranslations } from "next-intl";

interface TaskDescriptionProps {
  task: Task;
}

function TaskDescription({ task }: TaskDescriptionProps) {
  const translate = useTranslations("Task");
  const { mutate: updateDescription, isPending } = useUpdateTask();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const handleSave = () => {
    updateDescription({
      param: { taskId: task.$id },
      json: { description: value },
    });
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">{translate("overview")}</p>
        <Button
          onClick={() => setIsEditing((prev) => !prev)}
          size={"sm"}
          variant={"secondary"}
        >
          {isEditing ? (
            <>
              <XIcon className="size-4 mr-2" />
              {translate("cancel")}
            </>
          ) : (
            <>
              <PencilIcon className="size-4 mr-2" />
              {translate("edit")}
            </>
          )}
        </Button>
      </div>
      <DottedSeparator className="my-4" />
      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            disabled={isPending}
            placeholder={translate("add_a_description")}
            value={value}
            rows={4}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            size="sm"
            className="w-fit ml-auto"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? translate("saving") : translate("save_changes")}
          </Button>
        </div>
      ) : (
        <div>
          {task.description || (
            <span className="text-muted-foreground">
              {translate("no_description_set")}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskDescription;
