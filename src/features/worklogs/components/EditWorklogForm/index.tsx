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
import { DottedSeparator } from "@/components/dotter-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateWorklog } from "@/features/worklogs/api/use-updateWorklog";
import { updateWorklogSchema } from "@/features/worklogs/schema";
import { cn, formatEfforts } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Worklog } from "@/features/worklogs/schema";

interface EditWorklogFormProps {
  worklog: Worklog & { member?: { name: string; email: string } };
  taskId: string;
  onCancel: () => void;
}

function EditWorklogForm({ worklog, taskId, onCancel }: EditWorklogFormProps) {
  const { mutate, isPending } = useUpdateWorklog();
  const translations = useTranslations("Worklogs");

  const form = useForm<z.infer<typeof updateWorklogSchema>>({
    resolver: zodResolver(updateWorklogSchema),
    defaultValues: {
      efforts: worklog.efforts,
      date: new Date(worklog.date),
      description: worklog.description || "",
    },
  });

  const onSubmit = (values: z.infer<typeof updateWorklogSchema>) => {
    mutate(
      {
        param: { worklogId: worklog.$id! },
        json: values,
        taskId,
      },
      {
        onSuccess: () => {
          onCancel();
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          {translations("edit_worklog")}
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
                name="efforts"
                render={({ field }) => {
                  const formattedTime = formatEfforts(field.value);

                  return (
                    <FormItem>
                      <FormLabel>{translations("efforts")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          step="1"
                          placeholder={translations("efforts_placeholder")}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              field.onChange(undefined);
                            } else {
                              const numValue = parseInt(value, 10);
                              if (!isNaN(numValue)) {
                                field.onChange(numValue);
                              }
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
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{translations("date")}</FormLabel>
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
                name="description"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{translations("description")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={translations("description_placeholder")}
                          {...field}
                          rows={4}
                        />
                      </FormControl>
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

export default EditWorklogForm;

