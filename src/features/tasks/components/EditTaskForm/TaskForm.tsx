"use client";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "@/components/date-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateTaskSchema, ITask } from "@/features/tasks/schema";
import { DottedSeparator } from "@/components/dotter-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateTask } from "@/features/tasks/api/use-updateTask";
import { capitalCase, cn, formatEfforts } from "@/lib/utils";
import MemberAvatar from "@/features/members/components/MemberAvatar";
import { TASK_STATUS, TASK_STATUS_OBJECT } from "@/features/tasks/constants";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar";
import { toast } from "sonner";

interface ITaskFormProps {
  onCancel?: () => void;
  id: string;
  initialValues: ITask;
  projectOptions: Array<{ id: string; name: string; imageUrl: string }>;
  memberOptions: Array<{ id: string; name: string }>;
}

function TaskForm({
  id,
  initialValues,
  onCancel,
  projectOptions,
  memberOptions,
}: ITaskFormProps) {
  const { mutate, isPending } = useUpdateTask();
  const translations = useTranslations("UpdateTaskForm");

  const form = useForm<z.infer<typeof updateTaskSchema>>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      ...initialValues,
      status: initialValues.status as TASK_STATUS,
      dueDate: initialValues.dueDate
        ? new Date(initialValues.dueDate)
        : undefined,
      description: initialValues.description ? initialValues.description : undefined,
      estimatedEfforts: initialValues.estimatedEfforts ? initialValues.estimatedEfforts : undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof updateTaskSchema>) => {
    mutate(
      {
        param: {
          taskId: id,
        },
        json: {
          ...values,
        },
      },
      {
        onSuccess: ({ data }) => {
          form.reset();
          onCancel?.();
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          {translations("update_task")}
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{translations("task")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={translations("task_placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{translations("due_date")}</FormLabel>
                      <FormControl>
                        <DatePicker
                          {...field}
                          placeholder={translations("select_date")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{translations("assignee")}</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={translations("assignee_placeholder")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {memberOptions.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              <div className="flex items-center gap-x-2">
                                <MemberAvatar
                                  className="size-6"
                                  name={member.name}
                                />
                                {capitalCase(member.name)}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{translations("status")}</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={translations("status_placeholder")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {Object.values(TASK_STATUS_OBJECT).map(
                            (taskStatus) => (
                              <SelectItem
                                key={taskStatus.key}
                                value={taskStatus.key}
                              >
                                <div className="flex items-center gap-x-2">
                                  {taskStatus.message}
                                </div>
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{translations("project")}</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={translations("project_placeholder")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {projectOptions.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              <div className="flex items-center gap-x-2">
                                <ProjectAvatar
                                  image={project.imageUrl}
                                  className="size-6"
                                  name={project.name}
                                />
                                {project.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="estimatedEfforts"
                render={({ field }) => {
                  const formattedTime = formatEfforts(field.value);
                  return (
                    <FormItem>
                      <FormLabel>{translations("estimated_efforts")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          step="1"
                          placeholder={translations("estimated_efforts_placeholder")}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (!value) {
                              toast.error(translations("estimated_efforts_required"));
                              return;
                            }
                            const numValue = parseInt(value, 10);
                            if (!isNaN(numValue)) {
                              field.onChange(numValue);
                            }
                          }}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      {formattedTime && (
                        <p className="text-sm text-muted-foreground">
                          {formattedTime}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <DottedSeparator className="py-7" />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                size="lg"
                variant="secondary"
                disabled={isPending}
                onClick={onCancel}
                className={cn(!!onCancel ? "" : "invisible")}
              >
                {translations("cancel")}
              </Button>
              <Button
                type="submit"
                size="lg"
                variant="primary"
                disabled={isPending}
              >
                {translations("save_changes")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default TaskForm;
