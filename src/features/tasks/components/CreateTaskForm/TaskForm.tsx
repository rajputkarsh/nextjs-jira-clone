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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  createTaskSchema,
} from "@/features/tasks/schema";
import { DottedSeparator } from "@/components/dotter-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateTask } from "@/features/tasks/api/use-createTask";
import { capitalCase, cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import MemberAvatar from "@/features/members/components/MemberAvatar";
import { TASK_STATUS_OBJECT } from "@/features/tasks/constants";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar";

interface ITaskFormProps {
  onCancel?: () => void;
  projectOptions: Array<{ id: string; name: string; imageUrl: string; }>;
  memberOptions: Array<{ id: string; name: string; }>;
}

function TaskForm({ onCancel, projectOptions, memberOptions }: ITaskFormProps) {
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useCreateTask();
  const translations = useTranslations("CreateTaskForm");

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      workspaceId
    },
  });

  const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
    mutate(
      {
        json: {
          ...values,
          workspaceId,
        },
      },
      {
        onSuccess: ({ data }) => {
          form.reset();
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          {translations("create_new_task")}
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
                name="assigneeId"
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
                                <ProjectAvatar image={project.imageUrl}
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
                {translations("create_task")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default TaskForm;
